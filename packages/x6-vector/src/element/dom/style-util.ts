import { Hook } from './style-hook'
import { DomUtil } from '../../util/dom'
import { Str } from '../../util/str'

export namespace Util {
  export type CSSKey = keyof Pick<CSSStyleDeclaration, 'left'>
  export type CSSKeys = Exclude<keyof CSSStyleDeclaration, number>
}

export namespace Util {
  export function getComputedStyleByName<TElement extends Element>(
    elem: TElement,
    name: string,
    styles:
      | Record<string, string>
      | CSSStyleDeclaration = DomUtil.getComputedStyle(elem),
  ) {
    let ret = styles.getPropertyValue
      ? (styles as CSSStyleDeclaration).getPropertyValue(name)
      : (styles as Record<string, string>)[name]

    if (ret === '' && !DomUtil.isAttached(elem)) {
      ret = style(elem, name)
    }

    return ret !== undefined ? `${ret}` : ret
  }

  // Convert dashed to camelCase, handle vendor prefixes.
  // Used by the css & effects modules.
  // Support: IE <=9 - 11+
  // Microsoft forgot to hump their vendor prefix
  export function cssCamelCase(str: string) {
    return Str.camelCase(str.replace(/^-ms-/, 'ms-')) as CSSKey
  }

  export const normalizeValue = (val?: string | null) =>
    val == null || /^(\s+)?$/.test(val) ? '' : val

  export function isCustomName(name: string) {
    return /^--/.test(name)
  }

  const cssPrefixes = ['Webkit', 'Moz', 'ms']
  const emptyStyle = document.createElement('div').style
  const vendorProps: Record<string, string> = {}

  // Return a vendor-prefixed property or undefined
  export function vendorName(name: string) {
    const capName = name[0].toUpperCase() + name.slice(1)
    for (let i = 0, l = cssPrefixes.length; i < l; i += 1) {
      const fixed = cssPrefixes[i] + capName
      if (fixed in emptyStyle) {
        return fixed
      }
    }

    return undefined
  }

  // Return a potentially-mapped vendor prefixed property
  export function normalizeName(name: string) {
    const final = vendorProps[name]

    if (final) {
      return final
    }

    if (name in emptyStyle) {
      return name
    }

    const fixed = vendorName(name) || name
    vendorProps[name] = fixed
    return fixed
  }

  export function isAutoPx(name: string) {
    const ralphaStart = /^[a-z]/
    const rautoPx = /^(?:Border(?:Top|Right|Bottom|Left)?(?:Width|)|(?:Margin|Padding)?(?:Top|Right|Bottom|Left)?|(?:Min|Max)?(?:Width|Height))$/
    // The first test is used to ensure that:
    // 1. The name starts with a lowercase letter (as we uppercase it for the second regex).
    // 2. The name is not empty.
    return (
      ralphaStart.test(name) &&
      rautoPx.test(name[0].toUpperCase() + name.slice(1))
    )
  }

  const rnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/
  const rcssNum = new RegExp(`^(?:([+-])=|)(${rnum.source})([a-z%]*)$`, 'i')
  export function parseCSSNum(raw: string) {
    return rcssNum.exec(raw)
  }

  export function adjustCSS<TElement extends Element>(
    elem: TElement,
    name: string,
    valueParts: string[],
  ): number
  export function adjustCSS<TElement extends Element>(
    elem: TElement,
    name: string,
    valueParts: string[] | null,
    tween?: any,
  ) {
    const currentValue = tween ? () => tween.cur() : () => css(elem, name, '')
    let initial = currentValue()
    let unit = (valueParts && valueParts[3]) || (isAutoPx(name) ? 'px' : '')
    // Starting value computation is required for potential unit mismatches
    const initialInUnit =
      elem.nodeType &&
      (!isAutoPx(name) || (unit !== 'px' && +initial)) &&
      parseCSSNum(css(elem, name))

    let tempValue = 0
    if (initialInUnit && initialInUnit[3] !== unit) {
      // Support: Firefox <=54 - 66+
      // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
      initial /= 2

      // Trust units reported by css()
      unit = unit || initialInUnit[3]

      // Iteratively approximate from a nonzero starting point
      tempValue = +initial || 1

      for (let i = 0, maxIterations = 20; i < maxIterations; i += 1) {
        // Evaluate and update our best guess (doubling guesses that zero out).
        // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
        style(elem, name, tempValue + unit)
        const scale = currentValue()
        if ((1 - scale) * (1 - (scale / initial || 0.5)) <= 0) {
          break
        }
        tempValue /= scale
      }

      tempValue *= 2
      style(elem, name, tempValue + unit)

      // Make sure we update the tween properties later on
      valueParts = valueParts || [] // eslint-disable-line no-param-reassign
    }

    let adjusted: number | undefined
    if (valueParts) {
      tempValue = tempValue || +initial || 0

      // Apply relative offset (+=/-=) if specified
      adjusted = valueParts[1]
        ? tempValue + (valueParts[1] === '-' ? -1 : 1) * +valueParts[2]
        : +valueParts[2]
      if (tween) {
        tween.unit = unit
        tween.start = tempValue
        tween.end = adjusted
      }
    }

    return adjusted
  }
}

export namespace Util {
  const cssNormalTransform = {
    letterSpacing: '0',
    fontWeight: '400',
  }

