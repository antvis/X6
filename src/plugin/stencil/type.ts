import type { Graph } from '../../graph'
import type { Model, Node } from '../../model'
import type { DndOptions } from '../dnd'
import type { Stencil } from '.'

export interface StencilOptions extends DndOptions {
  title: string
  groups?: StencilGroup[]
  search?: StencilFilter
  placeholder?: string
  notFoundText?: string
  collapsable?: boolean
  stencilGraphWidth: number
  stencilGraphHeight: number
  stencilGraphOptions?: Graph.Options
  stencilGraphPadding?: number
  layout?: (this: Stencil, model: Model, group?: StencilGroup | null) => any
  layoutOptions?: any
}

export type StencilFilter = StencilFilters | StencilFilterFn | boolean

export type StencilFilters = { [shape: string]: string | string[] | boolean }

export type StencilFilterFn = (
  this: Stencil,
  cell: Node,
  keyword: string,
  groupName: string | null,
  stencil: Stencil,
) => boolean

export interface StencilGroup {
  name: string
  title?: string
  collapsed?: boolean
  collapsable?: boolean
  nodeMovable?: boolean

  graphWidth?: number
  graphHeight?: number
  graphPadding?: number
  graphOptions?: Graph.Options
  layout?: (this: Stencil, model: Model, group?: StencilGroup | null) => any
  layoutOptions?: any
}
