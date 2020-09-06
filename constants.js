"use strict";
exports.__esModule = true;
exports.VALIDATION_TEXT_ERRORS = exports.REGEXP_TEMPLATE = void 0;
exports.REGEXP_TEMPLATE = /^(-?\d+)-(-?\d+)/;
exports.VALIDATION_TEXT_ERRORS = {
    NOT_EMPTY_ARRAY: 'Array must not be empty',
    EVERY_RANGE_MUST_MATCHES_REG_EXP: "Every range must matches RegExp: " + exports.REGEXP_TEMPLATE,
    EVERY_RANGE_MUST_BE_VALID_RANGE: "Every range must be valid range"
};
