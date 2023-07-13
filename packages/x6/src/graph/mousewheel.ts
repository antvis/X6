import { ModifierKey, Dom, NumberExt, Disposable } from '@antv/x6-common'
import { Base } from './base'

export class MouseWheel extends Base {
  public target: HTMLElement | Document
  public container: HTMLElement

  protected cumulatedFactor = 1
  protected currentScale: number | null
  protected startPos: { x: number; y: number }

  private mousewheelHandle: Dom.MouseWheelHandle

  protected get widgetOptions() {
    return this.options.mousewheel
  }

  protected init() {
    this.container = this.graph.container
    this.target = this.widgetOptions.global ? document : this.container
    this.mousewheelHandle = new Dom.MouseWheelHandle(
      this.target,
      this.onMouseWheel.bind(this),
      this.allowMouseWheel.bind(this),
    )
    if (this.widgetOptions.enabled) {
      this.enable(true)
    }
  }

  get disabled() {
    return this.widgetOptions.enabled !== true
  }

  enable(force?: boolean) {
    if (this.disabled || force) {
      this.widgetOptions.enabled = true
      this.mousewheelHandle.enable()
    }
  }

  disable() {
    if (!this.disabled) {
      this.widgetOptions.enabled = false
      this.mousewheelHandle.disable()
    }
  }

  protected allowMouseWheel(e: WheelEvent) {
    const guard = this.widgetOptions.guard

    return (
      (guard == null || guard(e)) &&
      ModifierKey.isMatch(e, this.widgetOptions.modifiers)
    )
  }

  protected onMouseWheel(e: WheelEvent) {
    const guard = this.widgetOptions.guard

    if (
      (guard == null || guard(e)) &&
      ModifierKey.isMatch(e, this.widgetOptions.modifiers)
    ) {
      const factor = this.widgetOptions.factor || 1.2

      if (this.currentScale == null) {
        this.startPos = { x: e.clientX, y: e.clientY }
        this.currentScale = this.graph.transform.getScale().sx
      }

      const delta = e.deltaY
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
          if (this.cumulatedFactor === 1) {
            this.cumulatedFactor = 1.05
          }
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
          if (this.cumulatedFactor === 1) {
            this.cumulatedFactor = 0.95
          }
        }
      }

      this.cumulatedFactor = Math.max(
        0.01,
        Math.min(this.currentScale * this.cumulatedFactor, 160) /
          this.currentScale,
      )

      const currentScale = this.currentScale!
      let targetScale = this.graph.transform.clampScale(
        currentScale * this.cumulatedFactor,
      )
      const minScale = this.widgetOptions.minScale || Number.MIN_SAFE_INTEGER
      const maxScale = this.widgetOptions.maxScale || Number.MAX_SAFE_INTEGER
      targetScale = NumberExt.clamp(targetScale, minScale, maxScale)

      if (targetScale !== currentScale) {
        if (this.widgetOptions.zoomAtMousePosition) {
          const hasScroller = !!this.graph.getPlugin<any>('scroller')
          const origin = hasScroller
            ? this.graph.clientToLocal(this.startPos)
            : this.graph.clientToGraph(this.startPos)
          this.graph.zoom(targetScale, {
            absolute: true,
            center: origin.clone(),
          })
        } else {
          this.graph.zoom(targetScale, { absolute: true })
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
    enabled?: boolean
    global?: boolean
    factor?: number
    minScale?: number
    maxScale?: number
    modifiers?: string | ModifierKey[] | null
    guard?: (e: WheelEvent) => boolean
    zoomAtMousePosition?: boolean
  }
}
