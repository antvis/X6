import { Dom, disposable, FunctionExt } from '../common'
import { Base } from './base'

export class VirtualRenderManager extends Base {
  private scrollerRef?: any
  private scrollerScrollHandler?: Dom.TypeEventHandler<
    Element,
    undefined,
    Element,
    Element,
    'scroll'
  >

  protected init() {
    this.resetRenderArea = FunctionExt.throttle(this.resetRenderArea, 200, {
      leading: true,
    })
    this.resetRenderArea()
    this.startListening()
  }

  private bindScrollerEvents(scroller: any) {
    this.scrollerRef = scroller
    if (typeof scroller.on === 'function') {
      scroller.on('pan:start', this.resetRenderArea, this)
      scroller.on('panning', this.resetRenderArea, this)
      scroller.on('pan:stop', this.resetRenderArea, this)
    }

    const container = scroller.container
    if (container) {
      this.scrollerScrollHandler = (_e) => {
        this.resetRenderArea()
      }
      Dom.Event.on(container, 'scroll', this.scrollerScrollHandler)
    }
  }

  protected startListening() {
    this.graph.on('translate', this.resetRenderArea, this)
    this.graph.on('scale', this.resetRenderArea, this)
    this.graph.on('resize', this.resetRenderArea, this)

    const scroller = this.graph.getPlugin<any>('scroller')
    if (scroller) {
      this.bindScrollerEvents(scroller)
    }
  }

  protected stopListening() {
    this.graph.off('translate', this.resetRenderArea, this)
    this.graph.off('scale', this.resetRenderArea, this)
    this.graph.off('resize', this.resetRenderArea, this)

    this.unbindScroller()
  }

  onScrollerReady(scroller: any) {
    if (this.scrollerRef === scroller) return

    this.unbindScroller()

    this.bindScrollerEvents(scroller)

    this.resetRenderArea()
  }

  unbindScroller() {
    if (this.scrollerRef) {
      if (typeof this.scrollerRef.off === 'function') {
        this.scrollerRef.off('pan:start', this.resetRenderArea, this)
        this.scrollerRef.off('panning', this.resetRenderArea, this)
        this.scrollerRef.off('pan:stop', this.resetRenderArea, this)
      }
      const container = this.scrollerRef.container
      if (container && this.scrollerScrollHandler) {
        Dom.Event.off(container, 'scroll', this.scrollerScrollHandler)
      }
      this.scrollerRef = undefined
      this.scrollerScrollHandler = undefined
    }
  }

  enableVirtualRender() {
    this.options.virtual = true
    this.resetRenderArea()
  }

  disableVirtualRender() {
    this.options.virtual = false
    this.graph.renderer.setRenderArea(undefined)
  }

  resetRenderArea() {
    if (this.options.virtual) {
      const renderArea = this.graph.getGraphArea()
      if (renderArea) {
        // 在开启虚拟渲染时，为可视区域增加固定缓冲边距
        const margin = 120
        const eff = renderArea.clone ? renderArea.clone() : renderArea
        eff.inflate(margin, margin)
        this.graph.renderer.setRenderArea(eff)
        return
      }
    }
  }

  @disposable()
  dispose() {
    this.stopListening()
  }
}
