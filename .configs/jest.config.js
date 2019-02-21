module.exports = {
  rootDir: "..",
  preset: "ts-jest",
  testMatch: ["<rootDir>/*/src/**/*.test.ts"],
  moduleNameMapper: {
    "koa-create-context$": "<rootDir>/koa-create-context/src"
  },
  globals: {
    "ts-jest": {
      tsConfig:
        "/Users/localuser/code/@jameslnewell/koa/.configs/tsconfig.tests.json"
    }
  }
};
