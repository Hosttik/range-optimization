import rangeOptimization from './rangeOptimization.ts';
import { VALIDATION_TEXT_ERRORS, REGEXP_TEMPLATE } from './constants.ts';

const expectToStrictEqual = valuesToCheck => {
  for (const valueToCheck of valuesToCheck) {
    expect(rangeOptimization(valueToCheck.inputValues)).toStrictEqual(
      valueToCheck.expectedResult
    );
  }
};

const expectError = (valuesToCheck, errorName) => {
  for (const valueToCheck of valuesToCheck) {
    try {
      rangeOptimization(valueToCheck);
    } catch (e) {
      expect(e).toStrictEqual(new Error(errorName));
    }
  }
};

test('rangeOptimization should return optimized range', () => {
  const valuesToCheck = [
    {
      inputValues: ['1-3', '5-7', '2-4', '8-12', '5-11'],
      expectedResult: ['1-4', '5-12']
    },
    {
      inputValues: ['1-2', '5-7', '11-12', '1-3', '8-11'],
      expectedResult: ['1-3', '5-7', '8-12']
    },
    {
      inputValues: ['1-2', '5-7', '11-12', '0-2', '8-11'],
      expectedResult: ['0-2', '5-7', '8-12']
    },
    {
      inputValues: ['1-2', '100-200', '10-101', '100-101', '100-102'],
      expectedResult: ['1-2', '10-200']
    },
    {
      inputValues: ['2-4', '5-7', '11-12', '1-4', '8-11'],
      expectedResult: ['1-4', '5-7', '8-12']
    },
    {
      inputValues: ['2-4', '3-5', '4-6', '5-7', '6-8'],
      expectedResult: ['2-8']
    }
  ];

  expectToStrictEqual(valuesToCheck);
});

test('rangeOptimization should work with negative range values', () => {
  const valuesToCheck = [
    {
      inputValues: ['-10-0', '1-10'],
      expectedResult: ['-10-0', '1-10']
    },
    {
      inputValues: ['-10-2', '1-10', '-20--11', '11-20'],
      expectedResult: ['-20--11', '-10-10', '11-20']
    },
    {
      inputValues: ['1-6', '5-7', '1-5', '1-6', '1-2', '1-3', '1-4'],
      expectedResult: ['1-7']
    }
  ];

  expectToStrictEqual(valuesToCheck);
});

test('rangeOptimization should  work right with ranges that include others ranges', () => {
  const valuesToCheck = [
    {
      inputValues: ['1-3', '5-7', '1-2', '1-2', '1-3'],
      expectedResult: ['1-3', '5-7']
    },
    {
      inputValues: ['0-4', '1-3', '8-12'],
      expectedResult: ['0-4', '8-12']
    },
    {
      inputValues: ['1-3', '0-4', '8-12'],
      expectedResult: ['0-4', '8-12']
    },
    {
      inputValues: ['1-2', '0-2', '0-2', '1-2', '0-2'],
      expectedResult: ['0-2']
    },
    {
      inputValues: ['-10--1', '-6--5', '1-2'],
      expectedResult: ['-10--1', '1-2']
    }
  ];

  expectToStrictEqual(valuesToCheck);
});

test('rangeOptimization should  work right with crossing ranges', () => {
  const valuesToCheck = [
    {
      inputValues: ['6-8', '5-7', '4-6', '3-5', '2-4'],
      expectedResult: ['2-8']
    },
    {
      inputValues: ['1-1000', '999-10000', '9999-100000', '99999-1000000'],
      expectedResult: ['1-1000000']
    },
    {
      inputValues: ['999-10000', '99999-1000000', '1-1000', '9999-100000'],
      expectedResult: ['1-1000000']
    },
    {
      inputValues: ['-5-1', '-10--1', '5-7'],
      expectedResult: ['-10-1', '5-7']
    },
    {
      inputValues: ['-10--1', '-5-1', '5-7'],
      expectedResult: ['-10-1', '5-7']
    }
  ];

  expectToStrictEqual(valuesToCheck);
});

test('rangeOptimization should return error if input array empty', () => {
  try {
    rangeOptimization([]);
  } catch (e) {
    expect(e).toStrictEqual(new Error(VALIDATION_TEXT_ERRORS.NOT_EMPTY_ARRAY));
  }
});

test(`rangeOptimization should return error if input array don't matches RegExp: ${REGEXP_TEMPLATE}`, () => {
  const valuesToCheck = [
    ['sdfsd-sdfsd', 'sdfsd-dsfs', '11-12', '0-2', '8-11'],
    ['11.5-13', '11-12', '0-2', '8-11'],
    ['+10-11', '12-20'],
    ['*10-11', '12-20'],
    ['10-*11', '12-20'],
    ['10=11', '12-20'],
    ['10=11', '12-20']
  ];

  expectError(
    valuesToCheck,
    VALIDATION_TEXT_ERRORS.EVERY_RANGE_MUST_MATCHES_REG_EXP
  );
});

test('rangeOptimization should return error if input array don`t matches valid ranges', () => {
  const valuesToCheck = [
    ['1-1', '1-2', '2-4', '5-10'],
    ['2-1', '1-2', '2-4', '5-10']
  ];

  expectError(
    valuesToCheck,
    VALIDATION_TEXT_ERRORS.EVERY_RANGE_MUST_BE_VALID_RANGE
  );
});

test('rangeOptimization should work with bigint range values', () => {
  const valuesToCheck = [
    {
      inputValues: [
        '1-2',
        '2-4',
        '5-10',
        '9007199254740991-9007199254741992',
        '9007199254741991-9007199254741997'
      ],
      expectedResult: ['1-4', '5-10', '9007199254740991-9007199254741997']
    },
    {
      inputValues: [
        '900719925474099100-900719925474199200',
        '900719925474199100-900719925474199700',
        '1000000000000000000-1000000000000000010',
        '10000000000000000000-10000000000000000010'
      ],
      expectedResult: [
        '900719925474099100-900719925474199700',
        '1000000000000000000-1000000000000000010',
        '10000000000000000000-10000000000000000010'
      ]
    }
  ];

  expectToStrictEqual(valuesToCheck);
});
