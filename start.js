"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var rangeOptimization_1 = require("./rangeOptimization");
//dev тулза для откладки значений, очень удобно работать в терминале ide при отладке и разработке
var checkerConfigArray = [
    {
        inputValues: ['1-3', '5-7', '2-4', '8-12', '5-11'],
        expectedResult: ['1-4', '5-12']
    },
    {
        inputValues: ['-5-1', '-10--1', '5-7'],
        expectedResult: ['-10-1', '5-7']
    }
];
utils_1.functionResultChecker(rangeOptimization_1["default"], checkerConfigArray);
