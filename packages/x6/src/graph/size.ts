import { Base } from './base'
import { SizeSensor } from '../util'

export class SizeManager extends Base {
  protected isAutoResize() {
    return this.options.autoResize === true
  }

  protected hasScroller() {
    return this.graph.scroller.widget != null
  }

  protected getContainer() {
    return this.hasScroller()
      ? this.graph.scroller.widget?.container!
      : this.graph.container
  }

  protected init() {
    const container = this.getContainer()
    if (this.isAutoResize()) {
      SizeSensor.bind(container, (elem) => {
        const width = elem.clientWidth
        const height = elem.clientHeight
        this.resize(width, height)
      })
    }
  }

  resize(width?: number, height?: number) {
    if (this.hasScroller()) {
      this.resizeScroller(width, height)
    } else {
      this.resizeGraph(width, height)
    }
  }

  resizeGraph(width?: number, height?: number) {
    // update scroller's page size as needed
    const scroller = this.graph.scroller.widget
    if (scroller) {
      scroller.updatePageSize(width, height)
    }
    this.graph.transform.resize(width, height)
    return this
  }

  resizeScroller(width?: number, height?: number) {
    this.graph.scroller.resize(width, height)
  }

  resizePage(width?: number, height?: number) {
    const instance = this.graph.scroller.widget
    if (instance) {
      instance.updatePageSize(width, height, true)
    }
  }

  @Base.dispose()
  dispose() {
    SizeSensor.clear(this.getContainer())
  }
}
