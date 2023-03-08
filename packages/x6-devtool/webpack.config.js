const path = require('path')

module.exports = {
  entry: './ui/index.js',
  output: {
    path: path.resolve(__dirname, 'devtools', 'ui'),
    filename: 'ui.js',
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
}
