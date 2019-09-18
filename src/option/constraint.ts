import { Graph, Cell } from '../core'
import { Shape, EllipseShape } from '../shape'
import { Image, Constraint, Point } from '../struct'
import {
  BaseStyle,
  OptionItem,
  drill,
  applyBaseStyle,
  applyClassName,
} from './util'

export interface ConstraintOptions {
  /**
   * The image for fixed connection points.
   */
  image: OptionItem<GetConstraintOptionsArgs, Image>
  cursor: OptionItem<GetConstraintOptionsArgs, string>
  className?: OptionItem<GetConstraintOptionsArgs, string>
}

export interface GetConstraintOptionsArgs {
  graph: Graph
  cell: Cell
  constraint: Constraint
  point: Point
}

export function getConstraintOptions(args: GetConstraintOptionsArgs) {
  const { graph } = args
  const options = graph.options.constraint as ConstraintOptions
  return {
    image: drill(options.image, args.graph, args),
    cursor: drill(options.cursor, args.graph, args),
    className: drill(options.className, args.graph, args),
  }
}

export interface ConstraintHighlightOptions
  extends BaseStyle<CreateConstraintHighlightShapeArgs> {
  shape: OptionItem<CreateConstraintHighlightShapeArgs, string>
  cursor: OptionItem<CreateConstraintHighlightShapeArgs, string>
}

export interface CreateConstraintHighlightShapeArgs {
  graph: Graph
  cell: Cell
}

export interface ApplyConstraintHighlightShapeStyleArgs
  extends CreateConstraintHighlightShapeArgs {
  shape: Shape
}

export function createConstraintHighlightShape(
  args: CreateConstraintHighlightShapeArgs,
) {
  const { graph } = args
  const opts = graph.options.constraintHighlight as ConstraintHighlightOptions
  const raw = drill(opts.shape, graph, args)
  const ctor = Shape.getShape(raw) || EllipseShape
  const shape = new ctor() as Shape
  const newArgs = { ...args, shape }
  applyBaseStyle<ApplyConstraintHighlightShapeStyleArgs>(newArgs, opts)

  applyClassName(
    shape,
    graph.prefixCls,
    'constraint-highlight',
    drill(opts.className, graph, newArgs),
  )

  if (opts.style) {
    opts.style(newArgs)
  }

  shape.cursor = drill(opts.cursor, graph, args)

  return shape
}
