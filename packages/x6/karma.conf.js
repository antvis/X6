'use strict'

module.exports = config => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/entity/**/*.ts',
      'src/geometry/**/*.ts',
      'src/util/**/*.ts',
      'src/v/**/*.ts',
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
    },
    reporters: ['spec', 'karma-typescript'],
    browsers: ['Chrome'],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: { sourceMap: true },
      coverageOptions: {
        instrumentation: true,
        exclude: /\.test\.ts$/,
      },
      reports: {
        html: 'test/coverage',
        lcovonly: 'test/coverage',
        'text-summary': '',
      },
    },
    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,
    // logLevel: config.LOG_DEBUG,
  })
}
