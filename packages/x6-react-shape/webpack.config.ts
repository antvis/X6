import * as webpack from 'webpack'
import baseConfig from '../../webpack.config.base'

const config: webpack.Configuration = {
  ...baseConfig,
  entry: {
    'x6-react-shape': './src/umd.ts',
  },
  output: {
    ...baseConfig.output,
    library: 'X6ReactShape',
  },
  externals: ['react', 'react-dom', '@antv/x6'],
}

export default config
