import { ObjectExt } from '../common'
import { Point, type PointOptions, type PointLike } from '../geometry'
import type { Cell, Node } from '../model'
import type { MarkupType } from '../view/markup'
import { Base, BaseBodyAttr } from './base'

export function getMarkup(tagName: string, selector = 'body'): MarkupType {
  return [
    {
      tagName,
      selector,
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ]
}

export function getImageUrlHook(attrName = 'xlink:href') {
  const hook: Cell.PropHook = (metadata) => {
    const { imageUrl, imageWidth, imageHeight, ...others } = metadata
    if (imageUrl != null || imageWidth != null || imageHeight != null) {
      const apply = () => {
        if (others.attrs) {
          const image = others.attrs.image
          if (imageUrl != null) {
            image[attrName] = imageUrl
          }
          if (imageWidth != null) {
            image.width = imageWidth
          }
          if (imageHeight != null) {
            image.height = imageHeight
          }
          others.attrs.image = image
        }
      }

      if (others.attrs) {
        if (others.attrs.image == null) {
          others.attrs.image = {}
        }
        apply()
      } else {
        others.attrs = {
          image: {},
        }
        apply()
      }
    }

    return others
  }

  return hook
}

export function createShape(
  shape: string,
  config: Node.Config,
  options: {
    selector?: string
    parent?: Node.Definition | typeof Base
  } = {},
) {
  const defaults: Node.Config = {
    constructorName: shape,
    markup: getMarkup(shape, options.selector),
    attrs: {
      [shape]: { ...BaseBodyAttr },
    },
  }

  const base = options.parent || Base
  return base.define(
    ObjectExt.merge(defaults, config, { shape }),
  ) as typeof Base
}

export function pointsToString(points: PointOptions[] | string) {
  return typeof points === 'string'
    ? points
    : (points as PointLike[])
        .map((p) => {
          if (Array.isArray(p)) {
            return p.join(',')
          }
          if (Point.isPointLike(p)) {
            return `${p.x}, ${p.y}`
          }
          return ''
        })
        .join(' ')
}
