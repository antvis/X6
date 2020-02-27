import { Node } from '../core/node'
import { StringExt } from '../../util'
import { registerEntity, getEntity, createClass } from './util'

interface CellMethods {
  init?: () => void
}

export interface Options extends Node.Defaults, CellMethods {}

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
  const shape = createClass<typeof Node>(className, Node)
  shape.setDefaults(defaults)

  if (typeof init === 'function') {
    shape.prototype.init = function() {
      Node.prototype.init.call(this)
      init.call(this)
    }
  }

  return register(name, shape, force)
}

export function getNode(name: string) {
  return getEntity(nodes, name)
}
