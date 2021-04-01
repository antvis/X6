import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6React',
      format: 'umd',
      file: 'dist/x6-react.js',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@antv/x6': 'X6',
      },
    },
  ],
  external: ['@antv/x6', 'react', 'react-dom'],
})
