import { ModifierKey } from '../types'
import { Scroller } from '../addon/scroller'
import { Base } from './base'

export class ScrollerManager extends Base {
  public widget: Scroller | null

  protected get widgetOptions() {
    return this.options.scroller
  }

  get pannable() {
    return this.widgetOptions && this.widgetOptions.pannable === true
  }

  protected init() {
    this.widget = this.graph.hook.createScroller()
    this.autoSetCursor()

    this.graph.on('blank:mousedown', this.preparePanning, this)
    this.graph.on('node:unhandled:mousedown', this.preparePanning, this)
    this.graph.on('edge:unhandled:mousedown', this.preparePanning, this)

    if (this.widget) {
      this.widget.center()
    }
  }

  protected preparePanning({ e }: { e: JQuery.MouseDownEvent }) {
    if (
      this.widget &&
      this.pannable &&
      ModifierKey.test(e, this.widgetOptions.modifiers) &&
      this.graph.hook.allowPanning(e)
    ) {
      this.widget.startPanning(e)
    }
  }

  protected autoSetCursor() {
    const options = this.widgetOptions
    if (options.cursor == null) {
      const cursor = options.pannable ? 'grab' : ''
      this.widget?.setCursor(cursor, { silent: true })
    }
  }

  enablePanning() {
    if (!this.pannable) {
      this.widgetOptions.pannable = true
      if (
        ModifierKey.equals(
          this.graph.options.scroller.modifiers,
          this.graph.options.selecting.modifiers,
        )
      ) {
        this.graph.selection.disableRubberband()
      }
    }
    this.autoSetCursor()
  }

  disablePanning() {
    if (this.pannable) {
      this.widgetOptions.pannable = false
    }
    this.autoSetCursor()
  }

  lock() {
    if (this.widget) {
      this.widget.lock()
    }
  }

  unlock() {
    if (this.widget) {
      this.widget.unlock()
    }
  }

  update() {
    if (this.widget) {
      this.widget.update()
    }
  }

  setCursor(cursor?: string) {
    if (this.widget) {
      this.widget.setCursor(cursor)
    }
  }
}

export namespace ScrollerManager {
  export interface Options extends Scroller.CommonOptions {
    enabled?: boolean
    pannable?: boolean
    /**
     * alt, ctrl, shift, meta
     */
    modifiers?: string | ModifierKey[] | null
  }
}
