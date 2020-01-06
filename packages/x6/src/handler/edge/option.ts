import { Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { Shape, ImageShape } from '../../shape'
import { HandleOptions, createHandleShape } from '../node/option-knob'
import {
  drill,
  BaseStyle,
  OptionItem,
  applyBaseStyle,
  applyClassName,
  applyManualStyle,
} from '../../option/util'

export interface EdgeOptions {}

export interface EdgeHandleOptions
  extends BaseStyle<ApplyEdgeHandleStyleArgs>,
    HandleOptions<CreateEdgeHandleShapeArgs, ApplyEdgeHandleStyleArgs> {
  cursor: OptionItem<GetEdgeHandleCursorArgs, string>

  /**
   * Specifies if cloning by control-drag is enabled.
   *
   * Default is `false`.
   */
  cloneable: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if adding handles by shift-click is enabled.
   *
   * Default is `false`.
   */
  addable: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if removing handles by shift-click is enabled.
   *
   * Default is `false`.
   */
  removable: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if removing handles by double click is enabled.
   *
   * Default is `false`.
   */
  dblClickRemoveEnabled: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if removing handles by dropping them on other handles
   * is enabled.
   *
   * Default is `false`.
   */
  mergeRemoveEnabled: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if removing handles by creating straight segments is enabled.
   *
   * If enabled, this can be overridden by holding down the alt key while
   * moving.
   *
   * Default is `false`.
   */
  straightRemoveEnabled: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if virtual handles should be added in the center of each
   * segments. These handles can then be used to add new waypoints.
   *
   * Default is `false`.
   */
  virtualHandlesEnabled: OptionItem<GetEdgeHandleOptionsArgs, boolean>

  /**
   * Specifies if the label handle should be moved if it intersects with
   * another handle.
   *
   * Default is `false`.
   */
  manageLabelHandle: OptionItem<GetEdgeHandleOptionsArgs, boolean>
}

export interface GetEdgeHandleOptionsArgs {
  graph: Graph
  cell: Cell
}

export function getEdgeHandleOptions(args: GetEdgeHandleOptionsArgs) {
  const { graph } = args
  const options = graph.options.edgeHandle
  return {
    cloneable: drill(options.cloneable, graph, args),
    addable: drill(options.addable, graph, args),
    removable: drill(options.removable, graph, args),
    dblClickRemoveEnabled: drill(options.dblClickRemoveEnabled, graph, args),
    mergeRemoveEnabled: drill(options.mergeRemoveEnabled, graph, args),
    straightRemoveEnabled: drill(options.straightRemoveEnabled, graph, args),
    virtualHandlesEnabled: drill(options.virtualHandlesEnabled, graph, args),
    manageLabelHandle: drill(options.manageLabelHandle, graph, args),
  }
}

export interface CreateEdgeHandleShapeArgs {
  graph: Graph
  cell: Cell
  index: number | null
  visual: boolean
}

export interface ApplyEdgeHandleStyleArgs extends CreateEdgeHandleShapeArgs {
  shape: Shape
}

export function createEdgeHandle(args: CreateEdgeHandleShapeArgs) {
  const { graph } = args
  const options = graph.options.edgeHandle
  const shape = createHandleShape(args, options)
  const newArgs = { ...args, shape }

  if (!(shape instanceof ImageShape)) {
    const size = drill(options.size, graph, newArgs)
    const bounds = new Rectangle(0, 0, size, size)

    shape.bounds = bounds
    applyBaseStyle(newArgs, options)
  }

  applyClassName(newArgs, options, 'edge-handle')
  applyManualStyle(newArgs, options)

  return shape
}

export interface GetEdgeHandleCursorArgs {
  graph: Graph
  cell: Cell
  index: number
  shape: Shape
  visual?: boolean
  isSource?: boolean
  isTarget?: boolean
}

export function getEdgeHandleCursor(args: GetEdgeHandleCursorArgs) {
  const { graph } = args
  const options = graph.options.edgeHandle
  return drill(options.cursor, graph, args)
}

export interface EdgePreviewOptions {}
