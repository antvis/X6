import { Events } from '../common'
import { IChange } from '../change'
import { Graph, Model } from '../core'

export class AutoSave extends Events {
  graph: Graph | null

  /**
   * Minimum amount of seconds between two consecutive autosaves.
   */
  delay: number = 10

  /**
   * Minimum amount of seconds and more than `threshold` changes
   * between two consecutive autosaves.
   */
  throttle: number = 2

  /**
   * Minimum amount of ignored changes before an autosave.
   */
  threshold: number = 5

  private enabled: boolean = true
  private changeCount: number = 0
  private timestamp: number = 0

  constructor(graph: Graph) {
    super()
    this.setGraph(graph)
  }

  isEnabled() {
    return this.enabled
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  setGraph(graph: Graph | null) {
    if (this.graph != null) {
      this.graph.model.off(Model.events.change, this.onModelChanged, this)
    }

    this.graph = graph

    if (this.graph != null) {
      this.graph.model.on(Model.events.change, this.onModelChanged, this)
    }
  }

  private onModelChanged(changes: IChange[]) {
    if (!this.isEnabled()) {
      return
    }

    const now = new Date().getTime()
    const dt = (now - this.timestamp) / 1000

    if (
      dt > this.delay ||
      (
        this.changeCount >= this.threshold &&
        dt > this.throttle
      )
    ) {
      this.save()
      this.reset()
    } else {
      this.changeCount += changes.length
    }
  }

  private save() {
    this.trigger('save')
  }

  reset() {
    this.changeCount = 0
    this.timestamp = new Date().getTime()
  }

  destroy() {
    this.setGraph(null)
  }
}
