import type { AttrDefinition } from './index'

export const html: AttrDefinition = {
  set(html, { elem }) {
    elem.innerHTML = `${html}`
  },
}
