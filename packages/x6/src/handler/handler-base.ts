import { Graph } from '../graph'
import { Disablable } from '../common'

export abstract class BaseHandler extends Disablable {
  public readonly graph: Graph

  get view() {
    return this.graph.view
  }

  constructor(graph: Graph) {
    super()
    this.graph = graph
    this.init()
  }

  protected init() {}
}
