import { Base } from './base'
import { SizeSensor } from '../util'

export class SizeManager extends Base {
  protected hasScroller() {
    return this.graph.scroller.widget != null
  }

  protected getContainer() {
    return this.hasScroller()
      ? this.graph.scroller.widget!.container!
      : this.graph.container
  }

  protected init() {
    const autoResize = this.options.autoResize
    if (autoResize) {
      const target =
        typeof autoResize === 'boolean'
          ? this.getContainer()
          : (autoResize as Element)

      SizeSensor.bind(target, () => {
        const container = this.getContainer()
        // container is border-box
        const width = container.offsetWidth
        const height = container.offsetHeight
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
    this.graph.transform.resize(width, height)
  }

  resizeScroller(width?: number, height?: number) {
    this.graph.scroller.resize(width, height)
  }

  resizePage(width?: number, height?: number) {
    const instance = this.graph.scroller.widget
    if (instance) {
      instance.updatePageSize(width, height)
    }
  }

  @Base.dispose()
  dispose() {
    SizeSensor.clear(this.getContainer())
  }
}
