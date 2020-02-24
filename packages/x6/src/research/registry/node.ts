import { Node as NodeRaw } from '../core/node'
import { registerEntity } from './util'

export interface Options extends NodeRaw.Defaults {
  init?: () => void
}

export type NodeClass = typeof NodeRaw

const nodes: { [name: string]: NodeClass } = {}

function register(name: string, node: NodeClass, force: boolean) {
  registerEntity(nodes, name, node, force, () => {
    throw new Error(`Shape with name '${name}' already registered.`)
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
  // tslint:disable-next-line
  class Node extends NodeRaw {
    init() {
      if (typeof init === 'function') {
        init.call(this)
      }
    }
  }

  Node.setDefaults(defaults)

  return register(name, Node as any, force)
}
