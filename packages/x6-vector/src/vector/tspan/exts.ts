import { TextBase } from '../text/base'
import { TSpan } from './tspan'
import { SVGTSpanAttributes } from './types'

export class TextExtension<
  TSVGTextElement extends SVGTextElement | SVGTSpanElement | SVGTextPathElement
> extends TextBase<TSVGTextElement> {
  tspan<Attributes extends SVGTSpanAttributes>(
    text = '',
    attrs?: Attributes | null,
  ) {
    const tspan = new TSpan().appendTo(this)
    if (text != null) {
      if (typeof text === 'string') {
        tspan.text(text)
        if (attrs) {
          tspan.attr(attrs)
        }
      } else {
        tspan.attr(text)
      }
    }

    if (!this.building) {
      this.clear()
    }

    return tspan
  }
}
