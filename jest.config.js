'use strict'

module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '**/packages/*/src/**/*.test.ts',
    '**/packages/*/src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  collectCoverage: true,
  coverageDirectory: './test/coverage',
  coverageReporters: ['lcov'],
}
