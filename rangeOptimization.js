"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var constants_1 = require("./constants");
var utils_1 = require("./utils");
/*---------------Правила валидации массива строк интервалов начало------------ */
var isEveryRangeMatchesRegularExpressionPattern = function (arrayOfStringRanges) {
    var validationStatus = arrayOfStringRanges.every(function (range) { return range.search(constants_1.REGEXP_TEMPLATE) !== -1; });
    return {
        validationErrorMessage: constants_1.VALIDATION_TEXT_ERRORS.EVERY_RANGE_MUST_MATCHES_REG_EXP,
        validationStatus: validationStatus
    };
};
var isEveryRangeIsValidRange = function (arrayOfStringRanges) {
    var validationStatus = convertArrayOfStringRangesToArrayOfNumericRanges(arrayOfStringRanges).every(function (range) { return range[0] < range[1]; });
    return {
        validationErrorMessage: constants_1.VALIDATION_TEXT_ERRORS.EVERY_RANGE_MUST_BE_VALID_RANGE,
        validationStatus: validationStatus
    };
};
var isArrayNotEmpty = function (arrayOfStringRanges) { return ({
    validationStatus: !!arrayOfStringRanges.length,
    validationErrorMessage: constants_1.VALIDATION_TEXT_ERRORS.NOT_EMPTY_ARRAY
}); };
/*---------------Правила валидации массива строк интервалов конец------------ */
var ARRAY_OF_STRING_RANGES_VALIDATION_RULES = [
    isArrayNotEmpty,
    isEveryRangeMatchesRegularExpressionPattern,
    isEveryRangeIsValidRange
];
var convertArrayOfStringRangesToArrayOfNumericRanges = function (arrayOfStringRanges) {
    return arrayOfStringRanges.map(function (range) {
        return []
            .concat(range.match(constants_1.REGEXP_TEMPLATE))
            .splice(1)
            .map(function (rangeValue) { return BigInt(rangeValue); });
    });
};
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
var rangeOptimization = function (arrayOfStringRanges) {
    var _a = utils_1.validator(arrayOfStringRanges, ARRAY_OF_STRING_RANGES_VALIDATION_RULES), validationStatus = _a.validationStatus, validationErrorMessage = _a.validationErrorMessage;
    if (!validationStatus) {
        throw Error(validationErrorMessage);
    }
    var arrayOfNumericRanges = convertArrayOfStringRangesToArrayOfNumericRanges(arrayOfStringRanges);
    var sortedArrayOfNumericRanges = arrayOfNumericRanges.sort(function (firstComparisonParameter, secondComparisonParameter) {
        if (secondComparisonParameter[0] >= firstComparisonParameter[0] &&
            secondComparisonParameter[0] <= secondComparisonParameter[1]) {
            return -1;
        }
        else {
            return 1;
        }
    });
    var optimizedArrayOfNumericRanges = sortedArrayOfNumericRanges.reduce(function (result, range) {
        if (!result.length) {
            return __spreadArrays(result, [range]);
        }
        var lastIndexOfResult = result.length - 1;
        var lastRangeOfResult = result[lastIndexOfResult];
        var firstValueOfLastRangeOfResult = lastRangeOfResult[0], secondValueOfLastRangeOfResult = lastRangeOfResult[1];
        var firstValueOfRange = range[0], secondValueOfRange = range[1];
        if (firstValueOfRange >= firstValueOfLastRangeOfResult &&
            firstValueOfRange <= secondValueOfLastRangeOfResult) {
            var resultWithoutLastElement = result.slice(0, lastIndexOfResult);
            result = __spreadArrays(resultWithoutLastElement, [
                [
                    firstValueOfLastRangeOfResult,
                    secondValueOfRange > secondValueOfLastRangeOfResult
                        ? secondValueOfRange
                        : secondValueOfLastRangeOfResult
                ]
            ]);
        }
        else {
            result = __spreadArrays(result, [range]);
        }
        return result;
    }, []);
    return optimizedArrayOfNumericRanges.map(function (range) {
        return range.join('-');
    });
};
exports["default"] = rangeOptimization;
