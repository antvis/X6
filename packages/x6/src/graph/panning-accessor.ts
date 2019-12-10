import * as util from '../util'
import { events } from './events'
import { BaseGraph } from './base-graph'

export class PanningAccessor extends BaseGraph {
  public panDx: number
  public panDy: number
  protected shiftPreview1: HTMLElement | null
  protected shiftPreview2: HTMLElement | null

  enablePanning() {
    this.panningHandler.enablePanning()
    return this
  }

  disablePanning() {
    this.panningHandler.disablePanning()
    return this
  }

  enablePinch() {
    this.panningHandler.enablePinch()
    return this
  }

  disablePinch() {
    this.panningHandler.disablePinch()
    return this
  }

  /**
   * Shifts the graph display by the given amount. This is used to preview
   * panning operations, use `view.setTranslate` to set a persistent
   * translation of the view.
   *
   * @param dx Amount to shift the graph along the x-axis.
   * @param dy Amount to shift the graph along the y-axis.
   */
  pan(x: number, y: number, relative: boolean = false) {
    const dx = relative ? this.panDx + x : x
    const dy = relative ? this.panDy + y : y

    if (this.useScrollbarsForPanning && util.hasScrollbars(this.container)) {
      const container = this.container
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      const maxScrollTop = container.scrollHeight - container.clientHeight
      const scrollLeft = util.clamp(dx, 0, maxScrollLeft)
      const scrollTop = util.clamp(dy, 0, maxScrollTop)
      container.scrollLeft = scrollLeft
      container.scrollTop = scrollTop
    } else {
      const stage = this.view.getStage()!
      if (this.dialect === 'svg') {
        // Puts everything inside the container in a DIV so that it
        // can be moved without changing the state of the container
        if (dx === 0 && dy === 0) {
          stage.removeAttribute('transform')

          if (this.shiftPreview1 != null && this.shiftPreview2 != null) {
            let child = this.shiftPreview1.firstChild
            while (child != null) {
              const next = child.nextSibling
              this.container.appendChild(child)
              child = next
            }

            util.removeElement(this.shiftPreview1)
            this.shiftPreview1 = null

            this.container.appendChild(stage.parentNode!)

            child = this.shiftPreview2.firstChild
            while (child != null) {
              const next = child.nextSibling
              this.container.appendChild(child)
              child = next
            }

            util.removeElement(this.shiftPreview2)
            this.shiftPreview2 = null
          }
        } else {
          stage.setAttribute('transform', `translate(${dx},${dy})`)

          if (this.shiftPreview1 == null) {
            // Needs two divs for stuff before and after the SVG element
            this.shiftPreview1 = document.createElement('div')
            this.shiftPreview1.style.position = 'absolute'
            this.shiftPreview1.style.overflow = 'visible'

            this.shiftPreview2 = document.createElement('div')
            this.shiftPreview2.style.position = 'absolute'
            this.shiftPreview2.style.overflow = 'visible'

            let current = this.shiftPreview1
            let child = this.container.firstChild as HTMLElement

            while (child != null) {
              const next = child.nextSibling as HTMLElement
              // SVG element is moved via transform attribute
              if (child !== stage.parentNode) {
                current.appendChild(child)
              } else {
                current = this.shiftPreview2
              }

              child = next
            }

            // Inserts elements only if not empty
            if (this.shiftPreview1.firstChild != null) {
              this.container.insertBefore(this.shiftPreview1, stage.parentNode)
            }

            if (this.shiftPreview2.firstChild != null) {
              this.container.appendChild(this.shiftPreview2)
            }
          }

          this.shiftPreview1.style.left = `${dx}px`
          this.shiftPreview1.style.top = `${dy}px`
          this.shiftPreview2!.style.left = util.toPx(dx)
          this.shiftPreview2!.style.top = util.toPx(dy)
        }
      } else {
        stage.style.left = util.toPx(dx)
        stage.style.top = util.toPx(dy)
      }

      this.panDx = dx
      this.panDy = dy
    }

    this.trigger(events.pan, { dx, dy })

    return this
  }

  panTo(x: number, y: number) {
    this.pan(x, y, false)
    return this
  }

  panBy(x: number, y: number) {
    this.pan(x, y, true)
    return this
  }
}
