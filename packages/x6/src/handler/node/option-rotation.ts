import { Point, Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
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

export interface RotateOptions {
  enabled: boolean
  /**
   * Specifies if rotation steps should be "rasterized" depening on the
   * distance to the handle.
   *
   * Default is `true`.
   */
  rasterized: boolean
}

export interface RotateHandleOptions
  extends BaseStyle<ApplyRotateHandleStyleArgs>,
    HandleOptions<CreateRotateHandleShapeArgs, ApplyRotateHandleStyleArgs> {
  offset: OptionItem<ApplyRotateHandleStyleArgs, Point | Point.PointLike>
  /**
   * Specifies the cursor for the rotation handle.
   *
   * Default is `'crosshair'`.
   */
  cursor: OptionItem<ApplyRotateHandleStyleArgs, string>
}

export interface CreateRotateHandleShapeArgs {
  graph: Graph
  cell: Cell
}

export interface ApplyRotateHandleStyleArgs
  extends CreateRotateHandleShapeArgs {
  shape: Shape
}

export function createRotationHandle(args: CreateRotateHandleShapeArgs) {
  const { graph } = args
  const options = graph.options.rotateHandle
  const shape = createHandleShape(args, options)
  const newArgs = { ...args, shape }

  if (!(shape instanceof ImageShape)) {
    const size = drill(options.size, graph, newArgs)
    const bounds = new Rectangle(0, 0, size, size)
    shape.bounds = bounds
    applyBaseStyle(newArgs, options)
  }

  applyClassName(newArgs, options, 'rotation-handle')
  applyManualStyle(newArgs, options)

  return shape
}

export function getRotationHandleOffset(args: ApplyRotateHandleStyleArgs) {
  const options = args.graph.options.rotateHandle
  return drill(options.offset, args.graph, args)
}

export function getRotationHandleCursor(args: ApplyRotateHandleStyleArgs) {
  const options = args.graph.options.rotateHandle
  return drill(options.cursor, args.graph, args)
}

export interface RotatePreviewOptions
  extends BaseStyle<ApplyRotatePreviewStyleArgs> {}

export interface ApplyRotatePreviewStyleArgs
  extends CreateRotateHandleShapeArgs {
  shape: Shape
}

export function applyRotatePreviewStyle(args: ApplyRotatePreviewStyleArgs) {
  const { shape, graph } = args
  const options = graph.options.rotatePreview as RotatePreviewOptions

  applyBaseStyle(args, options)
  applyClassName(args, options, 'rotate-preview')
  applyManualStyle(args, options)

  return shape
}
