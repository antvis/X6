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
    const tspan = TSpan.create(text, attrs)

    if (!this.building) {
      this.clear()
    }

    return tspan.appendTo(this)
  }
}
