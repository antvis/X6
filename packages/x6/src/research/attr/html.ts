import { Attr } from '.'

export const html: Attr.Definition = {
  set(html, { view, elem }) {
    view.$(elem).html(`${html}`)
  },
}
