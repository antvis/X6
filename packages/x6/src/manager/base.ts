import { Graph } from '../graph'
import { Disposable } from '../common'

export class ManagerBase extends Disposable {
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

  get renderer() {
    return this.graph.renderer
  }
}
