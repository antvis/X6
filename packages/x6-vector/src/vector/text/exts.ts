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
    const instance = new Text().appendTo(this)
    if (text) {
      if (typeof text === 'string') {
        instance.text(text)
        if (attrs) {
          instance.attr(attrs)
        }
      } else {
        instance.attr(text)
      }
    }
    return instance
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
    const instance = new Text().appendTo(this)
    if (text) {
      if (typeof text === 'string') {
        instance.plain(text)
        if (attrs) {
          instance.attr(attrs)
        }
      } else {
        instance.attr(text)
      }
    }
    return instance
  }
}
