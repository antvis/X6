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
        'vue-demi': 'vueDemi',
        'react-dom': 'ReactDom',
        '@antv/x6': 'X6',
      },
    },
  ],
  external: ['@antv/x6', '@vue/composition-api', 'vue'],
})
