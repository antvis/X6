module.exports = (config) =>
  require('../../karma.conf.js')(config, {
    files: [{ pattern: './src/**/*.ts' }],
  })
