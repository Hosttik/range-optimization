import {
  resultCheckerConfigArray,
  IResultCheckerConfig,
  IValidationRule,
  validationRulesArray
} from './types';

//валидатор, который можно переиспользовать
export const validator = (
  arrayOfCheckedValues: any[],
  validationRules: validationRulesArray
): IValidationRule => {
  let validationInfo: IValidationRule = {
    validationStatus: true,
    validationErrorMessage: ''
  };

  for (let validationRule of validationRules) {
    const validationRuleResult: IValidationRule = validationRule(
      arrayOfCheckedValues
    );
    if (!validationRuleResult.validationStatus) {
      validationInfo = validationRuleResult;
      break;
    }
  }
  return validationInfo;
};

export const functionResultChecker = (
  functionToCheck: Function,
  checkerConfigArray: resultCheckerConfigArray
): void => {
  for (const resultCheckerConfig of checkerConfigArray) {
    const {
      inputValues,
      expectedResult
    }: IResultCheckerConfig = resultCheckerConfig;
    try {
      console.log(
        `function result: ${JSON.stringify(
          functionToCheck(inputValues)
        )}, expected result: ${JSON.stringify(expectedResult)} `
      );
    } catch (e) {
      console.error(
        `function result: ${e}, expected result: ${expectedResult} `
      );
    }
  }
};
