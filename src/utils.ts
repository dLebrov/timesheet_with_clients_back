import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';

interface ValidationResult<T> {
  valid: boolean;
  errors: Array<{
    property?: string;
    missing?: boolean;
    message: string;
    constraint: string;
  }>;
  data?: T;
}

// Словарь переводов для стандартных ошибок class-validator
const rusMsgs: Record<string, (prop: string, val?: any) => string> = {
  // при лишних полях
  whitelistValidation: (prop) => `Свойство «${prop}» не должно присутствовать`,
  // обязательное поле
  isDefined: (prop) => `Свойство «${prop}» обязательно`,
  // числа
  isNumber: (prop) => `Свойство «${prop}» должно быть числом`,
  // строки
  isString: (prop) => `Свойство «${prop}» должно быть строкой`,
  // булево
  isBoolean: (prop) => `Свойство «${prop}» должно быть булевым`,
  // массив
  isArray: (prop) => `Свойство «${prop}» должно быть массивом`,
  // enum
  isEnum: (prop, val) =>
    `Свойство «${prop}» должно быть одним из: ${Object.values(val).join(', ')}`,
  // даты
  isDate: (prop) => `Свойство «${prop}» должно быть датой`,
  // вложенные
  validateNested: (prop) => `Свойство «${prop}» некорректно структурировано`,
};

/**
 * Проверяет `data` по правилам DTO и возвращает подробный отчёт на русском.
 */
export const validateDto = <T extends object>(
  DtoClass: ClassConstructor<T>,
  data: unknown,
): ValidationResult<T> => {
  // 1) Проверяем, что это объект
  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [
        {
          message: 'Ожидается непустой объект для валидации',
          constraint: 'invalidInput',
        },
      ],
    };
  }

  // 2) Трансформируем и валидируем
  const instance = plainToInstance(DtoClass, data);
  const errors = validateSync(instance as object, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });

  // 3) Фильтруем служебные unknownValue и собираем сообщения
  const resultErrors = errors
    .filter((err) => !err.constraints?.unknownValue)
    .flatMap((err) => {
      const prop = err.property;
      return Object.entries(err.constraints!).map(([constraint, msg]) => {
        const translator = rusMsgs[constraint];
        const text = translator
          ? translator(prop!, (DtoClass as any)[prop])
          : msg; // если нет в словаре — оставляем оригинал
        return { property: prop, constraint, message: text };
      });
    });

  return {
    valid: resultErrors.length === 0,
    errors: resultErrors,
    data: resultErrors.length === 0 ? (data as T) : undefined,
  };
};
