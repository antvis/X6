import config from '../../configs/rollup-config'

export default config({
  output: [
    {
      name: 'X6VueShape',
      format: 'umd',
      file: 'dist/x6-vue-shape.js',
      sourcemap: true,
      globals: {
        vue: 'Vue',
        '@vue/composition-api': 'VueCompositionAPI',
        '@antv/x6-next': 'X6',
        '@antv/x6-common': 'X6Common',
      },
    },
  ],
  external: ['@antv/x6-next', '@antv/x6-common', '@vue/composition-api', 'vue'],
})
