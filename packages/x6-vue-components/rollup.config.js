import typescript from 'rollup-plugin-typescript'
import css from 'rollup-plugin-css-only'
import vue from 'rollup-plugin-vue'

export default {
  input: 'src/index.ts',
  output: {
    exports: 'default',
  },
  external: ['vue', 'vue-property-decorator'],
  plugins: [typescript(), css(), vue()],
}
