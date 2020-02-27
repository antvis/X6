import { Node } from '../core/node'
import { StringExt } from '../../util'
import { registerEntity } from './util'

export interface Options extends Node.Defaults {
  init?: () => void
}

export type NodeClass = new (...args: any[]) => Node

const nodes: { [name: string]: NodeClass } = {}

function register(name: string, node: NodeClass, force: boolean) {
  registerEntity(nodes, name, node, force, () => {
    throw new Error(`Node with name '${name}' already registered.`)
  })

  return node
}

export function registerNode(
  name: string,
  shape: NodeClass,
  force?: boolean,
): NodeClass
export function registerNode(
  name: string,
  options: Options,
  force?: boolean,
): NodeClass
export function registerNode(
  name: string,
  options: Options | NodeClass,
  force: boolean = false,
): NodeClass {
  if (typeof options === 'function') {
    return register(name, options, force)
  }

  const { init, ...defaults } = options
  const className = StringExt.pascalCase(name)

  class Shape extends Node {
    init() {
      super.init()
      if (typeof init === 'function') {
        init.call(this)
      }
    }
  }

  Shape.setDefaults(defaults)

  Object.defineProperty(Shape, 'name', {
    writable: true,
    value: className,
  })

  return register(name, Shape, force)
}
