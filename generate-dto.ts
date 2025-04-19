import { Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

// Путь к файлу schema.prisma
const schemaPath = path.resolve(__dirname, 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

// Регулярные выражения для поиска моделей и enum
const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;
const enumRegex = /enum\s+(\w+)\s+{([\s\S]*?)}/g;

let match: RegExpExecArray | null;
const models: Array<{ modelName: string; modelBody: string }> = [];
const enums: Record<string, string[]> = {};

// Извлекаем модели и enum из schema.prisma
while ((match = modelRegex.exec(schemaContent)) !== null) {
  models.push({ modelName: match[1], modelBody: match[2] });
}
while ((match = enumRegex.exec(schemaContent)) !== null) {
  const enumName = match[1];
  enums[enumName] = match[2]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
}

// Функция для извлечения связей
function extractRelations(modelName: string): string[] {
  const model = models.find((m) => m.modelName === modelName);
  if (!model) return [];
  return model.modelBody
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('@@'))
    .map((l) => {
      const [field, raw] = l.split(/\s+/);
      return { field, type: raw.replace('?', '').replace('[]', '') };
    })
    .filter(({ type }) => models.some((m) => m.modelName === type))
    .map(({ field }) => field);
}

// Вспомогательные конвертеры
function convertPrismaTypeToTs(
  prismaType: string,
  isOptional: boolean,
): string {
  switch (prismaType) {
    case 'Int':
    case 'Float':
      return isOptional ? 'number | null' : 'number';
    case 'String':
      return isOptional ? 'string | null' : 'string';
    case 'Boolean':
      return 'boolean';
    case 'DateTime':
      return isOptional ? 'Date | null' : 'Date';
    default:
      return 'any';
  }
}

function convertPrismaTypeToSwagger(
  prismaType: string,
  isOptional: boolean,
): { type: string; nullable: boolean } {
  switch (prismaType) {
    case 'Int':
    case 'Float':
      return { type: 'number', nullable: isOptional };
    case 'String':
      return { type: 'string', nullable: isOptional };
    case 'Boolean':
      return { type: 'boolean', nullable: false };
    case 'DateTime':
      return { type: 'string', nullable: isOptional };
    default:
      return { type: 'any', nullable: false };
  }
}

const project = new Project();

models.forEach(({ modelName, modelBody }) => {
  const dtoFilePath = path.resolve(
    __dirname,
    'src',
    'swagger-dto',
    `${modelName.toLowerCase()}.dto.ts`,
  );
  const sourceFile = project.createSourceFile(dtoFilePath, '', {
    overwrite: true,
  });

  // Swagger импорт
  sourceFile.addImportDeclaration({
    namedImports: ['ApiProperty'],
    moduleSpecifier: '@nestjs/swagger',
  });

  // Наборы для динамических импортов
  const validatorImports = new Set<string>();
  const transformerImports = new Set<string>();

  // Разбираем поля модели
  const lines = modelBody
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('@@'));

  // Определяем enum и связи
  const usedEnums = new Set<string>();
  const relationsMap = new Map<string, string[]>();
  lines.forEach((line) => {
    const [fieldName, rawType] = line.split(/\s+/);
    const typeName = rawType.replace('?', '').replace('[]', '');
    if (enums[typeName]) usedEnums.add(typeName);
    if (models.some((m) => m.modelName === typeName)) {
      relationsMap.set(typeName, extractRelations(typeName));
    }
  });

  // Импорт enum из Prisma
  if (usedEnums.size) {
    sourceFile.addImportDeclaration({
      namedImports: Array.from(usedEnums),
      moduleSpecifier: '@prisma/client',
    });
  }
  // Импорт DTO связей
  relationsMap.forEach((_, name) => {
    sourceFile.addImportDeclaration({
      namedImports: [`${name}Dto`],
      moduleSpecifier: `./${name.toLowerCase()}.dto`,
    });
  });

  // Создаём класс DTO
  const dtoClass = sourceFile.addClass({
    name: `${modelName}Dto`,
    isExported: true,
  });

  lines.forEach((line) => {
    const [fieldName, rawType] = line.split(/\s+/);
    const isOptional = rawType.includes('?');
    const baseType = rawType.replace('?', '').replace('[]', '');
    const isArray = rawType.endsWith('[]');
    const isEnum = !!enums[baseType];
    const isRelation = relationsMap.has(baseType);

    // TS-тип с учётом Omit password для users
    let tsType: string;
    if (isRelation) {
      const omitArr = [...relationsMap.get(baseType)!];
      if (baseType === 'users') omitArr.push('password');
      const omitList = omitArr.map((f) => `'${f}'`).join(' | ') || "''";
      tsType = `Omit<${baseType}Dto, ${omitList}>${isArray ? '[]' : ''}`;
    } else if (isEnum) {
      tsType = `${baseType}${isArray ? '[]' : ''}`;
    } else {
      tsType = `${convertPrismaTypeToTs(baseType, isOptional)}${isArray ? '[]' : ''}`;
    }

    // Swagger-тип
    const swaggerType = isEnum
      ? { type: 'string', nullable: isOptional }
      : convertPrismaTypeToSwagger(baseType, isOptional);

    // Декораторы
    const decs: Array<{ name: string; arguments?: string[] }> = [];
    if (isOptional) {
      decs.push({ name: 'IsOptional', arguments: [] });
      validatorImports.add('IsOptional');
    } else {
      decs.push({ name: 'IsDefined', arguments: [] });
      validatorImports.add('IsDefined');
    }
    if (isArray) {
      decs.push({ name: 'IsArray', arguments: [] });
      validatorImports.add('IsArray');
    }
    if (isEnum) {
      decs.push({ name: 'IsEnum', arguments: [baseType] });
      validatorImports.add('IsEnum');
    } else if (swaggerType.type === 'string' && baseType === 'DateTime') {
      decs.push({ name: 'IsDate', arguments: [] });
      validatorImports.add('IsDate');
      decs.push({ name: 'Type', arguments: ['() => Date'] });
      transformerImports.add('Type');
    } else if (swaggerType.type === 'string') {
      decs.push({ name: 'IsString', arguments: [] });
      validatorImports.add('IsString');
    } else if (swaggerType.type === 'number') {
      decs.push({ name: 'IsNumber', arguments: [] });
      validatorImports.add('IsNumber');
    } else if (swaggerType.type === 'boolean') {
      decs.push({ name: 'IsBoolean', arguments: [] });
      validatorImports.add('IsBoolean');
    }
    if (isRelation) {
      decs.push({ name: 'ValidateNested', arguments: ['{ each: true }'] });
      validatorImports.add('ValidateNested');
      decs.push({ name: 'Type', arguments: [`() => ${baseType}Dto`] });
      transformerImports.add('Type');
    }
    decs.push({
      name: 'ApiProperty',
      arguments: [
        `{ type: ${isRelation ? `${baseType}Dto` : `'${swaggerType.type}'`}, ${isArray ? 'isArray: true, ' : ''}nullable: ${swaggerType.nullable}${isEnum ? `, enum: ${baseType}` : ''} }`,
      ],
    });

    dtoClass.addProperty({
      name: fieldName,
      hasQuestionToken: isOptional,
      type: tsType,
      decorators: decs,
    });
  });

  if (validatorImports.size)
    sourceFile.addImportDeclaration({
      namedImports: Array.from(validatorImports),
      moduleSpecifier: 'class-validator',
    });
  if (transformerImports.size)
    sourceFile.addImportDeclaration({
      namedImports: Array.from(transformerImports),
      moduleSpecifier: 'class-transformer',
    });
});

project
  .save()
  .then(() => console.log('DTO файлы успешно сгенерированы с валидацией!'));
