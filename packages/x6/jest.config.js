'use strict'

module.exports = {
  // verbose: true,
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: './test/coverage',
}