  export function css<TElement extends Element>(
    elem: TElement,
    name: string,
  ): string
  export function css<TElement extends Element>(
    elem: TElement,
    name: string,
    extra: false,
    styles?: Record<string, string> | CSSStyleDeclaration,
  ): string
  export function css<TElement extends Element>(
    elem: TElement,
    name: string,
    extra: true | '',
    styles?: Record<string, string> | CSSStyleDeclaration,
  ): number
  export function css<TElement extends Element>(
    elem: TElement,
    name: string,
    extra?: boolean | string,
    styles?: Record<string, string> | CSSStyleDeclaration,
  ): string | number
  export function css<TElement extends Element>(
    elem: TElement,
    name: string,
    extra?: boolean | string,
    styles?: Record<string, string> | CSSStyleDeclaration,
  ) {
    const origName = cssCamelCase(name)
    const isCustom = isCustomName(name)

    // Make sure that we're working with the right name. We don't
    // want to modify the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustom) {
      name = normalizeName(origName) // eslint-disable-line
    }

    let val: string | number | undefined
    const hook = Hook.get(name) || Hook.get(origName)

    // If a hook was provided get the computed value from there
    if (hook && hook.get) {
      val = hook.get(elem, true, extra)
    }

    // Otherwise, if a way to get the computed value exists, use that
    if (val === undefined) {
      val = getComputedStyleByName(elem, name, styles)
    }

    // Convert "normal" to computed value
    if (val === 'normal' && name in cssNormalTransform) {
      val = cssNormalTransform[name as keyof typeof cssNormalTransform]
    }

    // Make numeric if forced or a qualifier was provided and val looks numeric
    if (extra === '' || extra) {
      const num = +val
      return extra === true || Number.isFinite(num) ? num || 0 : val!
    }

    return val!
  }

  export function style<TElement extends Element>(
    elem: TElement,
    name: string,
  ): string
  export function style<TElement extends Element>(
    elem: TElement,
    name: string,
    value: string | number,
    extra?: boolean,
  ): void
  export function style<TElement extends Element>(
    elem: TElement,
    name: string,
    value?: string | number,
    extra?: boolean,
  ) {
    // Don't set styles on text and comment nodes
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
      return
    }

    const raw = ((elem as any) as HTMLElement).style
    if (!raw) {
      return
    }

    // Make sure that we're working with the right name
    const origName = cssCamelCase(name)
    const isCustom = isCustomName(name)

    // Make sure that we're working with the right name. We don't
    // want to query the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustom) {
      name = normalizeName(origName) // eslint-disable-line
    }

    // Gets hook for the prefixed version, then unprefixed version
    const hook = Hook.get(name) || Hook.get(origName)

    // Check if we're setting a value
    if (value !== undefined) {
      let parts: string[] | null = null
      let val: string | number | undefined = value

      if (typeof val === 'string') {
        parts = parseCSSNum(val)
        // Convert "+=" or "-=" to relative numbers
        if (parts && parts[1]) {
          val = adjustCSS(elem, name, parts)
        }
      }

      // Make sure that null and NaN values aren't set
      if (val == null || Number.isNaN(val)) {
        return
      }

      // If the value is a number, add `px` for certain CSS properties
      if (typeof val === 'number') {
        if (parts && parts[3]) {
          val += parseFloat(parts[3])
        }
        val = `${val}${isAutoPx(origName) ? 'px' : ''}`
      }

      // Support: IE <=9 - 11+
      // background-* props of a cloned element affect the source element
      if (DomUtil.isIE() && val === '' && name.startsWith('background')) {
        raw[name as CSSKey] = 'inherit'
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      let setting = true
      if (hook && hook.set) {
        val = hook.set(elem, val, extra)
        setting = val !== undefined
      }

      if (setting) {
        if (isCustom) {
          raw.setProperty(name, val as string)
        } else {
          raw[name as CSSKey] = val as string
        }
      }
    } else {
      // If a hook was provided get the non-computed value from there
      if (hook && hook.get) {
        const ret = hook.get(elem, false, extra)
        if (ret !== undefined) {
          return ret
        }
      }

      // Otherwise just get the value from the style object
      return raw[name as CSSKey]
    }

    return undefined
  }
}

export namespace Util {
  const cache: WeakMap<Element, string> = new WeakMap()

  export function isHiddenWithinTree<TElement extends Element>(elem: TElement) {
    const style = ((elem as any) as HTMLElement).style
    return (
      style.display === 'none' ||
      (style.display === '' && css(elem, 'display') === 'none')
    )
  }

  const defaultDisplayMap: Record<string, string> = {}

  export function getDefaultDisplay<TElement extends Element>(elem: TElement) {
    const doc = elem.ownerDocument
    const nodeName = elem.nodeName
    let display = defaultDisplayMap[nodeName]
    if (display) {
      return display
    }

    const temp = doc.body.appendChild(doc.createElement(nodeName))
    display = css(temp, 'display')
    temp.parentNode!.removeChild(temp)

    if (display === 'none') {
      display = 'block'
    }

    defaultDisplayMap[nodeName] = display

    return display
  }

  export function showHide<TElement extends Element>(
    elem: TElement,
    show: boolean,
  ) {
    const style = ((elem as any) as HTMLElement).style
    if (!style) {
      return
    }

    const display = style.display
    if (show) {
      // Since we force visibility upon cascade-hidden elements, an immediate (and slow)
      // check is required in this first loop unless we have a nonempty display value (either
      // inline or about-to-be-restored)
      if (display === 'none') {
        const value = cache.get(elem)
        if (!value) {
          style.display = ''
        }
      }
      if (style.display === '' && isHiddenWithinTree(elem)) {
        style.display = getDefaultDisplay(elem)
      }
    } else if (display !== 'none') {
      style.display = 'none'
      // Remember what we're overwriting
      cache.set(elem, display)
    }
  }
}
