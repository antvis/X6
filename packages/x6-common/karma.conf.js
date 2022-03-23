module.exports = (config) =>
  require('../../configs/karma-config.js')(config, {
    files: [{ pattern: './src/**/*.ts' }, { pattern: '__tests__/**/*.ts' }],
  })
