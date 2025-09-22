import { disposable } from '../common'
import { Base } from './base'

export class SizeManager extends Base {
  private ro?: ResizeObserver

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
      return scroller.container.parentElement as HTMLElement | null
    }
    return this.graph.container.parentElement as HTMLElement | null
  }

  private getSensorTarget() {
    const autoResize = this.options.autoResize
    if (autoResize) {
      if (typeof autoResize === 'boolean') {
        return this.getContainer() || undefined
      }
      return autoResize as HTMLElement
    }
  }

  protected init() {
    const autoResize = this.options.autoResize
    if (autoResize) {
      const target = this.getSensorTarget()
      if (target) {
        if (typeof ResizeObserver === 'undefined') {
          return
        }
        this.ro = new ResizeObserver((entries) => {
          if (!entries || entries.length === 0) return
          const { width, height } = entries[0].contentRect
          this.resize(Math.round(width), Math.round(height))
        })
        this.ro.observe(target)
        const width = target.offsetWidth
        const height = target.offsetHeight
        this.resize(width, height)
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

  @disposable()
  dispose() {
    if (this.ro) {
      this.ro.disconnect()
      this.ro = undefined
    }
  }
}
