import * as webpack from 'webpack'
import baseConfig from '../../webpack.config.base'

const config: webpack.Configuration = {
  ...baseConfig,
  entry: {
    x6: './src/index.ts',
  },
  output: {
    ...baseConfig.output,
    library: 'X6',
  },
}

export default config
