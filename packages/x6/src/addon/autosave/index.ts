import { Disablable } from '../../entity'
import { Graph } from '../../graph'
import { IChange } from '../../change'

export class AutoSave extends Disablable<AutoSave.EventArgs> {
  graph: Graph

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

  private changeCount: number = 0
  private timestamp: number = 0

  constructor(graph: Graph) {
    super()
    this.setGraph(graph)
  }

  setGraph(graph: Graph | null) {
    if (this.graph != null) {
      this.graph.model.off('change', this.onModelChanged, this)
    }

    if (graph != null) {
      this.graph = graph
    } else {
      delete this.graph
    }

    if (this.graph != null) {
      this.graph.model.on('change', this.onModelChanged, this)
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
      (this.changeCount >= this.threshold && dt > this.throttle)
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

  @Disablable.dispose()
  dispose() {
    this.setGraph(null)
  }
}

export namespace AutoSave {
  export interface EventArgs {
    save?: null
  }
}
