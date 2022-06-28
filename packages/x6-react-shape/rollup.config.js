import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6ReactShape',
      format: 'umd',
      file: 'dist/x6-react-shape.js',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDom',
        '@antv/x6-next': 'X6',
        '@antv/x6-common': 'X6Common',
      },
    },
  ],
  external: ['@antv/x6-next', '@antv/x6-common', 'react', 'react-dom'],
})
