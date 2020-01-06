import { Point, Rectangle } from '../../geometry'
import { Disposable } from '../../entity'
import { Cell } from '../../core/cell'
import { State } from '../../core/state'
import { Graph } from '../../graph'
import { Polyline } from '../../shape'

export class Guide extends Disposable {
  graph: Graph
  states: State[]

  /**
   * Specifies if horizontal guides are enabled.
   *
   * Default is `true`.
   */
  horizontal: boolean = true

  /**
   * Specifies if vertical guides are enabled.
   *
   * Default is `true`.
   */
  vertical: boolean = true

  /**
   * Specifies if rounded coordinates should be used.
   *
   * Default is `false`.
   */
  rounded: boolean = false

  protected options: Guide.Options
  protected guideX: Polyline | null = null
  protected guideY: Polyline | null = null

  constructor(graph: Graph, states: State[], options: Guide.Options) {
    super()
    this.graph = graph
    this.options = options
    this.setStates(states)
  }

  setStates(states: State[]) {
    this.states = states
  }

  protected getGuideTolerance() {
    return this.graph.getGridSize() / 2
  }

  protected createGuideShape(horizontal: boolean) {
    return new Polyline()
  }

  protected initGuideShape(horizontal: boolean) {
    const guide = horizontal ? this.guideX : this.guideY
    if (guide != null) {
      guide.pointerEvents = false
      guide.init(this.graph.view.getOverlayPane())
    }
  }

  protected redrawGuideShape(state: State, horizontal: boolean) {
    const guide = horizontal ? this.guideY : this.guideX
    if (guide != null) {
      const style = this.options.getStrockStyle({
        horizontal,
        cell: state.cell,
      })

      guide.strokeColor = style.stroke
      guide.strokeWidth = style.strokeWidth
      guide.dashed = style.dashed
      guide.elem!.style.visibility = ''

      Polyline.applyClassName(
        guide,
        this.graph.prefixCls,
        `guide ${horizontal ? 'horizontal' : 'vertical'}`,
        style.className,
      )

      guide.redraw()
    }
  }

