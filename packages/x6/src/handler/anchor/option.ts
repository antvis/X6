import { Point, Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { Shape, EllipseShape, ImageShape } from '../../shape'
import { Image, Anchor } from '../../struct'
import {
  drill,
  BaseStyle,
  OptionItem,
  applyBaseStyle,
  applyClassName,
  applyCursorStyle,
  applyManualStyle,
} from '../../option'

export interface AnchorOptions extends BaseStyle<ApplyAnchorStyleArgs> {
  /**
   * Specifies the inductive area size.
   *
   * Default is `20`.
   */
  inductiveSize: number
  /**
   * Specifies if adsorb the nearest anchor on finding a edge's target anchor.
   *
   * Default is `true`.
   */
  adsorbNearestTarget: boolean

  image?: OptionItem<CreateAnchorShapeArgs, Image>
  shape: OptionItem<CreateAnchorShapeArgs, string>
  size: OptionItem<CreateAnchorShapeArgs, number>
  cursor: OptionItem<ApplyAnchorStyleArgs, string>
}

export interface CreateAnchorShapeArgs {
  graph: Graph
  cell: Cell
  anchor: Anchor
  point: Point
}

export interface ApplyAnchorStyleArgs extends CreateAnchorShapeArgs {
  shape: Shape
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

export function createAnchorShape(args: CreateAnchorShapeArgs) {
  const { graph } = args
  const options = graph.options.anchor
  const image = drill(options.image, args.graph, args)

  let shape: Shape
  if (image) {
    const bounds = new Rectangle(0, 0, image.width, image.height)
    const img = new ImageShape(bounds, image.src)
    img.preserveImageAspect = false
    shape = img
  } else {
    const shapeName = drill(options.shape, graph, args)
    const size = drill(options.size, graph, args)
    const ctor = Shape.getShape(shapeName) || EllipseShape

    shape = new ctor() as Shape
    shape.bounds = new Rectangle(0, 0, size, size)
    applyBaseStyle({ ...args, shape }, options)
  }

  const newArgs = { ...args, shape }
  applyClassName(newArgs, options, 'anchor')
  applyCursorStyle(newArgs, options)
  applyManualStyle(newArgs, options)

  return shape
}

// anchor tip
// ----
export interface AnchorTipOptions extends BaseStyle<ApplyAnchorTipStyleArgs> {
  enabled: boolean
  image?: OptionItem<CreateAnchorTipShapeArgs, Image>
  shape: OptionItem<CreateAnchorTipShapeArgs, string>
  size: OptionItem<CreateAnchorTipShapeArgs, number>
}

export interface CreateAnchorTipShapeArgs {
  graph: Graph
  cell: Cell
  anchor: Anchor
  point: Point
}

export interface ApplyAnchorTipStyleArgs extends CreateAnchorTipShapeArgs {
  shape: Shape
}

export function createAnchorTipShape(args: CreateAnchorTipShapeArgs) {
  const { graph } = args
  const options = graph.options.anchorTip
  const image = drill(options.image, args.graph, args)

  let shape: Shape
  if (image) {
    const bounds = new Rectangle(0, 0, image.width, image.height)
    const img = new ImageShape(bounds, image.src)
    img.preserveImageAspect = false
    shape = img
  } else {
    const shapeName = drill(options.shape, graph, args)
    const size = drill(options.size, graph, args)
    const ctor = Shape.getShape(shapeName) || EllipseShape

    shape = new ctor() as Shape
    shape.bounds = new Rectangle(0, 0, size, size)
    applyBaseStyle({ ...args, shape }, options)
  }

  const newArgs = { ...args, shape }
  applyClassName(newArgs, options, 'anchor-tip')
  applyManualStyle(newArgs, options)

  return shape
}

// anchor highlight
// ----

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
