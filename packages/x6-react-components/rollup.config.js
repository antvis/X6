import postcss from 'rollup-plugin-postcss'
import { config } from '../../rollup.config'

export default config({
  plugins: [
    postcss({
      minimize: true,
      sourceMap: false,
      extensions: ['.less', '.css'],
      use: [['less', { javascriptEnabled: true }]],
    }),
  ],
})
