'use strict'

module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '**/packages/*/src/**/*.test.ts',
    '**/packages/*/src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coverageDirectory: './test/coverage',
}
