import { Base } from '../common/base'
import { Util, MockedCSSName } from './util'
import { CSSProperties, CSSPropertyName } from './types'

export class Style<TElement extends Element> extends Base<TElement> {
  /**
   * Set style properties with given `CSSProperties` object.
   */
  css<T extends CSSProperties>(style: T): this
  /**
   * Set style property with given style-name and style-value.
   */
  css<T extends CSSPropertyName>(
    styleName: T,
    styleValue: CSSProperties[T],
  ): this
  /**
   * Get style property by given style-name. Returns computed style when
   * `computed` is `true`, otherwise returns inline style.
   */
  css<T extends CSSPropertyName>(
    styleName: T,
    computed?: boolean,
  ): CSSProperties[T]
  /**
   * Get style properties by given style-names. Returns computed style
   * properties when `computed`is `true`, otherwise returns inline style
   * properties.
   */
  css<T extends CSSPropertyName[]>(
    styleNames: T,
    computed?: boolean,
  ): { [K in T[number]]: CSSProperties[K] }
  /**
   * Get style properties. Returns computed style properties when `computed`
   * is `true`, otherwise returns inline style properties.
   */
  css(computed?: boolean): CSSProperties
  css(styleName: string, computed?: boolean): string | number
  css(styleNames: string[], computed?: boolean): Record<string, string | number>
  css(styleName: string, styleValue: string | number): this
  css(
    style?:
      | boolean
      | CSSPropertyName
      | CSSPropertyName[]
      | CSSProperties
      | string
      | string[],
    value?: string | number | null | boolean,
  ) {
    const node = this.node as any as HTMLElement

    // get full style as object
    if (style == null || typeof style === 'boolean') {
      if (style) {
        const result: CSSProperties = {}
        if (Util.isValidNode(node)) {
          const computedStyle = Util.getComputedStyle(node)
          Array.from(computedStyle).forEach((key) => {
            const name = Util.camelCase(key) as MockedCSSName
            result[name] = Util.css(node, key, computedStyle)
          })
        }
        return result
      }

      return Util.style(node)
    }

    // get style properties as array
    if (Array.isArray(style)) {
      const result: CSSProperties = {}
      if (value) {
        if (Util.isValidNode(node)) {
          const computedStyle = Util.getComputedStyle(node)
          style.forEach((name: MockedCSSName) => {
            result[name] = Util.css(node, name, computedStyle)
          })
        }
      } else {
        style.forEach((name: MockedCSSName) => {
          result[name] = Util.style(node, name)
        })
      }
      return result
    }

    // set styles in object
    if (typeof style === 'object') {
      Object.keys(style).forEach((name: CSSPropertyName) =>
        this.css(name, style[name as MockedCSSName]!),
      )
      return this
    }

    // get style for property
    if (value == null || typeof value === 'boolean') {
      return value ? Util.css(node, style) : Util.style(node, style)
    }

    // set style for property
    Util.style(node, style, value)

    return this
  }

  visible() {
    return !Util.isHiddenWithinTree(this.node)
  }

  show() {
    Util.showHide(this.node, true)
    return this
  }

  hide() {
    Util.showHide(this.node, false)
    return this
  }

  toggle(state?: boolean) {
    if (typeof state === 'boolean') {
      return state ? this.show() : this.hide()
    }

    return Util.isHiddenWithinTree(this.node) ? this.show() : this.hide()
  }
}
