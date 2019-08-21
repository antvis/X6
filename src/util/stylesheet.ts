import { constants } from '../common'
import { Stylesheet } from '../stylesheet'
import { getNumber } from './object'
import { StyleNames } from '../types'

export function getBooleanFromStyle(
  style?: Stylesheet.Styles | null,
  name: string = '',
  defaultValue: boolean = false,
) {
  if (style == null) {
    return defaultValue
  }

  const val = getNumber(style, name)
  if (val == null) {
    return defaultValue
  }

  return val === 1
}

export function isFlipH(
  style?: Stylesheet.Styles,
  defaultValue: boolean = false,
) {
  return getBooleanFromStyle(style, StyleNames.flipH, defaultValue)
}

export function isFlipV(
  style?: Stylesheet.Styles,
  defaultValue: boolean = false,
) {
  return getBooleanFromStyle(style, StyleNames.flipV, defaultValue)
}

export function getArcSize(style?: Stylesheet.Styles) {
  return getNumber(style, StyleNames.arcSize, constants.LINE_ARCSIZE)
}
