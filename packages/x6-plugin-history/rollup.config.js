import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6PluginHistory',
      format: 'umd',
      file: 'dist/x6-plugin-history.js',
      sourcemap: true,
      globals: {
        '@antv/x6': 'X6',
        '@antv/x6-common': 'X6Common',
      },
    },
  ],
  external: ['@antv/x6', '@antv/x6-common'],
})
