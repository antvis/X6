import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6PluginSnapline',
      format: 'umd',
      file: 'dist/x6-plugin-snapline.js',
      sourcemap: true,
      globals: {
        '@antv/x6': 'X6',
        '@antv/x6-common': 'X6Common',
        '@antv/x6-geometry': 'X6Geometry',
      },
    },
  ],
  external: ['@antv/x6', '@antv/x6-common', '@antv/x6-geometry'],
})
