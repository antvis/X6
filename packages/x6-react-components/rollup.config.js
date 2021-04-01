import postcss from 'rollup-plugin-postcss'
import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6ReactComponents',
      format: 'umd',
      file: 'dist/x6-react-components.js',
      sourcemap: true,
      globals: {
        antd: 'antd',
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  ],
  external: ['antd', 'react', 'react-dom'],
  plugins: [
    postcss({
      minimize: true,
      sourceMap: false,
      extensions: ['.less', '.css'],
      use: [['less', { javascriptEnabled: true }]],
    }),
  ],
})
