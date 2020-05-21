import { Scroller } from '../addon/scroller'
import { Base } from './base'
import { ModifierKey } from '../types'

export class ScrollerManager extends Base {
  public widget: Scroller | null

  protected get widgetOptions() {
    return this.options.scroller
  }

  protected get allowPanning() {
    return this.widgetOptions && this.widgetOptions.panning === true
  }

  protected init() {
    this.widget = this.graph.hook.createScroller()
    this.graph.on('blank:mousedown', ({ e }) => {
      if (
        this.widget &&
        this.allowPanning &&
        ModifierKey.test(e, this.widgetOptions.modifiers) &&
        this.graph.hook.allowPanning(e)
      ) {
        this.widget.startPanning(e)
      }
    })
  }

  enablePanning() {
    if (!this.allowPanning) {
      this.widgetOptions.panning = true
      if (
        ModifierKey.equals(
          this.graph.options.scroller.modifiers,
          this.graph.options.selecting.modifiers,
        )
      ) {
        this.graph.selection.disableRubberband()
      }
    }
  }

  disablePanning() {
    if (this.allowPanning) {
      this.widgetOptions.panning = false
    }
  }
}

export namespace ScrollerManager {
  export interface Options extends Scroller.CommonOptions {
    enabled?: boolean
    panning?: boolean
    /**
     * alt, ctrl, shift, meta
     */
    modifiers?: string | null
  }
}
