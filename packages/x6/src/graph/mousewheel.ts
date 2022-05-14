import { Graph } from './graph'
import { ModifierKey } from '../types'
import { Dom, NumberExt } from '../util'
import { Disposable, IDisablable } from '../common'

export class MouseWheel extends Disposable implements IDisablable {
  public readonly target: HTMLElement | Document
  public readonly container: HTMLElement

  protected cumulatedFactor = 1
  protected currentScale: number | null
  protected startPos: { x: number; y: number }

  private mousewheelHandle: Dom.MouseWheelHandle

  protected get graph() {
    return this.options.graph
  }

  constructor(public readonly options: MouseWheel.Options) {
    super()

    const scroller = this.graph.scroller.widget
    this.container = scroller ? scroller.container : this.graph.container
    this.target = this.options.global ? document : this.container
    this.mousewheelHandle = new Dom.MouseWheelHandle(
      this.target,
      this.onMouseWheel.bind(this),
      this.allowMouseWheel.bind(this),
    )
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
      this.mousewheelHandle.enable()
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      this.graph.options.mousewheel.enabled = false
      this.mousewheelHandle.disable()
    }
  }

  protected allowMouseWheel(evt: JQueryMousewheel.JQueryMousewheelEventObject) {
    const e = (evt.originalEvent || evt) as WheelEvent
    const guard = this.options.guard

    return (
      (guard == null || guard.call(this.graph, e)) &&
      ModifierKey.isMatch(e, this.options.modifiers)
    )
  }

  protected onMouseWheel(evt: JQueryMousewheel.JQueryMousewheelEventObject) {
    const e = (evt.originalEvent || evt) as WheelEvent
    const guard = this.options.guard

    if (
      (guard == null || guard.call(this.graph, e)) &&
      ModifierKey.isMatch(e, this.options.modifiers)
    ) {
      const factor = this.options.factor || 1.2

      if (this.currentScale == null) {
        this.startPos = { x: evt.clientX, y: evt.clientY }
        this.currentScale = this.graph.scroller.widget
          ? this.graph.scroller.widget.zoom()
          : this.graph.transform.getScale().sx
      }

      const delta = evt.deltaY
      if (delta < 0) {
        // zoomin
        // ------
        // Switches to 1% zoom steps below 15%
        if (this.currentScale < 0.15) {
          this.cumulatedFactor = (this.currentScale + 0.01) / this.currentScale
        } else {
          // Uses to 5% zoom steps for better grid rendering in
          // webkit and to avoid rounding errors for zoom steps
          this.cumulatedFactor =
            Math.round(this.currentScale * factor * 20) / 20 / this.currentScale
        }
      } else {
        // zoomout
        // -------
        // Switches to 1% zoom steps below 15%
        if (this.currentScale <= 0.15) {
          this.cumulatedFactor = (this.currentScale - 0.01) / this.currentScale
        } else {
          // Uses to 5% zoom steps for better grid rendering in
          // webkit and to avoid rounding errors for zoom steps
          this.cumulatedFactor =
            Math.round(this.currentScale * (1 / factor) * 20) /
            20 /
            this.currentScale
        }
      }

      this.cumulatedFactor = Math.max(
        0.01,
        Math.min(this.currentScale * this.cumulatedFactor, 160) /
          this.currentScale,
      )

      const scroller = this.graph.scroller.widget
      const currentScale = this.currentScale!
      let targetScale = this.graph.transform.clampScale(
        currentScale * this.cumulatedFactor,
      )
      const minScale = this.options.minScale || Number.MIN_SAFE_INTEGER
      const maxScale = this.options.maxScale || Number.MAX_SAFE_INTEGER
      targetScale = NumberExt.clamp(targetScale, minScale, maxScale)

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
          if (this.options.zoomAtMousePosition) {
            const origin = this.graph.coord.clientToGraphPoint(this.startPos)
            this.graph.transform.zoom(targetScale, {
              absolute: true,
              center: origin.clone(),
              ui: true,
            })
          } else {
            this.graph.transform.zoom(targetScale, { absolute: true, ui: true })
          }
        }
      }
      this.currentScale = null
      this.cumulatedFactor = 1
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
    minScale?: number
    maxScale?: number
    modifiers?: string | ModifierKey[] | null
    guard?: (this: Graph, e: WheelEvent) => boolean
    zoomAtMousePosition?: boolean
  }
}
