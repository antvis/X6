import { App } from 'vue'
import { X6Menu, X6MenuItem, X6Submenu, X6Divider } from './menu'
import { X6Menubar, X6MenubarItem } from './menubar'

const components = [
  X6Menubar,
  X6MenubarItem,
  X6Menu,
  X6MenuItem,
  X6Submenu,
  X6Divider,
]

const install = (app: App): void => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { X6Menubar, X6MenubarItem }

export default {
  install,
}
