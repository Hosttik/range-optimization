import { functionResultChecker } from './utils';
import rangeOptimization from './rangeOptimization';

//dev функция для откладки значений, очень удобно работать в терминале ide при отладке и разработке
const checkerConfigArray = [
  {
    inputValues: ['1-3', '5-7', '2-4', '8-12', '5-11'],
    expectedResult: ['1-4', '5-12']
  }
];

functionResultChecker(rangeOptimization, checkerConfigArray);
