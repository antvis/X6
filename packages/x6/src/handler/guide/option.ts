import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { State } from '../../core/state'
import { Guide } from './guide'
import { drill, StrokeStyle, OptionItem } from '../../option'

export interface GuideSubOptions extends StrokeStyle<GetGuideStyleArgs> {
  /**
   * Specifies if horizontal or vertical guide are enabled.
   *
   * Default is `true`.
   */
  enabled: boolean
  className: OptionItem<GetGuideStyleArgs, string>
}

export interface GuideOptions extends StrokeStyle<GetGuideStyleArgs> {
  /**
   * Specifies if guides are enabled.
   *
   * Default is `false`.
   */
  enabled: OptionItem<IsGuideEnabledArgs, boolean>

  /**
   * Specifies if rounded coordinates should be used.
   *
   * Default is `false`.
   */
  rounded: boolean
  className?: OptionItem<GetGuideStyleArgs, string>
  horizontal: Partial<GuideSubOptions> | boolean
  vertical: Partial<GuideSubOptions> | boolean
}

export interface IsGuideEnabledArgs {
  graph: Graph
  e: MouseEvent
}

export function isGuideEnabled(args: IsGuideEnabledArgs) {
  const guide = args.graph.options.guide
  return drill(guide.enabled, args.graph, args)
}

export interface GetGuideStyleArgs {
  graph: Graph
  cell: Cell
  horizontal: boolean
}

function getGuideStrockStyle(args: GetGuideStyleArgs) {
  const graph = args.graph
  const options = graph.options.guide
  const sub = (args.horizontal
    ? options.horizontal
    : options.vertical) as GuideSubOptions

  const dashed = sub.dashed != null ? sub.dashed : options.dashed
  const stroke = sub.stroke != null ? sub.stroke : options.stroke
  const strokeWidth =
    sub.strokeWidth != null ? sub.strokeWidth : options.strokeWidth
  const className = sub.className != null ? sub.className : options.className

  return {
    dashed: drill(dashed, graph, args),
    stroke: drill(stroke, graph, args),
    strokeWidth: drill(strokeWidth, graph, args),
    className: drill(className, graph, args),
  }
}

export function createGuide(graph: Graph, states: State[]) {
  const options = graph.options.guide as GuideOptions
  const horizontal = options.horizontal as GuideSubOptions
  const vertical = options.vertical as GuideSubOptions

  const guide = new Guide(graph, states, {
    getStrockStyle: o => getGuideStrockStyle({ ...o, graph }),
  })

  guide.rounded = options.rounded
  guide.horizontal =
    horizontal != null && horizontal.enabled != null ? horizontal.enabled : true
  guide.vertical =
    vertical != null && vertical.enabled != null ? vertical.enabled : true

  return guide
}
