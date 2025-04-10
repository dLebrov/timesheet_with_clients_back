import { Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

// Путь к файлу schema.prisma
const schemaPath = path.resolve(__dirname, 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

// Регулярное выражение для поиска всех моделей в схеме
const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;
const enumRegex = /enum\s+(\w+)\s+{([\s\S]*?)}/g;

let match: RegExpExecArray | null;
const models: Array<{ modelName: string; modelBody: string }> = [];
const enums: Record<string, string[]> = {};

// Извлекаем все модели
while ((match = modelRegex.exec(schemaContent)) !== null) {
  models.push({ modelName: match[1], modelBody: match[2] });
}

// Извлекаем все enum
while ((match = enumRegex.exec(schemaContent)) !== null) {
  const enumName = match[1];
  const enumValues = match[2]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  enums[enumName] = enumValues;
}

const project = new Project();

// Для каждой модели генерируем отдельный DTO-файл
models.forEach(({ modelName, modelBody }) => {
  const dtoFileName = `${modelName.toLowerCase()}.dto.ts`;
  const dtoFilePath = path.resolve(
    __dirname,
    'src',
    'swagger-dto',
    dtoFileName,
  );
  const sourceFile = project.createSourceFile(dtoFilePath, '', {
    overwrite: true,
  });

  // Импортируем декоратор ApiProperty
  sourceFile.addImportDeclaration({
    namedImports: ['ApiProperty'],
    moduleSpecifier: '@nestjs/swagger',
  });

  // Разбиваем блок модели на строки и фильтруем пустые и директивы
  const lines = modelBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//') && !line.startsWith('@@'));

  // Определяем, какие enums и связи используются в текущей модели
  const usedEnums = new Set<string>();
  const relatedModels = new Map<string, string[]>(); // Модель -> её связи

  lines.forEach((line) => {
    const parts = line.split(/\s+/);
    if (parts.length < 2) return;
    let fieldType = parts[1].replace('?', ''); // Убираем "?" для необязательных полей
    if (fieldType.endsWith('[]')) {
      fieldType = fieldType.slice(0, -2); // Убираем "[]" для массивов
    }
    if (enums[fieldType]) {
      usedEnums.add(fieldType); // Добавляем enum, если он используется
    } else if (models.some((model) => model.modelName === fieldType)) {
      const relatedModel = models.find(
        (model) => model.modelName === fieldType,
      );
      if (relatedModel) {
        const relatedFields = extractRelations(relatedModel.modelBody);
        relatedModels.set(fieldType, relatedFields);
      }
    }
  });

  // Добавляем импорт для используемых enums из @prisma/client
  if (usedEnums.size > 0) {
    sourceFile.addImportDeclaration({
      namedImports: Array.from(usedEnums),
      moduleSpecifier: '@prisma/client',
    });
  }

  // Добавляем отдельные импорты для связанных моделей
  relatedModels.forEach((_, model) => {
    sourceFile.addImportDeclaration({
      namedImports: [`${model}Dto`],
      moduleSpecifier: `./${model.toLowerCase()}.dto`,
    });
  });

  // Создаем основной DTO с именем ModelNameDto
  const className = `${modelName}Dto`;
  const dtoClass = sourceFile.addClass({
    name: className,
    isExported: true,
  });

  lines.forEach((line) => {
    const parts = line.split(/\s+/);
    if (parts.length < 2) return;
    const fieldName = parts[0];
    let fieldType = parts[1];
    let isOptional = fieldType.includes('?');
    fieldType = fieldType.replace('?', '');

    // Проверяем, является ли поле массивом (например, "String[]" )
    let isArray = false;
    if (fieldType.endsWith('[]')) {
      isArray = true;
      fieldType = fieldType.slice(0, -2);
    }

    // Проверяем, является ли поле enum
    const isEnum = enums[fieldType] !== undefined;
    const isRelation = relatedModels.has(fieldType);
    const tsType = isEnum
      ? fieldType
      : isRelation
        ? `Omit<${fieldType}Dto, ${relatedModels
            .get(fieldType)
            ?.map((relation) => `'${relation}'`)
            .join(' | ')}>`
        : convertPrismaTypeToTs(fieldType, isOptional);
    const finalType = isArray ? `${tsType}[]` : tsType;

    // Добавляем свойство класса с декоратором ApiProperty
    dtoClass.addProperty({
      name: fieldName,
      type: finalType,
      hasQuestionToken: isOptional,
      decorators: [
        {
          name: 'ApiProperty',
          arguments: isEnum
            ? [`{ enum: ${fieldType}, enumName: '${fieldType}' }`]
            : [],
        },
      ],
    });
  });
});

// Сохраняем все сгенерированные файлы
project.save().then(() => {
  console.log('DTO файлы успешно сгенерированы!');
});

// Функция для преобразования типов Prisma в типы TypeScript
function convertPrismaTypeToTs(
  prismaType: string,
  isOptional: boolean,
): string {
  switch (prismaType) {
    case 'Int':
      return 'number';
    case 'Float':
      return 'number';
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

// Функция для извлечения связей из модели
function extractRelations(modelBody: string): string[] {
  const lines = modelBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//') && !line.startsWith('@@'));
  const relations: string[] = [];
  lines.forEach((line) => {
    const parts = line.split(/\s+/);
    if (parts.length < 2) return;
    const fieldName = parts[0];
    const fieldType = parts[1].replace('?', '').replace('[]', '');
    if (models.some((model) => model.modelName === fieldType)) {
      relations.push(fieldName);
    }
  });
  return relations;
}
