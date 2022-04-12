import { ObjectExt } from '@antv/x6-common'
import { Markup, Node } from '@antv/x6-core'
import { Base } from './base'

export function getMarkup(tagName: string, selector = 'body'): Markup {
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
