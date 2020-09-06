"use strict";
exports.__esModule = true;
exports.functionResultChecker = exports.validator = void 0;
//валидатор, который можно переиспользовать
exports.validator = function (arrayOfCheckedValues, validationRules) {
    var validationInfo = {
        validationStatus: true,
        validationErrorMessage: ''
    };
    for (var _i = 0, validationRules_1 = validationRules; _i < validationRules_1.length; _i++) {
        var validationRule = validationRules_1[_i];
        var validationRuleResult = validationRule(arrayOfCheckedValues);
        if (!validationRuleResult.validationStatus) {
            validationInfo = validationRuleResult;
            break;
        }
    }
    return validationInfo;
};
exports.functionResultChecker = function (functionToCheck, checkerConfigArray) {
    for (var _i = 0, checkerConfigArray_1 = checkerConfigArray; _i < checkerConfigArray_1.length; _i++) {
        var resultCheckerConfig = checkerConfigArray_1[_i];
        var inputValues = resultCheckerConfig.inputValues, expectedResult = resultCheckerConfig.expectedResult;
        try {
            console.log("function result: " + JSON.stringify(functionToCheck(inputValues)) + ", expected result: " + JSON.stringify(expectedResult) + " ");
        }
        catch (e) {
            console.error("function result: " + e + ", expected result: " + expectedResult + " ");
        }
    }
};
