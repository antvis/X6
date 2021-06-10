import { Global } from '../../global'
import { isInDocument } from '../../util/dom'
import { Hook } from './hook'
import { CSSProperties } from './types'

export type MockedCSSName = 'left'

export namespace Util {
  export function getComputedStyle<TElement extends Element>(node: TElement) {
    const view = node.ownerDocument.defaultView || Global.window
    return view.getComputedStyle(node)
  }

  export function getComputedStyleValue<TElement extends Element>(
    node: TElement,
    name: string,
    styles: Record<string, string> | CSSStyleDeclaration = getComputedStyle(
      node,
    ),
  ) {
    let result: string | number = styles.getPropertyValue
      ? (styles as CSSStyleDeclaration).getPropertyValue(name)
      : (styles as Record<string, string>)[name]

    if (result === '' && !isInDocument(node)) {
      result = style(node, name)
    }

    return result !== undefined ? `${result}` : result
  }

  export function isValidNode<TElement extends Element>(node: TElement) {
    // Don't set styles on text and comment nodes
    if (!node || node.nodeType === 3 || node.nodeType === 8) {
      return false
    }

    const style = (node as any as HTMLElement).style
    if (!style) {
      return false
    }

    return true
  }

  export function isCustomStyleName(styleName: string) {
    return styleName.indexOf('--') === 0
  }

  // Convert dashed to camelCase, handle vendor prefixes.
  // Used by the css & effects modules.
  // Support: IE <=9 - 11+
  // Microsoft forgot to hump their vendor prefix
  export function camelCase(str: string) {
    const to = (s: string) =>
      s
        .replace(/^-ms-/, 'ms-')
        .replace(/-([a-z])/g, (input) => input[1].toUpperCase())

    if (isCustomStyleName(str)) {
      return `--${to(str.substring(2))}`
    }

    return to(str)
  }

  export function kebabCase(str: string) {
    return (
      str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // vendor
        .replace(/^([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^ms-/, '-ms-')
    )
  }

  export function tryConvertToNumber(value: string | number) {
    if (typeof value === 'number') {
      return value
    }

    const numReg = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i
    return numReg.test(value) ? +value : value
  }
}

export namespace Util {
  /**
   * CSS properties which accept numbers but are not in units of "px".
   */
  export const isUnitlessNumber: Record<string, boolean> = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,

    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true,
  }

  /**
   * Support style names that may come passed in prefixed by adding permutations
   * of vendor prefixes.
   */
  const prefixes = ['Webkit', 'ms', 'Moz', 'O']

  function prefixKey(prefix: string, key: string) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1)
  }

  // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
  // infinite loop, because it iterates over the newly added props too.
  Object.keys(isUnitlessNumber).forEach((prop) => {
    prefixes.forEach((prefix) => {
      isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop]
    })
  })

  const style = document.createElement('div').style
  const cache: Record<string, string> = {}

  // Return a vendor-prefixed property or undefined
  function vendor(styleName: string) {
    for (let i = 0, l = prefixes.length; i < l; i += 1) {
      const prefixed = prefixKey(prefixes[i], styleName)
      if (prefixed in style) {
        return prefixed
      }
    }

    return styleName
  }

  // Return a potentially-mapped vendor prefixed property
  export function tryVendor(styleName: string) {
    const final = cache[styleName]
    if (final) {
      return final
    }

    if (styleName in style) {
      return styleName
    }

    const prefixed = vendor(styleName)
    cache[styleName] = prefixed
    return prefixed
  }
}

export namespace Util {
  export function css<TElement extends Element>(
    node: TElement,
    name: string,
    presets?: Record<string, string> | CSSStyleDeclaration,
  ) {
    const styleName = camelCase(name)
    const isCustom = isCustomStyleName(name)

    // Make sure that we're working with the right name. We don't
    // want to modify the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustom) {
      name = tryVendor(styleName) // eslint-disable-line
    }

    let val: string | number | undefined
    const hook = Hook.get(name) || Hook.get(styleName)

    // If a hook was provided get the computed value from there
    if (hook && hook.get) {
      val = hook.get(node, true)
    }

    // Otherwise, if a way to get the computed value exists, use that
    if (val === undefined) {
      val = getComputedStyleValue(node, kebabCase(name), presets)
    }

    return tryConvertToNumber(val)
  }
}

