import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6PluginKeyboard',
      format: 'umd',
      file: 'dist/x6-plugin-keyboard.js',
      sourcemap: true,
      globals: {
        '@antv/x6-next': 'X6',
        '@antv/x6-common': 'X6Common',
      },
    },
  ],
  external: ['@antv/x6-next', '@antv/x6-common'],
})
