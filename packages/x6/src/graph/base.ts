import { Graph } from './graph'
import { Disposable } from '../common'

export class Base extends Disposable {
  protected get options() {
    return this.graph.options
  }

  protected get model() {
    return this.graph.model
  }

  protected get view() {
    return this.graph.view
  }

  constructor(protected readonly graph: Graph) {
    super()
    this.init()
  }

  protected init() {}
}
