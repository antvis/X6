module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  coverageDirectory: './test/coverage',
  coverageReporters: ['lcov', 'text-summary'],
}