export namespace Util {
  function normalizeValue(
    name: string,
    value: string | number,
    isCustomProperty: boolean,
  ) {
    const isEmpty = value == null || typeof value === 'boolean' || value === ''
    if (isEmpty) {
      return ''
    }

    if (
      !isCustomProperty &&
      typeof value === 'number' &&
      value !== 0 &&
      !isUnitlessNumber[name]
    ) {
      return `${value}px`
    }

    return `${value}`.trim()
  }

  export function style<TElement extends Element>(node: TElement): CSSProperties
  export function style<TElement extends Element>(
    node: TElement,
    name: string,
  ): string | number
  export function style<TElement extends Element>(
    node: TElement,
    name: string,
    value: string | number,
  ): void
  export function style<TElement extends Element>(
    node: TElement,
    name?: string,
    value?: string | number,
  ) {
    if (!isValidNode(node)) {
      return typeof name === 'undefined' ? {} : undefined
    }

    const styleDeclaration = (node as any as HTMLElement).style

    if (typeof name === 'undefined') {
      const result: CSSProperties = {}
      styleDeclaration.cssText
        .split(/\s*;\s*/)
        .filter((str) => str.length > 0)
        .forEach((str) => {
          const parts = str.split(/\s*:\s*/)
          result[camelCase(parts[0]) as MockedCSSName] = style(node, parts[0])
        })
      return result
    }

    // Make sure that we're working with the right name
    const styleName = camelCase(name)
    const isCustom = isCustomStyleName(name)

    // Make sure that we're working with the right name. We don't
    // want to query the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustom) {
      name = tryVendor(styleName) // eslint-disable-line
    }

    // Gets hook for the prefixed version, then unprefixed version
    const hook = Hook.get(name) || Hook.get(styleName)

    // Setting a value
    if (value !== undefined) {
      let val = value
      // If a hook was provided, use that value, otherwise just set the specified value
      let setting = true
      if (hook && hook.set) {
        const result = hook.set(node, val)
        setting = result !== undefined
        if (setting) {
          val = result!
        }
      }

      if (setting) {
        val = normalizeValue(name, val, isCustom)
        if (name === 'float') {
          name = 'cssFloat' // eslint-disable-line
        }

        if (isCustom) {
          styleDeclaration.setProperty(kebabCase(name), val)
        } else {
          styleDeclaration[name as MockedCSSName] = val
        }
      }
    } else {
      let ret: string | number | undefined
      // If a hook was provided get the non-computed value from there
      if (hook && hook.get) {
        ret = hook.get(node, false)
      }

      // Otherwise just get the value from the style object
      if (ret === undefined) {
        ret = styleDeclaration.getPropertyValue(kebabCase(name))
      }

      return tryConvertToNumber(ret)
    }
  }
}

export namespace Util {
  const cache: WeakMap<Node, string> = new WeakMap()

  export function isHiddenWithinTree<TElement extends Element>(node: TElement) {
    const style = (node as any as HTMLElement).style
    return (
      style.display === 'none' ||
      (style.display === '' && css(node, 'display') === 'none')
    )
  }

  const defaultDisplayMap: Record<string, string> = {}

  export function getDefaultDisplay<TElement extends Node>(node: TElement) {
    const nodeName = node.nodeName
    let display = defaultDisplayMap[nodeName]
    if (display) {
      return display
    }

    const doc = node.ownerDocument || Global.document
    const temp = doc.body.appendChild(doc.createElement(nodeName))
    display = css(temp, 'display') as string

    if (temp.parentNode) {
      temp.parentNode.removeChild(temp)
    }

    if (display === 'none') {
      display = 'block'
    }

    defaultDisplayMap[nodeName] = display

    return display
  }

  export function showHide<TElement extends Element>(
    node: TElement,
    show: boolean,
  ) {
    const style = (node as any as HTMLElement).style
    if (!style) {
      return
    }

    const display = style.display
    let val: string | undefined
    if (show) {
      if (display === 'none') {
        val = cache.get(node)
        if (!val) {
          style.display = ''
        }
      }

      // for cascade-hidden
      if (style.display === '' && isHiddenWithinTree(node)) {
        val = getDefaultDisplay(node)
      }
    } else if (display !== 'none') {
      val = 'none'
      // Remember what we're overwriting
      cache.set(node, display)
    }

    if (val != null) {
      style.display = val
    }
  }
}
