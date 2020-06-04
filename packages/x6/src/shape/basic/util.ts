import { ObjectExt } from '../../util'
import { Node } from '../../model'

export function getMarkup(tagName: string, noText: boolean = false) {
  return `<g class="rotatable"><g class="scalable"><${tagName}/></g>${
    noText ? '' : '<text/>'
  }</g>`
}

export function getName(name: string) {
  return `basic.${name}`
}

export function createShape(
  type: string,
  config: Node.Config,
  options: {
    noText?: boolean
    ignoreMarkup?: boolean
    parent?: Node.Definition
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
      text: {
        text: '',
        fontSize: 14,
        fill: '#000000',
        textAnchor: 'middle',
        yAlign: 'middle',
        fontFamily: 'Arial, helvetica, sans-serif',
      },
      [type]: {
        fill: '#ffffff',
        stroke: '#000000',
      },
    },
    propHooks(metadata) {
      const { label, ...others } = metadata
      if (label) {
        ObjectExt.setByPath(others, 'attrs/text/text', label)
      }
      return others
    },
  }

  if (!options.ignoreMarkup) {
    defaults.markup = getMarkup(type, options.noText === true)
  }

  const base = options.parent || Node
  const shape = base.define(ObjectExt.merge(defaults, config))

  Node.registry.register(name, shape)

  return shape
}
