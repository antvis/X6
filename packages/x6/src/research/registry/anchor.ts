import { KeyValue } from '../../types'
import { NodeAnchor, EdgeAnchor } from '../anchor'
import { Registry } from './registry'

export const NodeAnchorRegistry = new Registry<
  NodeAnchor.Definition<KeyValue>,
  never,
  typeof NodeAnchor
>({
  onError(name) {
    throw new Error(`Anchor with name '${name}' already registered.`)
  },
})

Object.keys(NodeAnchor).forEach(key => {
  const name = key as NodeAnchor.NativeNames
  const entity = NodeAnchor[name]
  if (typeof entity === 'function') {
    NodeAnchorRegistry.register(name, entity, true)
  }
})

export const EdgeAnchorRegistry = new Registry<
  EdgeAnchor.Definition<KeyValue>,
  never,
  typeof EdgeAnchor
>({
  onError(name) {
    throw new Error(`Anchor with name '${name}' already registered.`)
  },
})

Object.keys(EdgeAnchor).forEach(key => {
  const name = key as EdgeAnchor.NativeNames
  const entity = EdgeAnchor[name]
  if (typeof entity === 'function') {
    EdgeAnchorRegistry.register(name, entity, true)
  }
})
