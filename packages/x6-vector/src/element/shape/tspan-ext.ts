import { Attrs } from '../../types'
import { TextBase } from './text-base'
import { TSpan } from './tspan'

export class TextExtension<
  TSVGTextElement extends SVGTextElement | SVGTSpanElement | SVGTextPathElement
> extends TextBase<TSVGTextElement> {
  tspan(text = '', attrs?: Attrs | null) {
    const tspan = TSpan.create(text, attrs)

    if (!this.building) {
      this.clear()
    }

    return tspan.appendTo(this)
  }
}
