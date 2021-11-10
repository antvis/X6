import { Attrs } from '../../types'
import { Global } from '../../global'
import { TextBase } from './text-base'
import { Text } from './text'

@Tspan.register('Tspan')
export class Tspan extends TextBase<SVGTSpanElement> {
  public assets: Record<string | number, any> & {
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
    this.assets.newLined = true

    const text = this.parent()
    if (text == null || !(text instanceof Text)) {
      return this
    }

    const index = text.indexOf(this)
    const fontSize = Global.window
      .getComputedStyle(this.node)
      .getPropertyValue('font-size')
    const dy = text.assets.leading * Number.parseFloat(fontSize)
    return this.dy(index ? dy : 0).attr('x', text.x())
  }

  text(): string
  text(text: string | ((this: Tspan, tspan: Tspan) => void)): this
  text(text?: string | ((this: Tspan, tspan: Tspan) => void)) {
    if (text == null) {
      return this.node.textContent + (this.assets.newLined ? '\n' : '')
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

export namespace Tspan {
  export function create(): Tspan
  export function create(attrs: Attrs | null): Tspan
  export function create(text: string, attrs?: Attrs | null): Tspan
  export function create(text?: string | Attrs | null, attrs?: Attrs | null) {
    const tspan = new Tspan()
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
