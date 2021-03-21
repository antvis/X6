import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6Vector',
      format: 'umd',
      file: 'dist/x6-vector.js',
      sourcemap: true,
    },
  ],
})
