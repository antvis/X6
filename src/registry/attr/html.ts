import type { Definition } from './index'

export const html: Definition = {
  set(html, { elem }) {
    elem.innerHTML = `${html}`
  },
}
