module.exports = (config) =>
  require('../../configs/karma-config.js')(
    config,
    {
      files: [{ pattern: 'src/**/*.ts' }],
    },
    {
      include: ['./src/**/*.ts', '../../node_modules/csstype/**/*'],
    },
  )
