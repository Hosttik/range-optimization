export interface IValidationRule {
    validationStatus: boolean,
    validationErrorMessage: string
}

export interface IResultCheckerConfig {
    inputValues: any[],
    expectedResult: any[] | string
}

export type resultCheckerConfigArray = Array<IResultCheckerConfig>

export type validationRulesArray = Array<(arrayOfStringRanges: string[]) => IValidationRule>

