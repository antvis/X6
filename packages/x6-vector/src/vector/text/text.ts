import { UnitNumber } from '../../struct/unit-number'
import { Adopter } from '../../dom/common/adopter'
import { TSpan } from '../tspan/tspan'
import { TextBase } from './base'
import { Overrides } from './overrides'
import { getFontSize } from './util'

@Text.mixin(Overrides)
@Text.register('Text')
export class Text<
    TSVGTextElement extends
      | SVGTextElement
      | SVGTextPathElement = SVGTextElement,
  >
  extends TextBase<TSVGTextElement>
  implements Overrides.Depends
{
  public affixes: Record<string | number, any> & {
    leading: number
  }

  protected rebuilding = true

  restoreAffix() {
    super.restoreAffix()
    if (this.leading() == null) {
      this.leading(1.3)
    }
    return this
  }

  leading(): number
  leading(value: UnitNumber.Raw): this
  leading(value?: UnitNumber.Raw) {
    if (value == null) {
      return this.affix('leading')
    }

    this.affix('leading', UnitNumber.create(value).valueOf())
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
        const dy = leading * getFontSize(child.node)
        if (child.affix<boolean>('newLined')) {
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
  text(text: string | ((this: Text, t: Text) => void)): this
  text(text?: string | ((this: Text, t: Text) => void)) {
    // getter
    if (text === undefined) {
      const children = this.node.childNodes
      let firstLine = 0
      let content = ''

      for (let index = 0, l = children.length; index < l; index += 1) {
        // skip textPaths - they are no lines
        const child = children[index]
        if (child.nodeName === 'textPath') {
          if (index === 0) {
            firstLine = 1
          }
          continue
        }

        // add newline if its not the first child and newLined is set to true
        if (
          index !== firstLine &&
          child.nodeType !== 3 &&
          Adopter.adopt<TSpan>(child).affix<boolean>('newLined') === true
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
