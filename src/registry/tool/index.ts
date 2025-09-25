import type { KeyValue } from '../../common'
import {
  ToolItem,
  type ToolItemDefinition,
  type ToolItemOptions,
} from '../../view/tool'
import { Registry } from '../registry'
import { SourceAnchor, TargetAnchor } from './anchor'
import { SourceArrowhead, TargetArrowhead } from './arrowhead'
import { Boundary } from './boundary'
import { Button } from './button'
import { CellEditor } from './editor'
import { Segments } from './segments'
import { Vertices } from './vertices'

/**
 * ========== NodeTool ==========
 */
export const nodeToolPresets = {
  boundary: Boundary,
  button: Button,
  'button-remove': Button.Remove,
  'node-editor': CellEditor.NodeEditor,
}

export type NodeToolDefinition = ToolItemDefinition

export const nodeToolRegistry = Registry.create<
  NodeToolDefinition,
  NodeToolPresets,
  ToolItemOptions & { inherit?: string } & KeyValue
>({
  type: 'node tool',
  process(name, options) {
    if (typeof options === 'function') {
      return options
    }

    let parent = ToolItem
    const { inherit, ...others } = options
    if (inherit) {
      const base = this.get(inherit)
      if (base == null) {
        this.onNotFound(inherit, 'inherited')
      } else {
        parent = base
      }
    }

    if (others.name == null) {
      others.name = name
    }

    return parent.define.call(parent, others)
  },
})

nodeToolRegistry.register(nodeToolPresets, true)

type NodeToolPresets = typeof nodeToolPresets

type NodeToolOptionsMap = {
  readonly [K in keyof NodeToolPresets]-?: ConstructorParameters<
    NodeToolPresets[K]
  >[0]
}

export type NodeToolNativeNames = keyof NodeToolPresets

export interface NodeToolNativeItem<
  T extends NodeToolNativeNames = NodeToolNativeNames,
> {
  name: T
  args?: NodeToolOptionsMap[T]
}

export interface NodeToolManualItem {
  name: Exclude<string, NodeToolNativeNames>
  args?: ToolItemOptions
}

/**
 * ======== EdgeTool ==========
 */
export const edgeToolPresets = {
  boundary: Boundary,
  vertices: Vertices,
  segments: Segments,
  button: Button,
  'button-remove': Button.Remove,
  'source-anchor': SourceAnchor,
  'target-anchor': TargetAnchor,
  'source-arrowhead': SourceArrowhead,
  'target-arrowhead': TargetArrowhead,
  'edge-editor': CellEditor.EdgeEditor,
}

export type EdgeToolDefinition = NodeToolDefinition

export const edgeToolRegistry = Registry.create<
  EdgeToolDefinition,
  EdgeToolPresets,
  ToolItemOptions & { inherit?: string } & KeyValue
>({
  type: 'edge tool',
  process(name, options) {
    if (typeof options === 'function') {
      return options
    }

    let parent = ToolItem
    const { inherit, ...others } = options
    if (inherit) {
      const base = this.get(inherit)
      if (base == null) {
        this.onNotFound(inherit, 'inherited')
      } else {
        parent = base
      }
    }

    if (others.name == null) {
      others.name = name
    }

    return parent.define.call(parent, others)
  },
})

edgeToolRegistry.register(edgeToolPresets, true)

type EdgeToolPresets = typeof edgeToolPresets

type EdgeToolOptionsMap = {
  readonly [K in keyof EdgeToolPresets]-?: ConstructorParameters<
    EdgeToolPresets[K]
  >[0]
}

export type EdgeToolNativeNames = keyof EdgeToolPresets

export interface EdgeToolNativeItem<
  T extends EdgeToolNativeNames = EdgeToolNativeNames,
> {
  name: T
  args?: EdgeToolOptionsMap[T]
}

export interface EdgeToolManualItem {
  name: Exclude<string, EdgeToolNativeNames>
  args?: ToolItemOptions
}
