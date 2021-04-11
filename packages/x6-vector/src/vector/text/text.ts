import { Global } from '../../global'
import { UnitNumber } from '../../struct/unit-number'
import { Adopter } from '../../dom/common/adopter'
import { TSpan } from '../tspan/tspan'
import { TextBase } from './base'
import { AttrOverride } from './override'
import { SVGTextAttributes } from './types'

@Text.mixin(AttrOverride)
@Text.register('Text')
export class Text<
    TSVGTextElement extends SVGTextElement | SVGTextPathElement = SVGTextElement
  >
  extends TextBase<TSVGTextElement>
  implements AttrOverride.Depends {
  public affixes: Record<string | number, any> & {
    leading: number
  }

  protected rebuilding = true

  restoreAffix() {
    super.restoreAffix()
    if (this.affixes.leading == null) {
      this.affixes.leading = 1.3
    }
    return this
  }

  leading(): number
  leading(value: UnitNumber.Raw): this
  leading(value?: UnitNumber.Raw) {
    if (value == null) {
      return this.affixes.leading
    }

    this.affixes.leading = UnitNumber.create(value).valueOf()
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

        if (child.affixes.newLined) {
          child.attr('x', this.attr('x') as string)

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
          Adopter.adopt<TSpan>(children[index]).affixes.newLined === true
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
  export function create<Attributes extends SVGTextAttributes>(
    attrs?: Attributes | null,
  ): Text
  export function create<Attributes extends SVGTextAttributes>(
    text: string,
    attrs?: Attributes | null,
  ): Text
  export function create<Attributes extends SVGTextAttributes>(
    text?: string | Attributes | null,
    attrs?: Attributes | null,
  ): Text
  export function create<Attributes extends SVGTextAttributes>(
    text?: string | Attributes | null,
    attrs?: Attributes | null,
  ) {
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
