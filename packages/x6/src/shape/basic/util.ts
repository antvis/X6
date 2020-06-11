import { ObjectExt } from '../../util'
import { Node } from '../../model/node'
import { Cell } from '../../model/cell'
import { Base } from '../base'

export function getMarkup(tagName: string, noText: boolean = false) {
  return `<g class="rotatable"><g class="scalable"><${tagName}/></g>${
    noText ? '' : '<text/>'
  }</g>`
}

export function getName(name: string) {
  return `basic.${name}`
}

export function getImageUrlHook(attrName: string = 'xlink:href') {
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
  type: string,
  config: Node.Config,
  options: {
    noText?: boolean
    ignoreMarkup?: boolean
    parent?: Node.Definition | typeof Base
  } = {},
) {
  const name = getName(type)
  const defaults: Node.Config = {
    name,
    attrs: {
      '.': {
        fill: '#ffffff',
        stroke: 'none',
      },
      [type]: {
        fill: '#ffffff',
        stroke: '#000000',
      },
    },
  }

  if (!options.ignoreMarkup) {
    defaults.markup = getMarkup(type, options.noText === true)
  }

  const base = options.parent || Base
  return base.define(
    ObjectExt.merge(defaults, config, { type: name }),
  ) as typeof Base
}
