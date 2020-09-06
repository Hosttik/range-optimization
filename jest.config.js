module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },
  "transform": {
    "^.+\\.js?$": "babel-jest",
    "^.+\\.ts?$": "ts-jest"
  },
};
