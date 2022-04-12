import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6Next',
      format: 'umd',
      file: 'dist/x6-next.js',
      sourcemap: true,
    },
  ],
  context: 'window',
})
