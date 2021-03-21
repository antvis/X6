import { Disablable } from '../../common'
import { Graph } from '../../graph'

export class AutoSave extends Disablable<AutoSave.EventArgs> {
  protected readonly options: AutoSave.Options

  protected get graph() {
    return this.options.graph
  }

  delay = 10
  throttle = 2
  threshold = 5

  private changeCount = 0
  private timestamp = 0

  constructor(options: AutoSave.Options) {
    super()
    this.options = {
      ...AutoSave.defaultOptions,
      ...options,
    }
    this.graph.model.on('cell:change:*', this.onModelChanged, this)
  }

  private onModelChanged() {
    if (this.disabled) {
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
      this.changeCount += 1
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
    this.graph.model.off('cell:change:*', this.onModelChanged, this)
  }
}

export namespace AutoSave {
  export interface Options {
    graph: Graph
    /**
     * Minimum amount of seconds between two consecutive autosaves.
     */
    delay?: number
    /**
     * Minimum amount of seconds and more than `threshold` changes
     * between two consecutive autosaves.
     */
    throttle?: number
    /**
     * Minimum amount of ignored changes before an autosave.
     */
    threshold?: number
  }

  export const defaultOptions: Partial<Options> = {
    delay: 10,
    throttle: 2,
    threshold: 5,
  }

  export interface EventArgs {
    save?: null
  }
}
