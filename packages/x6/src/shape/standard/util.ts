import { Markup } from '../../view/markup'
import { Node } from '../../model/node'
import { Base } from '../base'
import { ObjectExt } from '../../util'

export function getMarkup(tagName: string, selector: string = 'body'): Markup {
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

export const bodyAttr = {
  fill: '#ffffff',
  stroke: '#333333',
  strokeWidth: 2,
}

export const labelAttr = {
  fontSize: 14,
  fill: '#333333',
  refX: '50%',
  refY: '50%',
  textAnchor: 'middle',
  textVerticalAnchor: 'middle',
}

export function createShape(
  type: string,
  config: Node.Config,
  options: {
    selector?: string
    parent?: Node.Definition | typeof Base
  } = {},
) {
  const defaults: Node.Config = {
    name: type,
    markup: getMarkup(type, options.selector),
    attrs: {
      [type]: {
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 2,
      },
    },
  }

  const base = options.parent || Base
  const shape = base.define(ObjectExt.merge(defaults, config))
  Node.registry.register(type, shape)
  return shape as typeof Base
}
