import { SizeSensor } from '@antv/x6-common'
import { Base } from './base'

export class SizeManager extends Base {
  private getSensorTarget() {
    const autoResize = this.options.autoResize
    if (autoResize) {
      if (typeof autoResize === 'boolean') {
        return this.graph.container.parentElement
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
    this.graph.transform.resize(width, height)
  }

  @Base.dispose()
  dispose() {
    SizeSensor.clear(this.graph.container)
  }
}
