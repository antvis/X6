import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6PluginClipboard',
      format: 'umd',
      file: 'dist/x6-plugin-clipboard.js',
      sourcemap: true,
      globals: {
        '@antv/x6': 'X6',
      },
    },
  ],
  external: ['@antv/x6'],
})
