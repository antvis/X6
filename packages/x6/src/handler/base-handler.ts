import { Graph } from '../graph'
import { Disablable } from '../common'

export class BaseHandler<EventArgs = any> extends Disablable<EventArgs> {
  constructor(graph: Graph) {
    super()
    this.graph = graph
  }

  public readonly graph: Graph

  get view() {
    return this.graph.view
  }
}
