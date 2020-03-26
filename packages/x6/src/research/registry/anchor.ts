import { KeyValue } from '../../types'
import { NodeAnchor, EdgeAnchor } from '../anchor'
import { registerEntity, getEntity } from './util'

export namespace NodeAnchorRegistry {
  const anchors: { [name: string]: NodeAnchor.Definition<any> } = {}

  export function register<T extends NodeAnchor.NativeNames>(
    name: T,
    fn: NodeAnchor.Definition<NodeAnchor.OptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: NodeAnchor.Definition<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: NodeAnchor.Definition<T>,
    force: boolean = false,
  ) {
    registerEntity(anchors, name, fn, force, () => {
      throw new Error(`Anchor with name '${name}' already registered.`)
    })
  }

  export function get<T extends NodeAnchor.NativeNames>(
    name: T,
  ): NodeAnchor.Definition<NodeAnchor.OptionsMap[T]>
  export function get<T extends KeyValue = KeyValue>(
    name: string,
  ): NodeAnchor.Definition<T> | null
  export function get(name: string) {
    return getEntity(anchors, name)
  }

  export function getNames() {
    return Object.keys(anchors)
  }
}

Object.keys(NodeAnchor).forEach(key => {
  const name = key as NodeAnchor.NativeNames
  const fn = NodeAnchor[name]
  if (typeof fn === 'function') {
    NodeAnchorRegistry.register(name, fn, true)
  }
})

export namespace EdgeAnchorRegistry {
  const anchors: { [name: string]: EdgeAnchor.Definition<any> } = {}

  export function register<T extends EdgeAnchor.NativeNames>(
    name: T,
    fn: EdgeAnchor.Definition<EdgeAnchor.OptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: EdgeAnchor.Definition<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: EdgeAnchor.Definition<T>,
    force: boolean = false,
  ) {
    registerEntity(anchors, name, fn, force, () => {
      throw new Error(`Anchor with name '${name}' already registered.`)
    })
  }

  export function get<T extends EdgeAnchor.NativeNames>(
    name: T,
  ): EdgeAnchor.Definition<EdgeAnchor.OptionsMap[T]>
  export function get<T extends KeyValue = KeyValue>(
    name: string,
  ): EdgeAnchor.Definition<T>
  export function get(name: string) {
    return getEntity(anchors, name)
  }

  export function getNames() {
    return Object.keys(anchors)
  }
}

Object.keys(EdgeAnchor).forEach(key => {
  const name = key as EdgeAnchor.NativeNames
  const fn = EdgeAnchor[name]
  if (typeof fn === 'function') {
    EdgeAnchorRegistry.register(name, fn, true)
  }
})
