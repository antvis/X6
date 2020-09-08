const es6transform = require('karma-typescript-es6-transform')

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [{ pattern: 'src/**/*.ts' }],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    reporters: ['spec', 'karma-typescript'],
    browsers: [process.env.CI ? 'ChromeHeadless' : 'Chrome'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--headless', '--no-sandbox'],
      },
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      include: ['./src/**/*.ts', '../../node_modules/csstype/**/*'],
      bundlerOptions: {
        sourceMap: true,
        transforms: [
          es6transform({
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current',
                  },
                },
              ],
            ],
          }),
        ],
      },
      coverageOptions: {
        instrumentation: true,
        exclude: /\.test\.ts$/,
      },
      reports: {
        html: 'test/coverage',
        lcovonly: {
          directory: 'test/coverage',
          filename: 'lcov.info',
          subdirectory: './',
        },
        'text-summary': '',
      },
    },
    client: {
      jasmine: {
        random: false,
      },
    },
    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,
  })
}
