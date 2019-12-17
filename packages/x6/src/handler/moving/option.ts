import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { CellHighlight } from '../cell-highlight'
import {
  drill,
  BaseArgs,
  BaseStyle,
  OptionItem,
  StrokeStyle,
  applyBaseStyle,
  applyClassName,
  applyCursorStyle,
  applyManualStyle,
} from '../../option'

export interface MovingPreviewOptions
  extends BaseStyle<ApplyMovingPreviewStyleArgs> {
  /**
   * Specifies if draw a html preview. If this is used then drop target
   * detection relies entirely on `graph.getCellAt` because the HTML
   * preview does not "let events through".
   *
   * Default is `false`.
   */
  html: boolean

  /**
   * Specifies the minimum number of pixels for the width and height of a
   * selection bounds.
   *
   * Default is `6`.
   */
  minimumSize: number

  /**
   * Specifies if the grid should be scaled.
   *
   * Default is `false`.
   */
  scaleGrid: boolean

  cursor: OptionItem<ApplyMovingPreviewStyleArgs, string>
}

export interface ApplyMovingPreviewStyleArgs extends BaseArgs {
  x: number
  y: number
  width: number
  height: number
}

export function applyMovingPreviewStyle(args: ApplyMovingPreviewStyleArgs) {
  const options = args.graph.options.movingPreview

  applyBaseStyle(args, options)
  applyClassName(args, options, 'moving-preview')
  applyCursorStyle(args, options)
  applyManualStyle(args, options)
}

export interface ApplyDropTargetHighlightStyleArgs {
  graph: Graph
  cell: Cell
  highlight: CellHighlight
}

export interface DropTargetHighlightOptions
  extends StrokeStyle<ApplyDropTargetHighlightStyleArgs> {
  opacity: OptionItem<ApplyDropTargetHighlightStyleArgs, number>
  spacing: OptionItem<ApplyDropTargetHighlightStyleArgs, number>
}

export function applyDropTargetHighlightStyle(
  args: ApplyDropTargetHighlightStyleArgs,
) {
  const { graph, highlight } = args
  const opts = graph.options.dropTargetHighlight
  highlight.highlightColor = drill(opts.stroke, graph, args)
  highlight.strokeWidth = drill(opts.strokeWidth, graph, args)
  highlight.dashed = drill(opts.dashed, graph, args)
  highlight.opacity = drill(opts.opacity, graph, args)
  highlight.spacing = drill(opts.spacing, graph, args)
}
