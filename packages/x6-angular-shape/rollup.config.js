import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6AngularShape',
      format: 'umd',
      file: 'dist/x6-angualr-shape.js',
      sourcemap: true,
      globals: {
        angular: 'Angular',
        '@antv/x6': 'X6',
      },
    },
  ],
  external: ['@antv/x6'],
})
