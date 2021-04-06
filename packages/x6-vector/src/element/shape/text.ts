import { Attrs } from '../../types'
import { Global } from '../../global'
import { UNumber } from '../../struct/unumber'
import { Adopter } from '../adopter'
import { TSpan } from './tspan'
import { TextBase } from './text-base'

@Text.register('Text')
export class Text<
  TSVGTextElement extends SVGTextElement | SVGTextPathElement = SVGTextElement
> extends TextBase<TSVGTextElement> {
  public assets: Record<string | number, any> & {
    leading: number
  }

  protected rebuilding = true

  attr(): Attrs
  attr(names: string[]): Attrs
  attr<T extends string | number = string>(name: string): T
  attr(name: string, value: null): this
  attr(name: string, value: string | number, ns?: string): this
  attr(attrs: Attrs): this
  attr<T extends string | number>(
    name?: string,
    value?: string | number | null,
    ns?: string,
  ): T | this
  attr(
    name?: string | string[] | Attrs,
    value?: string | number | null,
    ns?: string,
  ): Attrs | string | number | this
  attr(
    name?: string | string[] | Attrs,
    value?: string | number | null,
    ns?: string,
  ) {
    if (name === 'leading') {
      return this.leading(value)
    }

    const ret = super.attr(name, value, ns)

    if (name === 'font-size' || name === 'x') {
      this.rebuild()
    }

    return ret
  }

  restoreAssets() {
    super.restoreAssets()
    if (this.assets.leading == null) {
      this.assets.leading = 1.3
    }
    return this
  }

  leading(): number
  leading(value: UNumber.Raw): this
  leading(value?: UNumber.Raw) {
    if (value == null) {
      return this.assets.leading
    }

    this.assets.leading = UNumber.create(value).valueOf()
    return this.rebuild()
  }

  rebuild(rebuilding?: boolean) {
    if (typeof rebuilding === 'boolean') {
      this.rebuilding = rebuilding
    }

    // define position of all lines
    if (this.rebuilding) {
      let blankLineOffset = 0
      const leading = this.leading()
      this.eachChild<TSpan>((child, index) => {
        const fontSize = Global.window
          .getComputedStyle(this.node)
          .getPropertyValue('font-size')

        const dy = leading * Number.parseFloat(fontSize)

        if (child.assets.newLined) {
          child.attr('x', this.attr('x'))

          if (child.text() === '\n') {
            blankLineOffset += dy
          } else {
            child.attr('dy', index ? dy + blankLineOffset : 0)
            blankLineOffset = 0
          }
        }
      })

      this.trigger('rebuild')
    }

    return this
  }

  text(): string
  text(text: string | ((this: TSpan, tspan: TSpan) => void)): this
  text(text?: string | ((this: TSpan, tspan: TSpan) => void)) {
    // getter
    if (text === undefined) {
      const children = this.node.childNodes
      let firstLine = 0
      let content = ''

      for (let index = 0, l = children.length; index < l; index += 1) {
        // skip textPaths - they are no lines
        if (children[index].nodeName === 'textPath') {
          if (index === 0) {
            firstLine = 1
          }
          continue
        }

        // add newline if its not the first child and newLined is set to true
        if (
          index !== firstLine &&
          children[index].nodeType !== 3 &&
          Adopter.adopt<TSpan>(children[index]).assets.newLined === true
        ) {
          content += '\n'
        }

        // add content of this node
        content += children[index].textContent
      }

      return content
    }

    this.clear().build(true)

    if (typeof text === 'function') {
      text.call(this, this)
    } else {
      const lines = `${text}`.split('\n')
      lines.forEach((line) => this.newLine(line))
    }

    return this.build(false).rebuild()
  }

  newLine(text = '') {
    return this.tspan(text).newLine()
  }
}

export namespace Text {
  export function create(attrs?: Attrs | null): Text
  export function create(text: string, attrs?: Attrs | null): Text
  export function create(
    text?: string | Attrs | null,
    attrs?: Attrs | null,
  ): Text
  export function create(text?: string | Attrs | null, attrs?: Attrs | null) {
    const t = new Text()
    if (text) {
      if (typeof text === 'string') {
        t.text(text)
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
