import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6Geometry',
      format: 'umd',
      file: 'dist/x6-geometry.js',
      sourcemap: true,
    },
  ],
})
