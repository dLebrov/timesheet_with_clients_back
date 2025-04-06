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

  // Добавляем импорт для всех enum из src/enums/enums
  sourceFile.addImportDeclaration({
    namedImports: Object.keys(enums),
    moduleSpecifier: '@prisma/client',
  });

  // Создаем класс DTO с именем ModelNameDto
  const className = `${modelName}Dto`;
  const dtoClass = sourceFile.addClass({
    name: className,
    isExported: true,
  });

  // Разбиваем блок модели на строки и фильтруем пустые и директивы
  const lines = modelBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//') && !line.startsWith('@@'));

  lines.forEach((line) => {
    // Пример строки: "id Int @id @default(autoincrement())"
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
    const tsType = isEnum ? fieldType : convertPrismaTypeToTs(fieldType);
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
function convertPrismaTypeToTs(prismaType: string): string {
  switch (prismaType) {
    case 'Int':
      return 'number';
    case 'Float':
      return 'number';
    case 'String':
      return 'string';
    case 'Boolean':
      return 'boolean';
    case 'DateTime':
      return 'Date';
    default:
      return 'any';
  }
}
