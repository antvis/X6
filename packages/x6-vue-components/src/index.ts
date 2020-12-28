import { App } from 'vue'
import X6Menubar from './menubar/menubar.vue'
import X6MenubarItem from './menubar/item.vue'
const components = [X6Menubar, X6MenubarItem]

const install = (app: App): void => {
  // todo: 增加多语言 支持
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { X6Menubar, X6MenubarItem }

export default {
  install,
}
