import { KeyValue } from '../../types'
import { ToolsView } from '../../view/tool'
import { Registry } from '../registry'
import { Button } from './button'
import { Boundary } from './boundary'
import { Vertices } from './vertices'
import { Segments } from './segments'
import { SourceAnchor, TargetAnchor } from './anchor'
import { SourceArrowhead, TargetArrowhead } from './arrowhead'
import { CellEditor } from './editor'

export namespace NodeTool {
  export const presets = {
    boundary: Boundary,
    button: Button,
    'button-remove': Button.Remove,
    'node-editor': CellEditor.NodeEditor,
  }

  export type Definition = ToolsView.ToolItem.Definition

  export const registry = Registry.create<
    Definition,
    Presets,
    ToolsView.ToolItem.Options & { inherit?: string } & KeyValue
  >({
    type: 'node tool',
    process(name, options) {
      if (typeof options === 'function') {
        return options
      }

      let parent = ToolsView.ToolItem
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
  export type Presets = typeof NodeTool['presets']

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
    args?: ToolsView.ToolItem.Options
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
    ToolsView.ToolItem.Options & { inherit?: string } & KeyValue
  >({
    type: 'edge tool',
    process(name, options) {
      if (typeof options === 'function') {
        return options
      }

      let parent = ToolsView.ToolItem
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
  export type Presets = typeof EdgeTool['presets']

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
    args?: ToolsView.ToolItem.Options
  }
}
