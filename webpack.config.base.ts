import * as path from 'path'
import * as webpack from 'webpack'

const config: webpack.Configuration = {
  output: {
    filename: '[name].min.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(process.cwd(), 'dist/'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  devtool: 'source-map',
}

export default config
