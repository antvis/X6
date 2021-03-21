import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6',
      format: 'umd',
      file: 'dist/x6.js',
      sourcemap: true,
    },
  ],
})
