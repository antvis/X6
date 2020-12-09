import { Dom } from '../util'
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
    this.startListening()
    this.updateClassName()
    if (this.widget) {
      this.widget.center()
    }
  }

  protected startListening() {
    this.graph.on('blank:mousedown', this.preparePanning, this)
    this.graph.on('node:unhandled:mousedown', this.preparePanning, this)
    this.graph.on('edge:unhandled:mousedown', this.preparePanning, this)
  }

  protected stopListening() {
    this.graph.off('blank:mousedown', this.preparePanning, this)
    this.graph.off('node:unhandled:mousedown', this.preparePanning, this)
    this.graph.off('edge:unhandled:mousedown', this.preparePanning, this)
  }

  protected preparePanning({ e }: { e: JQuery.MouseDownEvent }) {
    if (this.widget != null && this.allowPanning(e)) {
      if (this.graph.selection.allowRubberband(e)) {
        // log warning?
      } else {
        this.updateClassName(true)
        this.widget.startPanning(e)
        this.widget.once('pan:stop', () => this.updateClassName(false))
      }
    }
  }

  allowPanning(e: JQuery.MouseDownEvent) {
    return (
      this.widget &&
      this.pannable &&
      ModifierKey.test(e, this.widgetOptions.modifiers) &&
      this.graph.hook.allowPanning(e)
    )
  }

  protected updateClassName(isPanning?: boolean) {
    if (this.widget == null) {
      return
    }
    const container = this.widget.container!
    const panning = this.view.prefixClassName('graph-scroller-panning')
    const pannable = this.view.prefixClassName('graph-scroller-pannable')
    if (this.pannable) {
      if (isPanning) {
        Dom.addClass(container, panning)
        Dom.removeClass(container, pannable)
      } else {
        Dom.removeClass(container, panning)
        Dom.addClass(container, pannable)
      }
    } else {
      Dom.removeClass(container, panning)
      Dom.removeClass(container, pannable)
    }
  }

  enablePanning() {
    if (!this.pannable) {
      this.widgetOptions.pannable = true
      this.updateClassName()

      // if (
      //   ModifierKey.equals(
      //     this.graph.options.scroller.modifiers,
      //     this.graph.options.selecting.modifiers,
      //   )
      // ) {
      //   this.graph.selection.disableRubberband()
      // }
    }
  }

  disablePanning() {
    if (this.pannable) {
      this.widgetOptions.pannable = false
      this.updateClassName()
    }
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

  resize(width?: number, height?: number) {
    if (this.widget) {
      this.widget.resize(width, height)
    }
  }

  @Base.dispose()
  dispose() {
    if (this.widget) {
      this.widget.dispose()
    }
    this.stopListening()
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
