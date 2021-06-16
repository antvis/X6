import { Text } from '../text/text'
import { TextBase } from '../text/base'
import { getFontSize } from '../text/util'

@TSpan.register('Tspan')
export class TSpan extends TextBase<SVGTSpanElement> {
  dx(): number
  dx(dx: number | string): this
  dx(dx?: number | string) {
    return this.attr('dx', dx)
  }

  dy(): number
  dy(dy: number | string): this
  dy(dy?: number | string) {
    return this.attr('dy', dy)
  }

  newLine() {
    // mark new line
    this.affix('newLined', true)

    const text = this.parent<Text>()
    if (text == null || !(text instanceof Text)) {
      return this
    }

    const index = text.indexOf(this)
    const dy = index > 0 ? text.leading() * getFontSize(this.node) : 0
    this.dy(dy).attr('x', text.x())
    return this
  }

  text(): string
  text(text: string | ((this: TSpan, tspan: TSpan) => void)): this
  text(text?: string | ((this: TSpan, tspan: TSpan) => void)) {
    if (text == null) {
      return (
        this.node.textContent + (this.affix<boolean>('newLined') ? '\n' : '')
      )
    }

    if (typeof text === 'function') {
      this.clear().build(true)
      text.call(this, this)
      this.build(false)
    } else {
      this.plain(text)
    }

    return this
  }
}
