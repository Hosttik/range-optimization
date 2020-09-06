export const REGEXP_TEMPLATE: RegExp = /^(-?\d+)-(-?\d+)/;

export const VALIDATION_TEXT_ERRORS = {
  NOT_EMPTY_ARRAY: 'Array must not be empty',
  EVERY_RANGE_MUST_MATCHES_REG_EXP: `Every range must matches RegExp: ${REGEXP_TEMPLATE}`,
  EVERY_RANGE_MUST_BE_VALID_RANGE: `Every range must be valid range`
};
