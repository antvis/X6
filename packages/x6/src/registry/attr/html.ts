import { Attr } from './index'

export const html: Attr.Definition = {
  set(html, { elem }) {
    elem.innerHTML = `${html}`
  },
}
