import { Point } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { Shape } from '../../shape'
import { Style } from '../../types'
import { Image } from '../../struct'
import { CellHighlight } from '../cell-highlight'
import {
  drill,
  OptionItem,
  BaseStyle,
  applyClassName,
  applyBaseStyle,
  applyManualStyle,
} from '../../option'

export interface ConnectionOptions {
  enabled: boolean

  /**
   * Function that is used for creating new edges.
   */
  createEdge?: (
    this: Graph,
    args: { source: Cell; target: Cell; style: Style },
  ) => Cell

  /**
   * Function that is used for creating new nodes if no target
   * was under the mouse.
   */
  createTargetNode?: (this: Graph, source: Cell, evt: MouseEvent) => Cell

  /**
   * Specifies the cursor to be used while the handler is active.
   *
   * Default is `null`.
   */
  cursor: string

  /**
   * Specifies if new edges should be selected.
   *
   * Default is `true`.
   */
  autoSelect: boolean

  /**
   * Specifies if `createTargetNode` should be called if no target was under
   * the mouse for the new connection. Setting this to `true` means the
   * connection will be drawn as valid if no target is under the mouse, and
   * `createTargetNode` will be called before the connection is created between
   * the source cell and the newly created node, which can be overridden to
   * create a new target.
   *
   * Default is `false`.
   */
  autoCreateTarget: boolean

  /**
   * Specifies if single clicks should add waypoints on the new edge.
   *
   * Default is `false`.
   */
  waypointsEnabled: boolean

  /**
   * Specifies if the connection handler should ignore the state of the mouse
   * button when highlighting the source. Default is `false`, that is, the
   * handler only highlights the source if no button is being pressed.
   */
  ignoreMouseDown: boolean

  /**
   * Specifies if the actual shape of the edge state should be used for
   * the preview.
   *
   * Default is `false`.
   */
  livePreview: boolean

  /**
   * Specifies if new edges should be inserted before the source node in the
   * cell hierarchy.
   *
   * Default is `false`.
   */
  insertBeforeSource: boolean

  /**
   * Specifies if the hotspot is enabled.
   *
   * Default is `false`.
   */
  hotspotable: boolean

  /**
   * Specifies the portion of the width and height that should trigger
   * a highlight. The area around the center of the cell to be marked
   * is used as the hotspot.
   *
   * Default is `0.3`.
   *
   * Possible values are between 0 and 1.
   */
  hotspotRate: number

  /**
   * Defines the minimum size in pixels of the portion of the cell which is
   * to be used as a connectable region.
   *
   * Default is `8`.
   */
  minHotspotSize: number

  /**
   * Defines the maximum size in pixels of the portion of the cell which is
   * to be used as a connectable region.
   *
   * Use `0` for no maximum. Default is `0`.
   */
  maxHotspotSize: number
}

export interface ConnectionHighlightOptions {
  validColor: string
  invalidColor: string
  strokeWidth: number
  dashed: boolean
  spacing: number
  opacity: number

  /**
   * Specifies if the highlights should appear on top of everything
   * else in the overlay pane.
   *
   * Default is `false`.
   */
  keepOnTop: boolean
}

export interface GetConnectionHighlightOptionsArgs {
  graph: Graph
  cell?: Cell
}

export function getConnectionHighlightOptions(
  args: GetConnectionHighlightOptionsArgs,
) {
  const options = args.graph.options.connectionHighlight

  const result = {}
  Object.keys(options).forEach((key: keyof ConnectionHighlightOptions) => {
    const tmp = result as any
    tmp[key] = drill(options[key], args.graph, args)
  })

  return result as ConnectionHighlightOptions
}

export interface ApplyConnectionHighlightStyleArgs {
  graph: Graph
  cell: Cell
  valid: boolean
  highlight: CellHighlight
}

export function applyConnectionHighlightStyle(
  args: ApplyConnectionHighlightStyleArgs,
) {
  const { graph, valid, highlight } = args
  const opts = graph.options.connectionHighlight
  highlight.highlightColor = drill(
    valid ? opts.validColor : opts.invalidColor,
    graph,
    args,
  )
  highlight.strokeWidth = drill(opts.strokeWidth, graph, args)
  highlight.dashed = drill(opts.dashed, graph, args)
  highlight.opacity = drill(opts.opacity, graph, args)
  highlight.spacing = drill(opts.spacing, graph, args)
}

export interface ConnectionIconOptions {
  image?: OptionItem<GetConnectionIconOptionsArgs, Image>

  /**
   * Holds the offset for connect icons during connection preview.
   *
   * Note that placing the icon under the mouse pointer with an
   * offset of (0,0) will affect hit detection.
   */
  offset: OptionItem<GetConnectionIconOptionsArgs, Point | Point.PointLike>

  /**
   * Specifies if icons should be displayed inside the graph container
   * instead of the overlay pane. This is used for HTML labels on nodes
   * which hide the connect icon.
   *
   * Default is `false`.
   */
  toFront: OptionItem<GetConnectionIconOptionsArgs, boolean>

  /**
   * Specifies if icons should be moved to the back of the overlay pane.
   * This can be set to `true` if the icons of the connection handler
   * conflict with other handles, such as the node label move handle.
   *
   * Default is `false`.
   */
  toBack: OptionItem<GetConnectionIconOptionsArgs, boolean>

  cursor: OptionItem<GetConnectionIconOptionsArgs, string>

  /**
   * Specifies if the connect icon should be centered on the target state
   * while connections are being previewed.
   *
   * Default is `false`.
   */
  centerTarget: OptionItem<GetConnectionIconOptionsArgs, boolean>
}

export interface GetConnectionIconOptionsArgs {
  graph: Graph
  cell: Cell
}

export function getConnectionIconOptions(args: GetConnectionIconOptionsArgs) {
  const options = args.graph.options.connectionIcon
  return {
    image: drill(options.image, args.graph, args),
    toFront: drill(options.toFront, args.graph, args),
    toBack: drill(options.toBack, args.graph, args),
    cursor: drill(options.cursor, args.graph, args),
    offset: drill(options.offset, args.graph, args),
    centerTarget: drill(options.centerTarget, args.graph, args),
  }
}

export function getConnectionIcon(args: GetConnectionIconOptionsArgs) {
  const options = args.graph.options.connectionIcon
  return drill(options.image, args.graph, args)
}

export interface ConnectionPreviewOptions
  extends BaseStyle<ApplyConnectionPreviewStyleArgs> {}

export interface ApplyConnectionPreviewStyleArgs {
  graph: Graph
  shape: Shape
  valid: boolean
  livePreview: boolean
}

export function applyConnectionPreviewStyle(
  args: ApplyConnectionPreviewStyleArgs,
) {
  const { graph } = args
  const options = graph.options.connectionPreview

  applyBaseStyle(args, options)
  applyClassName(args, options, 'connection-preview')
  applyManualStyle(args, options)
}
