import { ObjectExt } from '../common'
import type { Cell, Node } from '../model'
import type { MarkupType } from '../view/markup'
import { Base } from './base'

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
      [shape]: { ...Base.bodyAttr },
    },
  }

  const base = options.parent || Base
  return base.define(
    ObjectExt.merge(defaults, config, { shape }),
  ) as typeof Base
}
