import { getVendorPrefixedName } from './prefix'

const numericProps: { [prop: string]: true | undefined } = {
  animationIterationCount: true,
  columnCount: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  gridArea: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true,
}

export function isCSSVariable(prop: string): boolean {
  return /^--/.test(prop)
}

export function computeStyle(
  elem: Element,
  prop: string,
  isVariable?: boolean,
) {
  const style: any = window.getComputedStyle(elem, null)
  return isVariable
    ? style.getPropertyValue(prop) || undefined
    : style[prop] || (elem as any).style[prop]
}

export function computeStyleInt(elem: Element, prop: string) {
  return parseInt(computeStyle(elem, prop), 10) || 0
}

function getSuffixedValue(prop: string, value: number | string) {
  return !numericProps[prop] && typeof value === 'number' ? `${value}px` : value
}

export function css(elem: Element, prop: string): string | undefined
export function css(elem: Element, prop: string, value: number | string): void
export function css(elem: Element, prop: Record<string, number | string>): void
export function css(
  elem: Element,
  prop: string | Record<string, number | string>,
  value?: number | string,
) {
  if (typeof prop === 'string') {
    const isVariable = isCSSVariable(prop)

    if (!isVariable) {
      prop = getVendorPrefixedName(prop)! // eslint-disable-line
    }

    if (value === undefined) {
      return computeStyle(elem, prop, isVariable)
    }

    if (!isVariable) {
      value = getSuffixedValue(prop, value) // eslint-disable-line
    }

    const style = (elem as any).style
    if (isVariable) {
      style.setProperty(prop, value)
    } else {
      style[prop] = value
    }

    return
  }

  // eslint-disable-next-line
  for (const key in prop) {
    css(elem, key, prop[key])
  }
}
