import * as util from '../util'
import { Cell } from './cell'
import { State } from './state'
import { Graph } from './graph'
import { Dialect } from '../types'
import { Guide } from '../handler'

export namespace Feature {

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

  export interface Options {
    prefixCls?: string,
    dialect?: Dialect,
    grid?: GridOptions | boolean,
    guide?: GuideOptions | boolean,
    tooltip?: TooltipOptions | boolean,
    rubberband?: RubberbandOptions | boolean,
  }

  const defaultOptions: Options = {
    prefixCls: 'x6',
    dialect: 'svg',
    grid: {
      enabled: true,
      size: 10,
    },
    guide: {
      enabled: false,
      rounded: false,
      dashed: false,
      stroke: '#1890ff',
      strokeWidth: 1,
      horizontal: {
        enabled: true,
      },
      vertical: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: false,
    },
    rubberband: {
      enabled: false,
      fadeOut: false,
      border: '1px solid #0000ff',
      background: '#0077ff',
      opacity: 0.2,
    },
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
