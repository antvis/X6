import { Graph } from './graph'
import { Disposable } from '../common'

export class Base extends Disposable {
  protected readonly graph: Graph

  protected get options() {
    return this.graph.options
  }

  protected get model() {
    return this.graph.model
  }

  protected get view() {
    return this.graph.view
  }

  constructor(graph: Graph) {
    super()
    this.graph = graph
    this.init()
  }

  protected init() {}
}
