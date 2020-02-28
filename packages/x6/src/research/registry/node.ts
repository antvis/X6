import { Node } from '../core/node'
import { StringExt, ObjectExt } from '../../util'
import { registerEntity, getEntity } from './util'

export namespace NodeRegistry {
  export interface CellMethods {
    init?: () => void
  }

  export interface Options extends Node.Defaults, CellMethods {}

  export type NodeClass = new (...args: any[]) => Node

  const nodes: { [name: string]: NodeClass } = {}

  function registerNode(name: string, node: NodeClass, force: boolean) {
    registerEntity(nodes, name, node, force, () => {
      throw new Error(`Node with name '${name}' already registered.`)
    })

    return node
  }

  export function register(
    name: string,
    shape: NodeClass,
    force?: boolean,
  ): NodeClass
  export function register(
    name: string,
    options: Options,
    force?: boolean,
  ): NodeClass
  export function register(
    name: string,
    options: Options | NodeClass,
    force: boolean = false,
  ): NodeClass {
    if (typeof options === 'function') {
      return registerNode(name, options, force)
    }

    const { init, ...defaults } = options
    const className = StringExt.pascalCase(name)
    const shape = ObjectExt.createClass<typeof Node>(className, Node)
    shape.setDefaults(defaults)

    if (typeof init === 'function') {
      shape.prototype.init = function() {
        Node.prototype.init.call(this)
        init.call(this)
      }
    }

    return registerNode(name, shape, force)
  }

  export function getNode(name: string) {
    return getEntity(nodes, name)
  }

  export function getNodeNames() {
    return Object.keys(nodes)
  }
}
