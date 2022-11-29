const cpuCount = require('os').cpus().length
const es6Transform = require('karma-typescript-es6-transform')

module.exports = function (config, base, karmaTypescriptConfig) {
  const hasFlag = (flag) => process.argv.some((arg) => arg === flag)
  const isDebug = hasFlag('--debug')
  const isWatch = hasFlag('--auto-watch')

  const common = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',

    files: [{ pattern: './src/**/*.ts' }],

    // list of files to exclude
    exclude: [],

    plugins: [
      'jasmine-core',
      'karma-jasmine',
      'karma-typescript',
      'karma-spec-reporter',
      'karma-chrome-launcher',
    ],

    frameworks: ['jasmine', 'karma-typescript'],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    reporters: ['spec', 'karma-typescript'],

    specReporter: {
      suppressPassed: isWatch || isDebug,
    },

    browsers: [process.env.CI ? 'ChromeHeadless' : 'ChromeHeadless'],

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9222',
        ],
      },
    },

    client: {
      jasmine: {
        random: false,
      },
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: cpuCount || Infinity,
  }

  const reportsDir = 'test/coverage'

  config.set(
    Object.assign(common, base, {
      karmaTypescriptConfig: {
        tsconfig: 'tsconfig.json',
        include: ['./src/**/*.ts'],
        bundlerOptions: {
          sourceMap: true,
          transforms: [
            es6Transform({
              presets: [['@babel/preset-env']],
            }),
          ],
        },
        coverageOptions: {
          instrumentation: !isDebug,
          exclude: /(\.test)|(spec\.ts$)/,
        },
        reports: {
          html: reportsDir,
          lcovonly: {
            directory: reportsDir,
            subdirectory: './',
            filename: 'lcov.info',
          },
          cobertura: {
            directory: reportsDir,
            subdirectory: './',
            filename: 'coverage.xml',
          },
          'text-summary': '',
        },
        ...karmaTypescriptConfig,
      },
    }),
  )
}
