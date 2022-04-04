import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6Core',
      format: 'umd',
      file: 'dist/x6-core.js',
      sourcemap: true,
    },
  ],
  context: 'window',
})
