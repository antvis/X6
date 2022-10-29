import { SizeSensor } from '@antv/x6-common'
import { Base } from './base'

export class SizeManager extends Base {
  private getScroller() {
    const scroller = this.graph.getPlugin<any>('scroller')
    if (scroller && scroller.options.enabled) {
      return scroller
    }
    return null
  }

  private getContainer() {
    const scroller = this.getScroller()
    if (scroller) {
      return scroller.container.parentElement
    }
    return this.graph.container.parentElement
  }

  private getSensorTarget() {
    const autoResize = this.options.autoResize
    if (autoResize) {
      if (typeof autoResize === 'boolean') {
        return this.getContainer()
      }
      return autoResize as HTMLElement
    }
  }

  protected init() {
    const autoResize = this.options.autoResize
    if (autoResize) {
      const target = this.getSensorTarget()
      if (target) {
        SizeSensor.bind(target, () => {
          const width = target.offsetWidth
          const height = target.offsetHeight
          this.resize(width, height)
        })
      }
    }
  }

  resize(width?: number, height?: number) {
    const scroller = this.getScroller()
    if (scroller) {
      scroller.resize(width, height)
    } else {
      this.graph.transform.resize(width, height)
    }
  }

  @Base.dispose()
  dispose() {
    SizeSensor.clear(this.graph.container)
  }
}
