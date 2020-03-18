import * as webpack from 'webpack'
import baseConfig from '../../webpack.config.base'

const config: webpack.Configuration = {
  ...baseConfig,
  entry: {
    'x6-react-shape': './src/index.ts',
  },
  output: {
    ...baseConfig.output,
    library: 'X6ReactShape',
  },
}

export default config
