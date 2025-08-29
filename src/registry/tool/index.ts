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

export namespace NodeTool {
  export const presets = {
    boundary: Boundary,
    button: Button,
    'button-remove': Button.Remove,
    'node-editor': CellEditor.NodeEditor,
  }

  export type Definition = ToolItemDefinition

  export const registry = Registry.create<
    Definition,
    Presets,
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

  registry.register(presets, true)
}

export namespace NodeTool {
  export type Presets = (typeof NodeTool)['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: ConstructorParameters<Presets[K]>[0]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: ToolItemOptions
  }
}

export namespace EdgeTool {
  export const presets = {
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

  export type Definition = NodeTool.Definition

  export const registry = Registry.create<
    Definition,
    Presets,
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

  registry.register(presets, true)
}

export namespace EdgeTool {
  export type Presets = (typeof EdgeTool)['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: ConstructorParameters<Presets[K]>[0]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: ToolItemOptions
  }
}
