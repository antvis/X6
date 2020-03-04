import { NodeAnchor, EdgeAnchor } from '../anchor'
import { registerEntity, getEntity } from './util'
import { KeyValue } from '../../types'

export namespace AnchorRegistry {
  const anchors: { [name: string]: NodeAnchor.AnchorFunction<any> } = {}

  export function register<T extends NodeAnchor.NativeAnchorNames>(
    name: T,
    fn: NodeAnchor.AnchorFunction<NodeAnchor.NativeAnchorOptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: NodeAnchor.AnchorFunction<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: NodeAnchor.AnchorFunction<T>,
    force: boolean = false,
  ) {
    registerEntity(anchors, name, fn, force, () => {
      throw new Error(`Anchor with name '${name}' already registered.`)
    })
  }

  export function getAnchor<T extends NodeAnchor.NativeAnchorNames>(
    name: T,
  ): NodeAnchor.AnchorFunction<NodeAnchor.NativeAnchorOptionsMap[T]>
  export function getAnchor<T extends KeyValue = KeyValue>(
    name: string,
  ): NodeAnchor.AnchorFunction<T>
  export function getAnchor(name: string) {
    return getEntity(anchors, name)
  }

  export function getAnchorNames() {
    return Object.keys(anchors)
  }
}

Object.keys(NodeAnchor).forEach(key => {
  const name = key as NodeAnchor.NativeAnchorNames
  const fn = NodeAnchor[name]
  if (typeof fn === 'function') {
    AnchorRegistry.register(name, fn, true)
  }
})

export namespace EdgeAnchorRegistry {
  const anchors: { [name: string]: EdgeAnchor.AnchorFunction<any> } = {}

  export function register<T extends EdgeAnchor.NativeAnchorNames>(
    name: T,
    fn: EdgeAnchor.AnchorFunction<EdgeAnchor.NativeAnchorOptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: EdgeAnchor.AnchorFunction<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: EdgeAnchor.AnchorFunction<T>,
    force: boolean = false,
  ) {
    registerEntity(anchors, name, fn, force, () => {
      throw new Error(`Anchor with name '${name}' already registered.`)
    })
  }

  export function getAnchor<T extends EdgeAnchor.NativeAnchorNames>(
    name: T,
  ): EdgeAnchor.AnchorFunction<EdgeAnchor.NativeAnchorOptionsMap[T]>
  export function getAnchor<T extends KeyValue = KeyValue>(
    name: string,
  ): EdgeAnchor.AnchorFunction<T>
  export function getAnchor(name: string) {
    return getEntity(anchors, name)
  }

  export function getAnchorNames() {
    return Object.keys(anchors)
  }
}

Object.keys(EdgeAnchor).forEach(key => {
  const name = key as EdgeAnchor.NativeAnchorNames
  const fn = EdgeAnchor[name]
  if (typeof fn === 'function') {
    EdgeAnchorRegistry.register(name, fn, true)
  }
})
