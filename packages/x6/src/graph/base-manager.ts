import { Graph } from './graph'
import { Disposable } from '../common'

export class BaseManager extends Disposable {
  constructor(public graph: Graph) {
    super()
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

  get container() {
    return this.graph.container
  }
}