  move(bounds: Rectangle, delta: Point, gridEnabled: boolean) {
    if (
      this.states != null &&
      (this.horizontal || this.vertical) &&
      bounds != null &&
      delta != null
    ) {
      const t = this.graph.view.translate
      const s = this.graph.view.scale
      const tol = this.getGuideTolerance()
      let tolX = tol
      let tolY = tol

      let dx = delta.x
      let dy = delta.y

      let activeX = false
      let stateX: State | null = null
      let valueX = null

      let activeY = false
      let stateY: State | null = null
      let valueY = null

      const b = bounds.clone()
      b.x += delta.x
      b.y += delta.y

      const left = b.x
      const right = b.x + b.width
      const center = b.getCenterX()
      const top = b.y
      const bottom = b.y + b.height
      const middle = b.getCenterY()

      // Snaps the left, center and right to the given x-coordinate
      const snapX = (x: number, state: State) => {
        const xx = x + this.graph.panX
        let active = false

        if (Math.abs(xx - center) < tolX) {
          dx = xx - bounds.getCenterX()
          tolX = Math.abs(xx - center)
          active = true
        } else if (Math.abs(xx - left) < tolX) {
          dx = xx - bounds.x
          tolX = Math.abs(xx - left)
          active = true
        } else if (Math.abs(xx - right) < tolX) {
          dx = xx - bounds.x - bounds.width
          tolX = Math.abs(xx - right)
          active = true
        }

        if (active) {
          stateX = state
          valueX = Math.round(xx - this.graph.panX)

          if (this.guideX == null) {
            this.guideX = this.createGuideShape(true)
            this.initGuideShape(true)
          }
        }

        activeX = activeX || active
      }

      // Snaps the top, middle or bottom to the given y-coordinate
      const snapY = (y: number, state: State) => {
        const yy = y + this.graph.panY
        let active = false

        if (Math.abs(yy - middle) < tolY) {
          dy = yy - bounds.getCenterY()
          tolY = Math.abs(yy - middle)
          active = true
        } else if (Math.abs(yy - top) < tolY) {
          dy = yy - bounds.y
          tolY = Math.abs(yy - top)
          active = true
        } else if (Math.abs(yy - bottom) < tolY) {
          dy = yy - bounds.y - bounds.height
          tolY = Math.abs(yy - bottom)
          active = true
        }

        if (active) {
          stateY = state
          valueY = Math.round(yy - this.graph.panY)

          if (this.guideY == null) {
            this.guideY = this.createGuideShape(false)
            this.initGuideShape(false)
          }
        }

        activeY = activeY || active
      }

      for (let i = 0; i < this.states.length; i += 1) {
        const state = this.states[i]
        if (state != null) {
          // Align x
          if (this.horizontal) {
            snapX(state.bounds.getCenterX(), state)
            snapX(state.bounds.x, state)
            snapX(state.bounds.x + state.bounds.width, state)
          }

          // Align y
          if (this.vertical) {
            snapY(state.bounds.getCenterY(), state)
            snapY(state.bounds.y, state)
            snapY(state.bounds.y + state.bounds.height, state)
          }
        }
      }

      // Moves cells that are off-grid back to the grid on move
      if (gridEnabled) {
        if (!activeX) {
          const tx = bounds.x - (this.graph.snap(bounds.x / s - t.x) + t.x) * s

          dx = this.graph.snap(dx / s) * s - tx
        }

        if (!activeY) {
          const ty = bounds.y - (this.graph.snap(bounds.y / s - t.y) + t.y) * s

          dy = this.graph.snap(dy / s) * s - ty
        }
      }

      // Redraws the guides
      const c = this.graph.container

      if (this.guideX && this.guideX.elem) {
        if (!activeX) {
          this.guideX.elem.style.visibility = 'hidden'
        } else {
          if (stateX != null && valueX != null) {
            const state = stateX as State
            const minY = Math.min(
              bounds.y + dy - this.graph.panY,
              state.bounds.y,
            )

            const maxY = Math.max(
              bounds.y + bounds.height + dy - this.graph.panY,
              state.bounds.y + state.bounds.height,
            )

            if (minY != null && maxY != null) {
              this.guideX.points = [
                new Point(valueX, minY),
                new Point(valueX, maxY),
              ]
            } else {
              this.guideX.points = [
                new Point(valueX, -this.graph.panY),
                new Point(valueX, c.scrollHeight - 3 - this.graph.panY),
              ]
            }

            this.redrawGuideShape(stateX!, false)
          }
        }
      }

      if (this.guideY && this.guideY.elem) {
        if (!activeY) {
          this.guideY.elem.style.visibility = 'hidden'
        } else {
          if (stateY != null && valueY != null) {
            const state = stateY as State
            const minX = Math.min(
              bounds.x + dx - this.graph.panX,
              state.bounds.x,
            )

            const maxX = Math.max(
              bounds.x + bounds.width + dx - this.graph.panX,
              state.bounds.x + state.bounds.width,
            )

            if (minX != null && maxX != null) {
              this.guideY.points = [
                new Point(minX, valueY),
                new Point(maxX, valueY),
              ]
            } else {
              this.guideY.points = [
                new Point(-this.graph.panX, valueY),
                new Point(c.scrollWidth - 3 - this.graph.panX, valueY),
              ]
            }

            this.redrawGuideShape(stateY, true)
          }
        }
      }

      return this.getDelta(bounds, stateX, dx, stateY, dy)
    }

    return delta
  }

  protected getDelta(
    bounds: Rectangle,
    stateX: State | null,
    dx: number,
    stateY: State | null,
    dy: number,
  ) {
    if (this.rounded || (stateX != null && stateX.cell == null)) {
      // tslint:disable-next-line
      dx = Math.floor(bounds.x + dx) - bounds.x
    }

    if (this.rounded || (stateY != null && stateY.cell == null)) {
      // tslint:disable-next-line
      dy = Math.floor(bounds.y + dy) - bounds.y
    }

    return new Point(dx, dy)
  }

  hide() {
    this.setVisible(false)
  }

  protected setVisible(visible: boolean) {
    if (this.guideX && this.guideX.elem) {
      this.guideX.elem.style.visibility = visible ? '' : 'hidden'
    }

    if (this.guideY && this.guideY.elem) {
      this.guideY.elem.style.visibility = visible ? '' : 'hidden'
    }
  }

  @Disposable.dispose()
  dispose() {
    if (this.guideX) {
      this.guideX.dispose()
      this.guideX = null
    }

    if (this.guideY) {
      this.guideY.dispose()
      this.guideY = null
    }
  }
}

export namespace Guide {
  export interface Options {
    getStrockStyle: (args: {
      cell: Cell
      horizontal: boolean
    }) => {
      stroke: string
      strokeWidth: number
      dashed: boolean
      className?: string
    }
  }
}
