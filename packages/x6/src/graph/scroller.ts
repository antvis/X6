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
    if (this.widgetOptions) {
      if (typeof this.widgetOptions.pannable === 'object') {
        return this.widgetOptions.pannable.enabled
      }
      return !!this.widgetOptions.pannable
    }
    return false
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
    let eventTypes = []
    const pannable = this.widgetOptions.pannable
    if (typeof pannable === 'object') {
      eventTypes = pannable.eventTypes || []
    } else {
      eventTypes = ['leftMouseDown']
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.on('blank:mousedown', this.preparePanning, this)
      this.graph.on('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.on('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      this.onRightMouseDown = this.onRightMouseDown.bind(this)
      this.view.$(this.widget!.container).on('mousedown', this.onRightMouseDown)
    }
  }

  protected stopListening() {
    let eventTypes = []
    const pannable = this.widgetOptions.pannable
    if (typeof pannable === 'object') {
      eventTypes = pannable.eventTypes || []
    } else {
      eventTypes = ['leftMouseDown']
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.off('blank:mousedown', this.preparePanning, this)
      this.graph.off('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.off('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      this.view
        .$(this.widget!.container)
        .off('mousedown', this.onRightMouseDown)
    }
  }

  protected onRightMouseDown(e: JQuery.MouseDownEvent) {
    if (e.button === 2 && this.allowPanning(e, true) && this.widget) {
      this.updateClassName(true)
      this.widget.startPanning(e)
      this.widget.once('pan:stop', () => this.updateClassName(false))
    }
  }

  protected preparePanning({ e }: { e: JQuery.MouseDownEvent }) {
    if (this.widget) {
      if (
        this.allowPanning(e, true) ||
        (this.allowPanning(e) && !this.graph.selection.allowRubberband(e, true))
      ) {
        this.updateClassName(true)
        this.widget.startPanning(e)
        this.widget.once('pan:stop', () => this.updateClassName(false))
      }
    }
  }

  allowPanning(e: JQuery.MouseDownEvent, strict?: boolean) {
    return (
      this.widget &&
      this.pannable &&
      ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
      this.graph.hook.allowPanning(e)
    )
  }

  protected updateClassName(isPanning?: boolean) {
    if (this.widget == null) {
      return
    }
    const container = this.widget.container!
    const pannable = this.view.prefixClassName('graph-scroller-pannable')
    if (this.pannable) {
      Dom.addClass(container, pannable)
      container.dataset.panning = (!!isPanning).toString() // Use dataset to control scroller panning style to avoid reflow caused by changing classList
    } else {
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

  enableAutoResize() {
    if (this.widget) {
      this.widget.enableAutoResize()
    }
  }

  disableAutoResize() {
    if (this.widget) {
      this.widget.disableAutoResize()
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
  type EventType = 'leftMouseDown' | 'rightMouseDown'
  export interface Options extends Scroller.CommonOptions {
    enabled?: boolean
    pannable?: boolean | { enabled: boolean; eventTypes: EventType[] }
    /**
     * alt, ctrl, shift, meta
     */
    modifiers?: string | ModifierKey[] | null
  }
}
