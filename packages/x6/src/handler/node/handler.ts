import { Point } from '../../geometry'
import { DomEvent } from '../../dom'
import { Cell } from '../../core/cell'
import { State } from '../../core/state'
import { Graph } from '../../graph'
import { Handle } from '../handle'
import { Knobs } from './knobs'
import { Preview } from './preview'
import { MouseHandler } from '../mouse-handler'
import { MouseEventEx } from '../mouse-event'

export class NodeHandler extends MouseHandler {
  state: State
  knobs: Knobs
  preview: Preview
  index: number | null = null
  private escapeHandler: (() => void) | null

  get startX() {
    return this.preview.startX
  }

  get startY() {
    return this.preview.startY
  }

  constructor(graph: Graph, state: State) {
    super(graph)
    this.state = state
    this.init()
  }

  protected init() {
    this.knobs = new Knobs(this)
    this.preview = new Preview(this)
    this.redraw()
    this.escapeHandler = () => {
      if (this.preview.isLivePreview() && this.index != null) {
        this.preview.redrawLivePreview()
      }

      this.reset()
    }

    this.state.view.graph.on('escape', this.escapeHandler)
  }

  isConstrained(e: MouseEventEx) {
    return (
      DomEvent.isShiftDown(e.getEvent()) || this.state.style.aspect === true
    )
  }

  round(n: number) {
    return Math.round(n)
  }

  mouseDown(e: MouseEventEx, sneder: any) {
    const ret = this.knobs.getHandle(e)
    if (ret != null) {
      this.start(e.getGraphX(), e.getGraphY(), ret.index)
      this.addMask(ret.cursor)
      e.consume()
    }
  }

  start(x: number, y: number, index: number) {
    if (this.preview.start(x, y)) {
      this.index = index
    }
  }

  mouseMove(e: MouseEventEx, sneder: any) {
    if (!e.isConsumed() && this.index != null) {
      if (this.preview.canMove(e)) {
        this.preview.ensurePreview()
        if (Handle.isCustomHandle(this.index)) {
          this.knobs.processCustomHandle(e, this.index)
        } else if (Handle.isLabelHandle(this.index)) {
          this.knobs.moveLabel(e)
        } else if (Handle.isRotationHandle(this.index)) {
          this.preview.rotate(e)
        } else {
          this.preview.resize(e)
        }
      }
      e.consume()
    } else if (!this.isMouseDown() && this.knobs.getHandleForEvent(e) != null) {
      // Disable the connect highlight when over handle
      e.consume(false)
    }
  }

  mouseUp(e: MouseEventEx, sneder: any) {
    if (this.index != null && this.state != null) {
      const index = this.index
      this.index = null

      this.graph.batchUpdate(() => {
        if (Handle.isCustomHandle(index)) {
          this.knobs.executeCustomHandle(index)
        } else if (Handle.isRotationHandle(index)) {
          if (this.preview.hasRotated()) {
            const delta = this.preview.getRotation()
            if (delta !== 0) {
              this.rotateNode(this.state.cell, delta)
            }
          } else {
            this.rotationHandleClick()
          }
        } else if (Handle.isLabelHandle(index)) {
          this.moveLabel()
        } else {
          this.resizeNode(e)
        }
      })

      e.consume()

      this.removeMask()
      this.reset()
    }
  }

  protected isRecursiveResize(state: State, e: MouseEventEx) {
    return this.graph.isRecursiveResize()
  }

  protected rotationHandleClick() {}

  protected rotateNode(cell: Cell, angle: number, parent?: Cell) {
    if (angle !== 0) {
      const model = this.graph.getModel()

      if (model.isNode(cell) || model.isEdge(cell)) {
        if (!model.isEdge(cell)) {
          const style = this.graph.getStyle(cell)
          if (style != null) {
            const total = (style.rotation || 0) + angle
            this.graph.updateCellsStyle('rotation', total, [cell])
          }
        }

        let geo = this.graph.getCellGeometry(cell)
        if (geo != null && parent != null) {
          const pgeo = this.graph.getCellGeometry(parent)
          if (pgeo != null && !model.isEdge(parent)) {
            geo = geo.clone()
            geo.rotate(
              angle,
              new Point(pgeo.bounds.width / 2, pgeo.bounds.height / 2),
            )
            model.setGeometry(cell, geo)
          }

          if ((model.isNode(cell) && !geo.relative) || model.isEdge(cell)) {
            cell.eachChild(child => this.rotateNode(child, angle, cell))
          }
        }
      }
    }
  }

  protected moveLabel() {
    const cell = this.state.cell
    let geo = this.graph.model.getGeometry(cell)
    if (geo) {
      const scale = this.graph.view.scale
      const origin = this.preview.getOrigin()
      const center = this.knobs.getLabelCenter()
      const dx = Math.round((center.x - origin.x) / scale)
      const dy = Math.round((center.y - origin.y) / scale)

      geo = geo.clone()
      if (geo.offset == null) {
        geo.offset = new Point(dx, dy)
      } else {
        geo.offset.x += dx
        geo.offset.y += dy
      }

      this.graph.model.setGeometry(cell, geo)
    }
  }

  protected resizeNode(e: MouseEventEx) {
    const cell = this.state.cell
    const geo = this.graph.model.getGeometry(cell)
    if (geo != null) {
      const unscaledBounds = this.preview.getUnscaledBounds()
      if (unscaledBounds) {
        const scale = this.graph.view.scale
        const [childOffsetX, childOffsetY] = this.preview.getChildOffset()

        if (childOffsetX !== 0 || childOffsetY !== 0) {
          this.moveChildren(
            cell,
            Math.round(childOffsetX / scale),
            Math.round(childOffsetY / scale),
          )
        }

        const recurse = this.isRecursiveResize(this.state, e)
        this.graph.resizeCell(cell, unscaledBounds, recurse)
      }
    }
  }

  protected moveChildren(cell: Cell, dx: number, dy: number) {
    cell.eachChild(child => {
      let geo = this.graph.getCellGeometry(child)
      if (geo != null) {
        geo = geo.clone()
        geo.translate(dx, dy)
        this.graph.model.setGeometry(child, geo)
      }
    })
  }

  reset() {
    this.knobs.reset()
    this.preview.resetShape()
    this.index = null
    this.redrawKnobs()
    this.preview.reset()
  }

  redraw() {
    this.preview.updateBounds()
    this.redrawKnobs()
    this.preview.drawPreview()
  }

  redrawKnobs() {
    this.knobs.redraw()
    this.preview.refresh()
  }

  @MouseHandler.dispose()
  dispose() {
    if (this.escapeHandler != null) {
      this.state.view.graph.off('escape', this.escapeHandler)
      this.escapeHandler = null
    }

    this.preview.dispose()
    this.knobs.dispose()
  }
}
