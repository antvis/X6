'use strict'

module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'ts'],
}
