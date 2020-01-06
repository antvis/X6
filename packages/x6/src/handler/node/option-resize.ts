import { Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { MouseEventEx } from '../mouse-event'
import { Shape, ImageShape } from '../../shape'
import { HandleOptions, createHandleShape } from './option-knob'
import {
  drill,
  BaseStyle,
  OptionItem,
  applyBaseStyle,
  applyClassName,
  applyManualStyle,
} from '../../option'

export interface ResizeOption {
  /**
   * Specifies if the graph should allow resizing of cells.
   *
   * Default is `true`.
   */
  enabled: boolean

  /**
   * Specifies if the center of the node should be maintained during resizing.
   *
   * Default is `false`.
   */
  centered: boolean | ((this: Graph, cell: Cell, e: MouseEventEx) => boolean)

  livePreview: boolean

  constrainByChildren: boolean
}

export interface ResizeHandleOptions
  extends BaseStyle<ApplyResizeHandleStyleArgs>,
    HandleOptions<CreateResizeHandleShapeArgs, ApplyResizeHandleStyleArgs> {
  /**
   * Specifies if only one sizer handle at the bottom, right corner should
   * be used.
   *
   * Default is `false`.
   */
  single: boolean

  /**
   * Specifies if resize handle should be hidden and spaced if the node
   * is too small.
   *
   * Default is `false`.
   */
  adaptive: boolean

  /**
   * Optional tolerance for hit and adaptive detection.
   *
   * Default is `4`.
   */
  tolerance: number

  visible: OptionItem<IsResizeHandleVisibleArgs, boolean>
  className?: OptionItem<ApplyResizeHandleClassNameArgs, string>
}

export interface CreateResizeHandleShapeArgs {
  graph: Graph
  cell: Cell
  index: number
}

export interface ApplyResizeHandleStyleArgs
  extends CreateResizeHandleShapeArgs {
  shape: Shape
}

export interface ApplyResizeHandleClassNameArgs
  extends CreateResizeHandleShapeArgs {
  cursor: string
  shape: Shape
}

export function createResizeHandle(args: CreateResizeHandleShapeArgs) {
  const { graph } = args
  const options = graph.options.resizeHandle
  const shape = createHandleShape(args, options)
  const newArgs = { ...args, shape }

  if (!(shape instanceof ImageShape)) {
    const size = drill(options.size, graph, newArgs)
    const bounds = new Rectangle(0, 0, size, size)

    shape.bounds = bounds
    applyBaseStyle(newArgs, options)
  }

  applyManualStyle(newArgs, options)

  return shape
}

export function updateResizeHandleCalssName(
  args: ApplyResizeHandleClassNameArgs,
) {
  const { graph, cursor } = args
  const options = graph.options.resizeHandle
  applyClassName(args, options, `cursor-${cursor}`)
}

export interface IsResizeHandleVisibleArgs {
  graph: Graph
  cell: Cell
  index: number
}

export function isResizeHandleVisible(args: IsResizeHandleVisibleArgs) {
  const { graph } = args
  const options = graph.options.resizeHandle
  return drill(options.visible, graph, args)
}

export interface ResizePreviewOptions
  extends BaseStyle<ApplyResizePreviewStyleArgs> {}

export interface ApplyResizePreviewStyleArgs {
  graph: Graph
  cell: Cell
  shape: Shape
}

export function applyResizePreviewStyle(args: ApplyResizePreviewStyleArgs) {
  const options = args.graph.options.resizePreview
  applyBaseStyle(args, options)
  applyClassName(args, options, 'resize-preview')
  applyManualStyle(args, options)
  return args.shape
}
