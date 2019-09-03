import { Graph } from '../core'
import { DomEvent, IDisposable, detector } from '../common'

export class BaseManager implements IDisposable {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
    if (detector.IS_IE) {
      DomEvent.addListener(window, 'unload', () => {
        this.dispose()
      })
    }
  }

  get model() {
    return this.graph.model
  }

  get view() {
    return this.graph.view
  }

  get hooks() {
    return this.graph.hooks
  }

  get isDisposed() {
    return this.disposed
  }

  protected disposed: boolean = false

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true
    }
  }
}
