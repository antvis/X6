import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Text } from './text'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  text(attrs?: Attrs | null): Text
  text(text: string, attrs?: Attrs | null): Text
  text(text?: string | Attrs | null, attrs?: Attrs | null) {
    return Text.create(text, attrs).appendTo(this)
  }

  plain(attrs?: Attrs | null): Text
  plain(text: string, attrs?: Attrs | null): Text
  plain(text?: string | Attrs | null, attrs?: Attrs) {
    const t = Text.create()
    if (text) {
      if (typeof text === 'string') {
        t.plain(text)
        if (attrs) {
          t.attr(attrs)
        }
      } else {
        t.attr(text)
      }
    }
    return t
  }
}
