import { Graph } from '../core'
import { DomEvent, IDisposable, Events, detector } from '../common'

export class BaseHandler extends Events implements IDisposable {
  graph: Graph

  constructor(graph: Graph) {
    super()
    this.graph = graph

    if (detector.IS_IE) {
      DomEvent.addListener(window, 'unload', () => {
        this.dispose()
      })
    }
  }

  protected enabled: boolean = true

  isEnabled() {
    return this.enabled
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
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
