import JQuery from 'jquery'
import { Dom, Platform } from '../util'
import { ModifierKey } from '../types'
import { Disposable, IDisablable } from '../common'
import { Graph } from './graph'

export class MouseWheel extends Disposable implements IDisablable {
  public readonly target: HTMLElement | Document
  public readonly container: HTMLElement
  protected frameId: number | null
  protected cumulatedFactor: number = 1
  protected currentScale: number | null
  protected startPos: { x: number; y: number }
  protected readonly handler: (
    e: JQueryMousewheel.JQueryMousewheelEventObject,
  ) => any

  protected get graph() {
    return this.options.graph
  }

  constructor(public readonly options: MouseWheel.Options) {
    super()

    const scroller = this.graph.scroller.widget
    this.container = scroller ? scroller.container : this.graph.container
    this.target = this.options.global ? document : this.container
    this.handler = this.onMouseWheel.bind(this)

    if (this.options.enabled) {
      this.enable(true)
    }
  }

  get disabled() {
    return this.options.enabled !== true
  }

  enable(force?: boolean) {
    if (this.disabled || force) {
      this.options.enabled = true
      this.graph.options.mousewheel.enabled = true
      if (Platform.SUPPORT_PASSIVE) {
        this.target.addEventListener('mousewheel', this.handler, {
          passive: false,
        })
      } else {
        JQuery(this.target).on('mousewheel', this.handler)
      }
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      this.graph.options.mousewheel.enabled = false

      if (Platform.SUPPORT_PASSIVE) {
        this.target.removeEventListener('mousewheel', this.handler)
      } else {
        JQuery(this.target).off('mousewheel')
      }
    }
  }

  protected onMouseWheel(evt: JQueryMousewheel.JQueryMousewheelEventObject) {
    const e = (evt.originalEvent || evt) as MouseWheelEvent
    if (ModifierKey.test(e as any, this.options.modifiers)) {
      evt.preventDefault()
      evt.stopPropagation()

      if (this.frameId) {
        Dom.cancelAnimationFrame(this.frameId)
        this.frameId = null
      }

      const factor = this.options.factor || 1.2

      if (this.currentScale == null) {
        this.startPos = { x: evt.clientX, y: evt.clientY }
        this.currentScale = this.graph.scroller.widget
          ? this.graph.scroller.widget.zoom()
          : this.graph.scale().sx
      }

      const delta = evt.deltaY

      if (delta > 0) {
        // zoomin
        // ------
        // Switches to 1% zoom steps below 15%
        if (this.currentScale * this.cumulatedFactor < 0.15) {
          this.cumulatedFactor = (this.currentScale + 0.01) / this.currentScale
        } else {
          // Uses to 5% zoom steps for better grid rendering in
          // webkit and to avoid rounding errors for zoom steps
          this.cumulatedFactor *= factor
        }
      } else {
        // zoomout
        // -------
        // Switches to 1% zoom steps below 15%
        if (this.currentScale * this.cumulatedFactor <= 0.15) {
          this.cumulatedFactor = (this.currentScale - 0.01) / this.currentScale
        } else {
          // Uses to 5% zoom steps for better grid rendering in
          // webkit and to avoid rounding errors for zoom steps
          this.cumulatedFactor /= factor
        }
      }

      this.cumulatedFactor =
        Math.round(this.currentScale * this.cumulatedFactor * 20) /
        20 /
        this.currentScale

      this.cumulatedFactor = Math.max(
        0.01,
        Math.min(this.currentScale * this.cumulatedFactor, 160) /
          this.currentScale,
      )

      this.frameId = Dom.requestAnimationFrame(() => {
        const scroller = this.graph.scroller.widget
        const currentScale = this.currentScale!
        const targetScale = this.graph.transform.clampScale(
          currentScale * this.cumulatedFactor,
        )

        if (targetScale !== currentScale) {
          if (scroller) {
            if (this.options.zoomAtMousePosition) {
              const origin = this.graph.coord.clientToLocalPoint(this.startPos)
              scroller.zoom(targetScale, {
                absolute: true,
                center: origin.clone(),
              })
            } else {
              scroller.zoom(targetScale, { absolute: true })
            }
          } else {
            this.graph.scale(targetScale, targetScale)
            if (this.options.zoomAtMousePosition) {
              const origin = this.graph.coord.clientToLocalPoint(this.startPos)
              this.graph.translate(
                origin.x * (1 - targetScale),
                origin.y * (1 - targetScale),
              )
            }
          }
        }

        this.frameId = null
        this.currentScale = null
        this.cumulatedFactor = 1
      })
    }
  }

  @Disposable.dispose()
  dispose() {
    this.disable()
  }
}

export namespace MouseWheel {
  export interface Options {
    graph: Graph
    enabled?: boolean
    global?: boolean
    factor?: number
    modifiers?: string | ModifierKey[] | null
    guard?: (this: Graph, e: MouseWheelEvent) => boolean
    zoomAtMousePosition?: boolean
  }
}
