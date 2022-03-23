import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6Common',
      format: 'umd',
      file: 'dist/x6-common.js',
      sourcemap: true,
    },
  ],
})
