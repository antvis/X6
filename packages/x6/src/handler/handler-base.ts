import { Graph } from '../graph'
import { Disablable } from '../common'

export abstract class BaseHandler extends Disablable {
  graph: Graph

  constructor(graph: Graph) {
    super()
    this.graph = graph
  }
}
