module.exports = (config) =>
  require('../../configs/karma-config.js')(
    config,
    {
      files: [{ pattern: 'src/**/*.ts' }],
      logLevel: config.LOG_DEBUG,
    },
    {
      include: ['./src/**/*.ts', '../../node_modules/csstype/**/*'],
    },
  )
