import { VALIDATION_TEXT_ERRORS, REGEXP_TEMPLATE } from './constants';
import { IValidationRule } from './types';
import { validator } from './utils';

/*---------------Правила валидации массива строк интервалов начало------------ */
const isEveryRangeMatchesRegularExpressionPattern = (
  arrayOfStringRanges: string[]
): IValidationRule => {
  const validationStatus: boolean = arrayOfStringRanges.every(
    (range: string) => range.search(REGEXP_TEMPLATE) !== -1
  );
  return {
    validationErrorMessage:
      VALIDATION_TEXT_ERRORS.EVERY_RANGE_MUST_MATCHES_REG_EXP,
    validationStatus: validationStatus
  };
};

const isEveryRangeIsValidRange = (
  arrayOfStringRanges: string[]
): IValidationRule => {
  const validationStatus: boolean = convertArrayOfStringRangesToArrayOfNumericRanges(
    arrayOfStringRanges
  ).every((range: bigint[]) => range[0] < range[1]);

  return {
    validationErrorMessage:
      VALIDATION_TEXT_ERRORS.EVERY_RANGE_MUST_BE_VALID_RANGE,
    validationStatus: validationStatus
  };
};

const isArrayNotEmpty = (arrayOfStringRanges: string[]): IValidationRule => ({
  validationStatus: !!arrayOfStringRanges.length,
  validationErrorMessage: VALIDATION_TEXT_ERRORS.NOT_EMPTY_ARRAY
});
/*---------------Правила валидации массива строк интервалов конец------------ */

const ARRAY_OF_STRING_RANGES_VALIDATION_RULES = [
  isArrayNotEmpty,
  isEveryRangeMatchesRegularExpressionPattern,
  isEveryRangeIsValidRange
];

const convertArrayOfStringRangesToArrayOfNumericRanges = (
  arrayOfStringRanges: string[]
): bigint[][] =>
  arrayOfStringRanges.map((range: string) =>
    []
      .concat(range.match(REGEXP_TEMPLATE))
      .splice(1)
      .map((rangeValue: string) => BigInt(rangeValue))
  );

/* Алгоритм работы rangeOptimization:
    1. проверяем на валидность массив интервалов состоящий из строк:
       - за соответствие типов отвечает typescript
       - массив не должен быть пустым иначе функция выкенет ошибку
       - интервал должен соответстовать шаблону "1-3", отрицательные значения в шаблоне должны выглядеть так: "-10--5",
       - первое значение в интервале всегда должно быть строго меньше второго
    2. конвертируем массив интервалов состоящий из строк в массив интервалов состоящий из массивов с bigInt значениями
    ( это позволяет нам безопасно работать с числами больше чем Number.MAX_SAFE_INTEGER(ограничение обычного int в js))
    3. сортируем массив интервалов (['1-3','5-7','2-4','8-12','5-11'] => ['1-3','2-4','5-7','5-11','8-12'])
    4. оптимизируем интервалы проверя пересечение значений
*/
const rangeOptimization = (arrayOfStringRanges: string[]): string[] | Error => {
  const {
    validationStatus,
    validationErrorMessage
  }: IValidationRule = validator(
    arrayOfStringRanges,
    ARRAY_OF_STRING_RANGES_VALIDATION_RULES
  );

  if (!validationStatus) {
    throw Error(validationErrorMessage);
  }

  const arrayOfNumericRanges: bigint[][] = convertArrayOfStringRangesToArrayOfNumericRanges(
    arrayOfStringRanges
  );

  const sortedArrayOfNumericRanges: bigint[][] = arrayOfNumericRanges.sort(
    (
      firstComparisonParameter: bigint[],
      secondComparisonParameter: bigint[]
    ): number => {
      if (
        secondComparisonParameter[0] >= firstComparisonParameter[0] &&
        secondComparisonParameter[0] <= secondComparisonParameter[1]
      ) {
        return -1;
      } else {
        return 1;
      }
    }
  );

  const optimizedArrayOfNumericRanges: bigint[][] = sortedArrayOfNumericRanges.reduce(
    (result: bigint[][], range: bigint[]) => {
      if (!result.length) {
        return [...result, range];
      }

      const lastIndexOfResult: number = result.length - 1;
      const lastRangeOfResult: bigint[] = result[lastIndexOfResult];

      const [
        firstValueOfLastRangeOfResult,
        secondValueOfLastRangeOfResult
      ]: bigint[] = lastRangeOfResult;

      const [firstValueOfRange, secondValueOfRange]: bigint[] = range;

      if (
        firstValueOfRange >= firstValueOfLastRangeOfResult &&
        firstValueOfRange <= secondValueOfLastRangeOfResult
      ) {
        const resultWithoutLastElement: bigint[][] = result.slice(
          0,
          lastIndexOfResult
        );
        result = [
          ...resultWithoutLastElement,
          [
            firstValueOfLastRangeOfResult,
            secondValueOfRange > secondValueOfLastRangeOfResult
              ? secondValueOfRange
              : secondValueOfLastRangeOfResult
          ]
        ];
      } else {
        result = [...result, range];
      }

      return result;
    },
    []
  );

  return optimizedArrayOfNumericRanges.map((range: bigint[]) =>
    range.join('-')
  );
};

export default rangeOptimization;
