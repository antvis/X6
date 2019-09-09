import * as util from '../util'
import { Cell } from './cell'
import { State } from './state'
import { Graph } from './graph'
import { Dialect, Style } from '../types'
import { Guide } from '../handler'
import { Image } from '../struct'
import { defaultOptions } from './preset'

export namespace Feature {

  interface GraphBehavior {
    prefixCls?: string,
    dialect?: Dialect,
    antiAlias?: boolean,
    /**
     * Specifies if native double click events should be detected.
     */
    nativeDblClickEnabled?: boolean

    /**
     * Specifies if double taps on touch-based devices should be
     * handled as a double click.
     */
    doubleTapEnabled?: boolean

    /**
     * Specifies the timeout for double taps and non-native double clicks.
     */
    doubleTapTimeout?: number

    /**
     * Specifies the tolerance for double taps.
     */
    doubleTapTolerance?: number

    /**
     * Specifies if tap and hold should be used for starting connections on
     * touch-based devices.
     */
    tapAndHoldEnabled?: boolean

    /**
     * Specifies the time for a tap and hold.
     */
    tapAndHoldDelay?: number

    backgroundImage?: Image

    htmlLabels?: boolean

    /**
     * Specifies if labels should be visible.
     */
    labelsVisible?: boolean

    /**
     * Specifies if the label of node movable.
     */
    nodeLabelsMovable?: boolean

    /**
     * Specifies if the label of edge movable.
     */
    edgeLabelsMovable?: boolean

    /**
     * Specifies if multiple edges in the same direction between the
     * same pair of nodes are allowed.
     */
    multigraph?: boolean

    /**
     * Specifies if loops (aka self-references) are allowed.
     */
    allowLoops?: boolean

    /**
     * Specifies if edges with disconnected terminals are allowed in the graph.
     */
    allowDanglingEdges?: boolean

    /**
     * Specifies if edges are connectable.
     */
    connectableEdges?: boolean

    /**
     * Specifies if edges that are cloned should be validated and only
     * inserted if they are valid.
     */
    cloneInvalidEdges?: boolean

    /**
     * Specifies if edges should be disconnected from their terminals
     * when they are moved.
     */
    disconnectOnMove?: boolean

    /**
     * Specifies if the cells in the graph may not be moved, sized, bended,
     * disconnected, edited or selected.
     */
    locked?: boolean

    /**
     * Specifies if the graph allows cloning of cells by using control-drag.
     */
    cloneable?: boolean

    /**
     * Specifies if the cells in the graph may be exported to the clipboard.
     */
    exportable?: boolean

    /**
     * Specifies if cells may be imported to graph from the clipboard.
     */
    importable?: boolean

    selectable?: boolean
    deletable?: boolean
    editable?: boolean
    movable?: boolean
    resizable?: boolean
    bendable?: boolean
    dropable?: boolean
    /**
     * Specifies if dropping onto edges should be splited.
     */
    splitable?: boolean
    /**
     * Specifies if cells is disconnectable.
     */
    disconnectable?: boolean

    /**
    * Specifies if autoSize style should be applied when cells are added.
    */
    autoSizeOnAdded?: boolean

    /**
     * Specifies if the graph should automatically update the cell
     * size after an edit.
     */
    autoSizeOnEdited?: boolean

    /**
     * Border to be added to the bottom and right side when the
     * container is being resized after the graph has been changed.
     */
    border?: number

    /**
     * Specifies if the container should be resized to the graph size
     * when the graph size has changed.
     */
    resizeContainer?: boolean

    /**
     * Specifies if handle escape key press.
     */
    escapeEnabled?: boolean

    /**
     * Specifies if ports are enabled.
     */
    portsEnabled?: boolean

    extendParents?: boolean
    extendParentsOnAdd?: boolean
    extendParentsOnMove?: boolean
    recursiveResize?: boolean
    constrainChildren?: boolean
    constrainRelativeChildren?: boolean
    allowNegativeCoordinates?: boolean

    defaultOverlap?: number
  }

  interface GridOptions {
    enabled?: boolean,
    size?: number,
  }

  interface GuideSubOptions {
    /**
     * Specifies if horizontal or vertical guide are enabled.
     *
     * Default is `true`.
     */
    enabled?: boolean,
    dashed?: boolean | ((this: Graph, o: GetGuideStyleArgs) => boolean),
    stroke?: string | ((this: Graph, o: GetGuideStyleArgs) => string),
    strokeWidth?: number | ((this: Graph, o: GetGuideStyleArgs) => number),
    className?: string | ((this: Graph, o: GetGuideStyleArgs) => string),
  }

  interface GuideOptions {
    /**
     * Specifies if guides are enabled.
     *
     * Default is `false`.
     */
    enabled?: boolean | ((arg: IsGuideEnabledArgs) => boolean),

    /**
     * Specifies if rounded coordinates should be used.
     *
     * Default is `false`.
     */
    rounded?: boolean,

    dashed?: boolean | ((this: Graph, o: GetGuideStyleArgs) => boolean),
    stroke?: string | ((this: Graph, o: GetGuideStyleArgs) => string),
    strokeWidth?: number | ((this: Graph, o: GetGuideStyleArgs) => number),
    className?: string | ((this: Graph, o: GetGuideStyleArgs) => string),

    horizontal?: GuideSubOptions | boolean,
    vertical?: GuideSubOptions | boolean,
  }

  interface RubberbandOptions {
    enabled?: boolean,
    fadeOut?: boolean,
    opacity?: number | ((this: Graph, arg: GetRubberbandStyleArgs) => number),
    border?: string | ((this: Graph, arg: GetRubberbandStyleArgs) => string),
    background?: string | ((this: Graph, arg: GetRubberbandStyleArgs) => string),
    className?: string | ((this: Graph, arg: GetRubberbandStyleArgs) => string),
  }

