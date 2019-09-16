import { Graph, Cell } from '../core'
import { Shape, ImageShape } from '../shape'
import { Point, Rectangle } from '../struct'
import { HandleOptions, createHandleShape } from './handle'
import {
  BaseStyle,
  OptionItem,
  drill,
  applyBaseStyle,
  applyClassName,
} from './util'

export interface RotateOptions {
  enabled: boolean
  /**
   * Specifies if rotation steps should be "rasterized" depening on the
   * distance to the handle.
   *
   * Default is `true`.
   */
  rasterized: boolean
  livePreview: boolean
}

export interface RotateHandleOptions extends
  BaseStyle<ApplyRotateHandleStyleArgs>,
  HandleOptions<CreateRotateHandleShapeArgs, ApplyRotateHandleStyleArgs> {
  offset: OptionItem<ApplyRotateHandleStyleArgs, Point | Point.PointLike>,
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
  const options = graph.options.rotateHandle as RotateHandleOptions
  const shape = createHandleShape(args, options)
  const newArgs = { ...args, shape }

  if (!(shape instanceof ImageShape)) {
    const size = drill(options.size, graph, newArgs)
    const bounds = new Rectangle(0, 0, size, size)

    shape.bounds = bounds
    applyBaseStyle(newArgs, options)
  }

  applyClassName(
    shape,
    graph.prefixCls,
    'rotation-handle',
    drill(options.className, graph, newArgs),
  )

  if (options.style) {
    options.style(newArgs)
  }

  return shape
}

export function getRotationHandleOffset(args: ApplyRotateHandleStyleArgs) {
  const options = args.graph.options.rotateHandle as RotateHandleOptions
  return drill(options.offset, args.graph, args)
}

export function getRotationHandleCursor(args: ApplyRotateHandleStyleArgs) {
  const options = args.graph.options.rotateHandle as RotateHandleOptions
  return drill(options.cursor, args.graph, args)
}

export interface RotatePreviewOptions
  extends BaseStyle<ApplyRotatePreviewStyleArgs> { }

export interface ApplyRotatePreviewStyleArgs
  extends CreateRotateHandleShapeArgs {
  shape: Shape
}

export function applyRotatePreviewStyle(args: ApplyRotatePreviewStyleArgs) {
  const { shape, graph } = args
  const options = graph.options.rotatePreview as RotatePreviewOptions

  applyBaseStyle(args, options)
  applyClassName(
    shape,
    graph.prefixCls,
    'rotate-preview',
    drill(options.className, graph, args),
  )

  if (options.style) {
    options.style(args)
  }

  return shape
}
