import * as webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import baseConfig from '../../webpack.config.base'

const output = baseConfig.output
const plugins = baseConfig.plugins ? baseConfig.plugins : []
const rules = baseConfig.module ? baseConfig.module.rules : []

const config: webpack.Configuration = {
  ...baseConfig,
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.less'],
  },
  entry: {
    'x6-components': './src/index.ts',
  },
  output: {
    ...output,
    library: 'X6Components',
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
}

export default config
