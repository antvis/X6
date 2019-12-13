import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { Shape, EllipseShape } from '../../shape'
import { Image, Anchor, Point } from '../../struct'
import {
  drill,
  BaseStyle,
  OptionItem,
  applyBaseStyle,
  applyClassName,
  applyCursorStyle,
  applyManualStyle,
} from '../../option'

export interface AnchorOptions {
  inductionSize: number
  /**
   * The image for fixed connection points.
   */
  image: OptionItem<GetAnchorOptionsArgs, Image>
  cursor: OptionItem<GetAnchorOptionsArgs, string>
  className?: OptionItem<GetAnchorOptionsArgs, string>
}

export interface GetAnchorOptionsArgs {
  graph: Graph
  cell: Cell
  anchor: Anchor
  point: Point
}

export function getAnchorOptions(args: GetAnchorOptionsArgs) {
  const { graph } = args
  const options = graph.options.anchor
  return {
    image: drill(options.image, args.graph, args),
    cursor: drill(options.cursor, args.graph, args),
    className: drill(options.className, args.graph, args),
  }
}

export interface AnchorHighlightOptions
  extends BaseStyle<ApplyAnchorHighlightShapeStyleArgs> {
  shape: OptionItem<CreateAnchorHighlightShapeArgs, string>
  cursor: OptionItem<ApplyAnchorHighlightShapeStyleArgs, string>
}

export interface CreateAnchorHighlightShapeArgs {
  graph: Graph
  cell: Cell
}

export interface ApplyAnchorHighlightShapeStyleArgs
  extends CreateAnchorHighlightShapeArgs {
  shape: Shape
}

export function createAnchorHighlightShape(
  args: CreateAnchorHighlightShapeArgs,
) {
  const { graph } = args
  const opts = graph.options.anchorHighlight
  const raw = drill(opts.shape, graph, args)
  const ctor = Shape.getShape(raw) || EllipseShape
  const shape = new ctor() as Shape
  const newArgs = { ...args, shape }

  applyBaseStyle(newArgs, opts)
  applyClassName(newArgs, opts, 'anchor-highlight')
  applyCursorStyle(newArgs, opts)
  applyManualStyle(newArgs, opts)

  return shape
}
