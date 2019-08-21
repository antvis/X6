module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '**/src/**/*.test.ts',
    '**/src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  coverageDirectory: './test/coverage',
  coverageReporters: ['lcov'],
};
