module.exports = {
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.tests.json"
    }
  }
};
