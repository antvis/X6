import { NodeAnchor, EdgeAnchor } from '../anchor'
import { Registry } from './registry'

export const NodeAnchorRegistry = Registry.create<
  NodeAnchor.CommonDefinition,
  NodeAnchor.Presets
>({
  type: 'node anchor',
})

export const EdgeAnchorRegistry = Registry.create<
  EdgeAnchor.CommonDefinition,
  EdgeAnchor.Presets
>({
  type: 'edge anchor',
})

NodeAnchorRegistry.register(NodeAnchor.presets, true)
EdgeAnchorRegistry.register(EdgeAnchor.presets, true)
