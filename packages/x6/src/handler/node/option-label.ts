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

export interface LabelOptions {}

export interface LabelHandleOptions
  extends BaseStyle<ApplyLabelHandleStyleArgs>,
    HandleOptions<CreateLabelHandleShapeArgs, ApplyLabelHandleStyleArgs> {
  offset: OptionItem<ApplyLabelHandleStyleArgs, Point | Point.PointLike>
  cursor: OptionItem<ApplyLabelHandleStyleArgs, string>
}

export interface CreateLabelHandleShapeArgs {
  graph: Graph
  cell: Cell
}

export interface ApplyLabelHandleStyleArgs extends CreateLabelHandleShapeArgs {
  shape: Shape
}

export function createLabelHandle(args: CreateLabelHandleShapeArgs) {
  const { graph } = args
  const options = graph.options.labelHandle
  const shape = createHandleShape(args, options)

  const newArgs = { ...args, shape }
  if (!(shape instanceof ImageShape)) {
    const size = drill(options.size, graph, newArgs)
    const bounds = new Rectangle(0, 0, size, size)

    shape.bounds = bounds
    applyBaseStyle(newArgs, options)
  }

  applyClassName(newArgs, options, 'label-handle')
  applyManualStyle(newArgs, options)

  return shape
}

export function getLabelHandleOffset(args: ApplyLabelHandleStyleArgs) {
  const options = args.graph.options.labelHandle
  return drill(options.offset, args.graph, args)
}

export function getLabelHandleCursor(args: ApplyLabelHandleStyleArgs) {
  const options = args.graph.options.labelHandle
  return drill(options.cursor, args.graph, args)
}
