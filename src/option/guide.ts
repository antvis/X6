import { Guide } from '../handler'
import { Graph, Cell, State } from '../core'
import { OptionItem, StrokeStyle, drill } from './util'

export interface GuideSubOptions extends StrokeStyle<GetGuideStyleArgs> {
  /**
   * Specifies if horizontal or vertical guide are enabled.
   *
   * Default is `true`.
   */
  enabled: boolean,
  className: OptionItem<GetGuideStyleArgs, string>,
}

export interface GuideOptions extends StrokeStyle<GetGuideStyleArgs> {
  /**
   * Specifies if guides are enabled.
   *
   * Default is `false`.
   */
  enabled: OptionItem<IsGuideEnabledArgs, boolean>,

  /**
   * Specifies if rounded coordinates should be used.
   *
   * Default is `false`.
   */
  rounded: boolean,
  className?: OptionItem<GetGuideStyleArgs, string>,
  horizontal: Partial<GuideSubOptions> | boolean,
  vertical: Partial<GuideSubOptions> | boolean,
}

export interface IsGuideEnabledArgs {
  graph: Graph,
  e: MouseEvent,
}

export function isGuideEnabled(o: IsGuideEnabledArgs) {
  const guide = o.graph.options.guide as GuideOptions
  if (guide != null) {
    if (typeof guide.enabled === 'function') {
      return guide.enabled.call(o.graph, o)
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

  const dashed = (sub.dashed || options.dashed)
  const stroke = (sub.stroke || options.stroke)
  const strokeWidth = (sub.strokeWidth || options.strokeWidth)
  const className = (sub.className || options.className)

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

  guide.horizontal = horizontal && horizontal.enabled != null
    ? horizontal.enabled
    : guideEnabled

  guide.vertical = vertical && vertical.enabled != null
    ? vertical.enabled
    : guideEnabled

  return guide
}
