import { ModifierKey } from '../types'
import { Dom } from '../util'
import { Base } from './base'

export class PanningManager extends Base {
  private panning: boolean
  private clientX: number
  private clientY: number

  protected get widgetOptions() {
    return this.options.panning
  }

  get pannable() {
    return this.widgetOptions && this.widgetOptions.enabled === true
  }

  protected init() {
    this.startListening()
    this.updateClassName()
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
    if (this.allowPanning(e)) {
      if (this.graph.selection.allowRubberband(e)) {
        // log warning?
      } else {
        this.startPanning(e)
      }
    }
  }

  allowPanning(e: JQuery.MouseDownEvent) {
    return (
      this.pannable &&
      ModifierKey.test(e, this.widgetOptions.modifiers) &&
      this.graph.hook.allowPanning(e)
    )
  }

  protected startPanning(evt: JQuery.MouseDownEvent) {
    const e = this.view.normalizeEvent(evt)
    this.clientX = e.clientX
    this.clientY = e.clientY
    this.panning = true
    this.updateClassName()
    this.view.$(document.body).on({
      'mousemove.panning touchmove.panning': this.pan.bind(this),
      'mouseup.panning touchend.panning': this.stopPanning.bind(this),
    })
    this.view.$(window).on('mouseup.panning', this.stopPanning.bind(this))
  }

  protected pan(evt: JQuery.MouseMoveEvent) {
    const e = this.view.normalizeEvent(evt)
    const dx = e.clientX - this.clientX
    const dy = e.clientY - this.clientY
    this.clientX = e.clientX
    this.clientY = e.clientY
    this.graph.translateBy(dx, dy)
  }

  protected stopPanning(e: JQuery.MouseUpEvent) {
    this.panning = false
    this.updateClassName()
    this.view.$(document.body).off('.panning')
    this.view.$(window).off('.panning')
  }

  protected updateClassName() {
    const container = this.view.container
    const panning = this.view.prefixClassName('graph-panning')
    const pannable = this.view.prefixClassName('graph-pannable')
    if (this.pannable) {
      if (this.panning) {
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
      this.widgetOptions.enabled = true
      this.updateClassName()
      // if (
      //   ModifierKey.equals(
      //     this.graph.options.panning.modifiers,
      //     this.graph.options.selecting.modifiers,
      //   )
      // ) {
      //   this.graph.selection.disableRubberband()
      // }
    }
  }

  disablePanning() {
    if (this.pannable) {
      this.widgetOptions.enabled = false
      this.updateClassName()
    }
  }

  @Base.dispose()
  dispose() {
    this.stopListening()
  }
}

export namespace PanningManager {
  export interface Options {
    enabled?: boolean
    modifiers?: string | ModifierKey[] | null
  }
}
