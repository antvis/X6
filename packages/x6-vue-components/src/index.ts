import { VueConstructor } from 'vue'
import Menu from './menu/index.vue'

export default {
  install (Vue: VueConstructor): void {
    Vue.component('X6Menu', Menu)
  }
}