  interface TooltipOptions {
    /**
     * Specifies if tooltip is enabled.
     *
     * Default is `false`.
     */
    enabled?: boolean,
  }

  interface PageBreakOptions {
    visible?: boolean,
    stroke?: string,
    dsahed?: boolean,
  }

  interface FoldingOptions {
    /**
     * Specifies if folding (collapse and expand via an image icon
     * in the graph should be enabled).
     */
    enabled?: boolean,
    collapsedImage?: Image,
    expandedImage?: Image,
  }

  interface SwimlaneOptions {
    /**
     * Specifies if nesting of swimlanes is allowed.
     */
    nesting?: boolean
    /**
     * Specifies if swimlanes should be selectable via the content if the
     * mouse is released.
     */
    selectable?: boolean
  }

  export interface Options extends GraphBehavior {
    nodeStyle?: Style,
    edgeStyle?: Style,
    grid?: GridOptions | boolean,
    guide?: GuideOptions | boolean,
    tooltip?: TooltipOptions | boolean,
    folding?: FoldingOptions | boolean,
    rubberband?: RubberbandOptions | boolean,
    pageBreak?: PageBreakOptions | boolean,
    swimlane?: SwimlaneOptions,
  }

  export function get(options: Options) {
    const result = util.mergec(
      defaultOptions,
      options,
      {
        decorator: (target, source, key) => {
          const t = target[key]
          const s = source[key]
          if (typeof s === 'boolean' && typeof t === 'object') {
            return {
              ...t,
              enabled: s,
            }
          }

          return s
        },
        ignoreNull: true,
        ignoreUndefined: true,
      },
    ) as Options

    return result
  }

  export function init(graph: Graph) {
    const options = graph.options

    console.log(options)

    graph.prefixCls = options.prefixCls!
    graph.dialect = options.dialect === 'html' ? 'html' : 'svg'

    if (options.backgroundImage != null) {
      graph.backgroundImage = options.backgroundImage
    }

    if (options.htmlLabels != null) {
      graph.htmlLabels = options.htmlLabels
    }

    // grid
    // ----
    const grid = options.grid as GridOptions
    graph.gridSize = grid.size!
    graph.gridEnabled = grid.enabled!

    // guide
    // ----
    if ((options.guide as GuideOptions).enabled) {
      graph.enableGuide()
    }

    // tooltip
    // ----
    if ((options.tooltip as TooltipOptions).enabled) {
      graph.enableTooltip()
    }

    // rubberband
    // ----
    const rubberbandOptions = options.rubberband as RubberbandOptions
    if (rubberbandOptions.enabled) {
      graph.enableRubberband()
    }
    graph.rubberbandHandler.fadeOut = rubberbandOptions.fadeOut as boolean
    graph.rubberbandHandler.opacity = rubberbandOptions.opacity as number
  }

  type Func<T> = (...args: any[]) => T

  function drill<T>(fn: T | Func<T> | undefined, ctx: any, ...args: any[]): T {
    return typeof fn === 'function'
      ? (fn as Func<T>).call(ctx, ...args)
      : fn
  }

  export interface IsGuideEnabledArgs {
    graph: Graph,
    e: MouseEvent,
  }

  export function isGuideEnabled(arg: IsGuideEnabledArgs) {
    const guide = arg.graph.options.guide as GuideOptions
    if (guide != null) {
      if (typeof guide.enabled === 'function') {
        return guide.enabled.call(arg.graph, arg)
      }

      if (typeof guide.enabled === 'boolean') {
        return guide.enabled
      }
    }

    return true
  }

  export interface GetGuideStyleArgs {
    graph: Graph,
    cell: Cell,
    horizontal: boolean
  }

  function getGuideStrockStyle(o: GetGuideStyleArgs) {
    const graph = o.graph
    const options = o.graph.options.guide as GuideOptions
    const sub = (o.horizontal
      ? options.horizontal
      : options.vertical
    ) as GuideSubOptions

    const dashed = (sub.dashed || options.dashed)!
    const stroke = (sub.stroke || options.stroke)!
    const strokeWidth = (sub.strokeWidth || options.strokeWidth)!
    const className = (sub.className || options.className)!

    return {
      dashed: drill(dashed, graph, o),
      stroke: drill(stroke, graph, o),
      strokeWidth: drill(strokeWidth, graph, o),
      className: drill(className, graph, o),
    }
  }

  export function createGuide(graph: Graph, states: State[]) {
    const options = graph.options.guide as GuideOptions
    const horizontal = options.horizontal as GuideSubOptions
    const vertical = options.vertical as GuideSubOptions

    const guide = new Guide(
      graph,
      states,
      {
        getStrockStyle: o => getGuideStrockStyle({ ...o, graph }),
      },
    )

    const guideEnabled = graph.graphHandler.guideEnabled

    guide.rounded = options.rounded!

    guide.horizontal = horizontal.enabled == null
      ? guideEnabled
      : horizontal.enabled!

    guide.vertical = vertical.enabled == null
      ? guideEnabled
      : vertical.enabled!

    return guide
  }

  export interface GetRubberbandStyleArgs {
    graph: Graph,
    x: number,
    y: number,
    width: number,
    height: number,
  }

  export function getRubberbandStyle(o: GetRubberbandStyleArgs) {
    const graph = o.graph
    const options = graph.options.rubberband as RubberbandOptions
    const { opacity, border, background, className } = options

    return {
      className: drill(className, graph, o),
      opacity: drill(opacity, graph, o),
      border: drill(border, graph, o),
      background: drill(background, graph, o),
    }
  }
}
