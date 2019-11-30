import { Graph } from '../../core'
import { OptionItem, drill } from '../../option'

export interface RubberbandOptions {
  enabled: boolean
  fadeOut: boolean
  opacity: OptionItem<GetRubberbandStyleArgs, number>
  border: OptionItem<GetRubberbandStyleArgs, string>
  background: OptionItem<GetRubberbandStyleArgs, string>
  className?: OptionItem<GetRubberbandStyleArgs, string>
}

export interface GetRubberbandStyleArgs {
  graph: Graph
  x: number
  y: number
  width: number
  height: number
}

export function getRubberbandStyle(e: GetRubberbandStyleArgs) {
  const graph = e.graph
  const options = graph.options.rubberband as RubberbandOptions
  const { opacity, border, background, className } = options

  return {
    className: drill(className, graph, e),
    opacity: drill(opacity, graph, e),
    border: drill(border, graph, e),
    background: drill(background, graph, e),
  }
}
