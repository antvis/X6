import { DomUtil } from '../../util/dom'
import { Util } from './style-util'
import { Hook } from './style-hook'
import { Primer } from './primer'

export class Style<N extends Node> extends Primer<N> {
  css(computed?: boolean): Record<string, string>
  css(
    style: (Util.CSSKeys | string)[],
    computed?: boolean,
  ): Record<string, string>
  css(style: Util.CSSKeys | string, computed?: boolean): string
  css(style: Record<string, string> | CSSStyleDeclaration): this
  css(style: Util.CSSKeys | string, value: string): this
  css(
    style?:
      | boolean
      | string
      | Util.CSSKeys
      | (string | Util.CSSKeys)[]
      | Record<string, string>
      | CSSStyleDeclaration,
    value?: string | null | boolean,
  ) {
    const elem = DomUtil.toElement<HTMLElement>(this.node)

    // get full style as object
    if (style == null || typeof style === 'boolean') {
      const ret: Record<string, string> = {}
      if (style) {
        const computedStyle = DomUtil.getComputedStyle(elem)
        Array.from(computedStyle).forEach((key) => {
          ret[key] = Util.css(elem, key, false, computedStyle)
        })
      } else {
        elem.style.cssText
          .split(/\s*;\s*/)
          .filter((str) => str.length > 0)
          .forEach((str) => {
            const parts = str.split(/\s*:\s*/)
            ret[Util.cssCamelCase(parts[0])] = Util.style(elem, parts[0])
          })
      }
      return ret
    }

    // get style properties as array
    if (Array.isArray(style)) {
      const ret: Record<string, string> = {}
      const names = style.map((name) => Util.cssCamelCase(name))
      if (value) {
        const computedStyle = DomUtil.getComputedStyle(elem)
        names.forEach((name) => {
          ret[name] = Util.css(elem, name, false, computedStyle)
        })
      } else {
        names.forEach((name) => {
          ret[name] = Util.style(elem, name)
        })
      }
      return ret
    }

    // set styles in object
    if (typeof style === 'object') {
      Object.keys(style).forEach((name) =>
        this.css(name, style[name as Util.CSSKey]),
      )
      return this
    }

    // get style for property
    if (typeof value == null || typeof value === 'boolean') {
      return value ? Util.css(elem, style) : Util.style(elem, style)
    }

    // set style for property
    if (typeof value === 'string') {
      Util.style(elem, style, value)
    }

    return this
  }

  visible() {
    return !Util.isHiddenWithinTree(DomUtil.toElement(this.node))
  }

  show() {
    Util.showHide(DomUtil.toElement(this.node), true)
    return this
  }

  hide() {
    Util.showHide(DomUtil.toElement(this.node), false)
    return this
  }

  toggle(state?: boolean) {
    if (typeof state === 'boolean') {
      return state ? this.show() : this.hide()
    }

    return Util.isHiddenWithinTree(DomUtil.toElement(this.node))
      ? this.show()
      : this.hide()
  }
}

export namespace Style {
  export const registerHook = Hook.add
}
