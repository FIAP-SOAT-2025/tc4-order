module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary', 'json-summary'],
  testMatch: [
    '**/src/order/**/*.spec.ts',
    '**/src/repository/**/*.spec.ts',
  ],
  collectCoverageFrom: [
    'src/order/**/*.ts',
    'src/repository/**/*.ts',
    '!src/**/*.spec.ts',
  ],
};
