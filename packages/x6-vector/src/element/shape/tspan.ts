import { Attrs } from '../../types'
import { Global } from '../../global'
import { TextBase } from './text-base'
import { Text } from './text'

@TSpan.register('Tspan')
export class TSpan extends TextBase<SVGTSpanElement> {
  public affixes: Record<string | number, any> & {
    leading?: number
    newLined?: boolean
  }

  dx(): number
  dx(dx: number | string): this
  dx(dx?: number | string) {
    return this.attr<number>('dx', dx)
  }

  dy(): number
  dy(dy: number | string): this
  dy(dy?: number | string) {
    return this.attr<number>('dy', dy)
  }

  newLine() {
    // mark new line
    this.affixes.newLined = true

    const text = this.parent()
    if (text == null || !(text instanceof Text)) {
      return this
    }

    const index = text.indexOf(this)
    const fontSize = Global.window
      .getComputedStyle(this.node)
      .getPropertyValue('font-size')
    const dy = text.affixes.leading * Number.parseFloat(fontSize)
    return this.dy(index ? dy : 0).attr('x', text.x())
  }

  text(): string
  text(text: string | ((this: TSpan, tspan: TSpan) => void)): this
  text(text?: string | ((this: TSpan, tspan: TSpan) => void)) {
    if (text == null) {
      return this.node.textContent + (this.affixes.newLined ? '\n' : '')
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

export namespace TSpan {
  export function create(): TSpan
  export function create(attrs: Attrs | null): TSpan
  export function create(text: string, attrs?: Attrs | null): TSpan
  export function create(text?: string | Attrs | null, attrs?: Attrs | null) {
    const tspan = new TSpan()
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
    return tspan
  }
}
