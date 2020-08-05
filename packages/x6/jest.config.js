module.exports = {
  // verbose: true,
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  transform: { '^.+\\.js$': 'babel-jest', '^.+\\.ts$': 'ts-jest' },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // collectCoverage: true,
  collectCoverageFrom: [
    './src/common/**/*.ts',
    './src/geometry/**/*.ts',
    './src/util/**/*.ts',
  ],
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: './test/coverage',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
}
