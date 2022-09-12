import { Dom, ModifierKey, Disposable, CssLoader } from '@antv/x6-common'
import { Graph, Config } from '@antv/x6-next'
import { ScrollerImpl } from './scroller'
import { content } from './style/raw'

export class Scroller extends Disposable {
  private graph: Graph
  public name = 'scroller'
  public scrollerImpl: ScrollerImpl

  constructor(public readonly options: Scroller.Options) {
    super()
  }

  get pannable() {
    if (this.options) {
      if (typeof this.options.pannable === 'object') {
        return this.options.pannable.enabled
      }
      return !!this.options.pannable
    }

    return false
  }

  protected init(graph: Graph) {
    this.graph = graph
    CssLoader.ensure('scroller', content)
    this.scrollerImpl = new ScrollerImpl({
      ...this.options,
      graph,
    })
    this.startListening()
    this.updateClassName()
    this.scrollerImpl.center()
  }

  protected startListening() {
    let eventTypes = []
    const pannable = this.options.pannable
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
      Dom.Event.on(
        this.scrollerImpl.container,
        'mousedown',
        this.onRightMouseDown,
      )
    }
  }

  protected stopListening() {
    let eventTypes = []
    const pannable = this.options.pannable
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
      Dom.Event.off(
        this.scrollerImpl.container,
        'mousedown',
        this.onRightMouseDown,
      )
    }
  }

  protected onRightMouseDown(e: Dom.MouseDownEvent) {
    if (e.button === 2 && this.allowPanning(e, true)) {
      this.updateClassName(true)
      this.scrollerImpl.startPanning(e)
      this.scrollerImpl.once('pan:stop', () => this.updateClassName(false))
    }
  }

  protected preparePanning({ e }: { e: Dom.MouseDownEvent }) {
    const allowPanning = this.allowPanning(e, true)
    const selection = this.graph.getPlugin('selection') as any
    const allowRubberband =
      this.allowPanning(e) && selection && selection.allowRubberband(e, true)
    if (allowPanning || !allowRubberband) {
      this.updateClassName(true)
      this.scrollerImpl.startPanning(e)
      this.scrollerImpl.once('pan:stop', () => this.updateClassName(false))
    }
  }

  allowPanning(e: Dom.MouseDownEvent, strict?: boolean) {
    return (
      this.pannable && ModifierKey.isMatch(e, this.options.modifiers, strict)
    )
  }

  protected updateClassName(isPanning?: boolean) {
    const container = this.scrollerImpl.container!
    const pannable = Config.prefix('graph-scroller-pannable')
    if (this.pannable) {
      Dom.addClass(container, pannable)
      container.dataset.panning = (!!isPanning).toString() // Use dataset to control scroller panning style to avoid reflow caused by changing classList
    } else {
      Dom.removeClass(container, pannable)
    }
  }

  enablePanning() {
    if (!this.pannable) {
      this.options.pannable = true
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
      this.options.pannable = false
      this.updateClassName()
    }
  }

  lock() {
    this.scrollerImpl.lock()
  }

  unlock() {
    this.scrollerImpl.unlock()
  }

  update() {
    this.scrollerImpl.update()
  }

  enableAutoResize() {
    this.scrollerImpl.enableAutoResize()
  }

  disableAutoResize() {
    this.scrollerImpl.disableAutoResize()
  }

  resize(width?: number, height?: number) {
    this.scrollerImpl.resize(width, height)
  }

  @Disposable.dispose()
  dispose() {
    this.scrollerImpl.dispose()
    this.stopListening()
    CssLoader.clean('scroller')
  }
}

export namespace Scroller {
  type EventType = 'leftMouseDown' | 'rightMouseDown'
  export interface Options extends ScrollerImpl.CommonOptions {
    pannable?: boolean | { enabled: boolean; eventTypes: EventType[] }
    modifiers?: string | ModifierKey[] | null // alt, ctrl, shift, meta
  }
}
