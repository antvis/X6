import { constants, IDisposable } from '../common'
import { Rectangle, Point } from '../struct'
import { Graph, CellState } from '../core'
import { Polyline } from '../shape'

export class Guide implements IDisposable {
  graph: Graph
  states: CellState[]

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
   * Holds the `Shape` for the horizontal guide.
   */
  guideX: Polyline | null = null

  /**
   * Holds the `Shape` for the vertical guide.
   */
  guideY: Polyline | null = null

  /**
   * Specifies if rounded coordinates should be used.
   *
   * Default is `false`.
   */
  rounded: boolean = false

  constructor(graph: Graph, states: CellState[]) {
    this.graph = graph
    this.setStates(states)
  }

  setStates(states: CellState[]) {
    this.states = states
  }

  isEnabledForEvent(e: MouseEvent) {
    return true
  }

  protected getGuideTolerance() {
    return this.graph.gridSize / 2
  }

  protected createGuideShape(horizontal?: boolean) {
    const guide = new Polyline(
      [],
      constants.GUIDE_COLOR,
      constants.GUIDE_STROKEWIDTH,
    )
    guide.dashed = true

    return guide
  }

  protected getGuideColor(state: CellState, horizontal: boolean) {
    return constants.GUIDE_COLOR
  }

  move(
    bounds: Rectangle,
    delta: Point,
    gridEnabled: boolean,
  ) {
    if (
      this.states != null &&
      (this.horizontal || this.vertical) &&
      bounds != null &&
      delta != null
    ) {
      const trans = this.graph.view.translate
      const scale = this.graph.view.scale

      let dx = delta.x
      let dy = delta.y

      let activeX = false
      let stateX: CellState | null = null
      let valueX = null

      let activeY = false
      let stateY: CellState | null = null
      let valueY = null

      const tol = this.getGuideTolerance()
      let tolX = tol
      let tolY = tol

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
      const snapX = (x: number, state: CellState) => {
        const xx = x + this.graph.panDx
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
          valueX = Math.round(xx - this.graph.panDx)

          if (this.guideX == null) {
            this.guideX = this.createGuideShape(true)
            this.guideX.dialect = 'svg'
            this.guideX.pointerEvents = false
            this.guideX.init(this.graph.view.getOverlayPane()!)
          }
        }

        activeX = activeX || active
      }

      // Snaps the top, middle or bottom to the given y-coordinate
      const snapY = (y: number, state: CellState) => {
        const yy = y + this.graph.panDy
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
          valueY = Math.round(yy - this.graph.panDy)

          if (this.guideY == null) {
            this.guideY = this.createGuideShape(false)
            this.guideY.dialect = 'svg'
            this.guideY.pointerEvents = false
            this.guideY.init(this.graph.view.getOverlayPane()!)
          }
        }

        activeY = activeY || active
      }

      for (let i = 0; i < this.states.length; i += 1) {
        const state = this.states[i]
        if (state != null) {
          // Align x
          if (this.horizontal) {
            snapX(state.bounds.x, state)
            snapX(state.bounds.getCenterX(), state)
            snapX(state.bounds.x + state.bounds.width, state)
          }

          // Align y
          if (this.vertical) {
            snapY(state.bounds.y, state)
            snapY(state.bounds.getCenterY(), state)
            snapY(state.bounds.y + state.bounds.height, state)
          }
        }
      }

      // Moves cells that are off-grid back to the grid on move
      if (gridEnabled) {
        if (!activeX) {
          const tx = bounds.x -
            (this.graph.snap(bounds.x / scale - trans.x) + trans.x) * scale

          dx = this.graph.snap(dx / scale) * scale - tx
        }

        if (!activeY) {
          const ty = bounds.y -
            (this.graph.snap(bounds.y / scale - trans.y) + trans.y) * scale

          dy = this.graph.snap(dy / scale) * scale - ty
        }
      }

      // Redraws the guides
      const c = this.graph.container

      if (this.guideX && this.guideX.elem) {
        if (!activeX) {
          this.guideX.elem.style.visibility = 'hidden'
        } else {

          if (stateX != null && valueX != null) {
            const state = stateX as CellState
            const minY = Math.min(
              bounds.y + dy - this.graph.panDy,
              state.bounds.y,
            )

            const maxY = Math.max(
              bounds.y + bounds.height + dy - this.graph.panDy,
              state.bounds.y + state.bounds.height,
            )

            if (minY != null && maxY != null) {
              this.guideX.points = [
                new Point(valueX, minY),
                new Point(valueX, maxY),
              ]
            } else {
              this.guideX.points = [
                new Point(valueX, -this.graph.panDy),
                new Point(valueX, c.scrollHeight - 3 - this.graph.panDy),
              ]
            }

            this.guideX.stroke = this.getGuideColor(stateX!, true)
            this.guideX.elem.style.visibility = 'visible'
            this.guideX.redraw()
          }
        }
      }

      if (this.guideY && this.guideY.elem) {
        if (!activeY) {
          this.guideY.elem.style.visibility = 'hidden'
        } else {
          if (stateY != null && valueY != null) {
            const state = stateY as CellState
            const minX = Math.min(
              bounds.x + dx - this.graph.panDx,
              state.bounds.x,
            )

            const maxX = Math.max(
              bounds.x + bounds.width + dx - this.graph.panDx,
              state.bounds.x + state.bounds.width,
            )

            if (minX != null && maxX != null) {
              this.guideY.points = [
                new Point(minX, valueY),
                new Point(maxX, valueY),
              ]
            } else {
              this.guideY.points = [
                new Point(-this.graph.panDx, valueY),
                new Point(c.scrollWidth - 3 - this.graph.panDx, valueY),
              ]
            }

            this.guideY.stroke = this.getGuideColor(stateY, false)
            this.guideY.elem.style.visibility = 'visible'
            this.guideY.redraw()
          }
        }
      }

      return this.getDelta(bounds, stateX, dx, stateY, dy)
    }

    return delta
  }

  protected getDelta(
    bounds: Rectangle,
    stateX: CellState | null,
    dx: number,
    stateY: CellState | null,
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
      this.guideX.elem.style.visibility = visible ? 'visible' : 'hidden'
    }

    if (this.guideY && this.guideY.elem) {
      this.guideY.elem.style.visibility = visible ? 'visible' : 'hidden'
    }
  }

  protected disposed = false

  get isDisposed() {
    return this.disposed
  }

  dispose() {
    if (this.disposed) {
      return
    }

    if (this.guideX) {
      this.guideX.dispose()
      this.guideX = null
    }

    if (this.guideY) {
      this.guideY.dispose()
      this.guideY = null
    }

    this.disposed = true
  }
}
