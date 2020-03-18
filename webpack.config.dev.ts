import * as webpack from 'webpack'
import baseConfig from './webpack.config.base'

const config: webpack.Configuration = {
  ...baseConfig,
  devtool: 'cheap-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
}

export default config
