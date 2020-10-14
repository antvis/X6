const express = require(`express`)
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static(`public`))
}
