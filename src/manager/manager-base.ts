import { Graph } from '../core'
import { Disposable } from '../common'

export class BaseManager extends Disposable {
  graph: Graph

  constructor(graph: Graph) {
    super()
    this.graph = graph
  }

  get model() {
    return this.graph.model
  }

  get view() {
    return this.graph.view
  }

  get options() {
    return this.graph.options
  }
}
