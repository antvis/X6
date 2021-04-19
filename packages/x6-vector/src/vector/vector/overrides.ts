import { Util } from '../../dom/attributes/util'
import { AttributesBase } from '../../dom/attributes/base'

export const defaultAttributes = {
  // fill and stroke
  fillOpacity: 1,
  strokeOpacity: 1,
  strokeWidth: 0,
  strokeLinejoin: 'miter',
  strokeLinecap: 'butt',
  fill: '#000000',
  stroke: '#000000',
  opacity: 1,

  // position
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,

  // size
  width: 0,
  height: 0,

  // radius
  r: 0,
  rx: 0,
  ry: 0,

  // gradient
  offset: 0,
  stopOpacity: 1,
  stopColor: '#000000',

  // text
  textAnchor: 'start',
}

export class Overrides extends AttributesBase {
  attr(attributeName: any, attributeValue: any) {
    if (
      typeof attributeName === 'string' &&
      typeof attributeValue === 'undefined'
    ) {
      const val = super.attr(attributeName)
      if (typeof val === 'undefined') {
        return defaultAttributes[
          Util.camelCase(attributeName) as keyof typeof defaultAttributes
        ]
      }
      return val
    }
    return super.attr(attributeName, attributeValue)
  }
}
