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

export interface LabelOptions {
}

export interface LabelHandleOptions extends
  BaseStyle<ApplyLabelHandleStyleArgs>,
  HandleOptions<CreateLabelHandleShapeArgs, ApplyLabelHandleStyleArgs> {
  offset: OptionItem<ApplyLabelHandleStyleArgs, Point | Point.PointLike>,
  cursor: OptionItem<ApplyLabelHandleStyleArgs, string>
}

export interface CreateLabelHandleShapeArgs {
  graph: Graph
  cell: Cell,
}

export interface ApplyLabelHandleStyleArgs
  extends CreateLabelHandleShapeArgs {
  shape: Shape
}

export function createLabelHandle(args: CreateLabelHandleShapeArgs) {
  const { graph } = args
  const options = graph.options.labelHandle as LabelHandleOptions
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
    'label-handle',
    drill(options.className, graph, newArgs),
  )

  if (options.style) {
    options.style(newArgs)
  }

  return shape
}

export function getLabelHandleOffset(args: ApplyLabelHandleStyleArgs) {
  const options = args.graph.options.labelHandle as LabelHandleOptions
  return drill(options.offset, args.graph, args)
}

export function getLabelHandleCursor(args: ApplyLabelHandleStyleArgs) {
  const options = args.graph.options.labelHandle as LabelHandleOptions
  return drill(options.cursor, args.graph, args)
}
