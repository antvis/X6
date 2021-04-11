import { Base } from '../common/base'
import { Text } from './text'
import { SVGTextAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  text<Attributes extends SVGTextAttributes>(attrs?: Attributes | null): Text
  text<Attributes extends SVGTextAttributes>(
    text: string,
    attrs?: Attributes | null,
  ): Text
  text<Attributes extends SVGTextAttributes>(
    text?: string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Text.create(text, attrs).appendTo(this)
  }

  plain<Attributes extends SVGTextAttributes>(attrs?: Attributes | null): Text
  plain<Attributes extends SVGTextAttributes>(
    text: string,
    attrs?: Attributes | null,
  ): Text
  plain<Attributes extends SVGTextAttributes>(
    text?: string | Attributes | null,
    attrs?: Attributes,
  ) {
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
