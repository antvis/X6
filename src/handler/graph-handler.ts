import * as util from '../util'
import { Graph, Cell, Model } from '../core'
import { Rectangle, Point } from '../struct'
import { RectangleShape } from '../shape'
import { Guide } from './guide'
import { CellHighlight } from './cell-highlight'
import { MouseHandler } from './handler-mouse'
import { MouseEventEx, DomEvent, Disposable } from '../common'
import {
  createGuide,
  isGuideEnabled,
  applyMovingPreviewStyle,
  MovingPreviewOptions,
  applyDropTargetHighlightStyle,
  applyConnectionHighlightStyle,
} from '../option'

export class GraphHandler extends MouseHandler {
  /**
   * Specifies the minimum number of pixels for the width and height of a
   * selection bounds.
   *
   * Default is `6`.
   */
  minimumSize: number = 6

  /**
   * Specifies if draw a html preview. If this is used then drop target
   * detection relies entirely on `graph.getCellAt` because the HTML
   * preview does not "let events through".
   *
   * Default is `false`.
   */
  htmlPreview: boolean = false

  /**
   * Specifies if the grid should be scaled.
   *
   * Default is `false`.
   */
  scaleGrid: boolean = false

  guide: Guide | null = null
  protected onPan: (() => void) | null
  protected onEscape: (() => void) | null
  protected onRefresh: (() => void) | null

  protected highlight: CellHighlight | null
  protected cell: Cell | null
  protected cells: Cell[]
  protected target: Cell | null
  protected origin: Point | null
  protected bounds: Rectangle | null
  protected previewBounds: Rectangle | null
  protected previewShape: RectangleShape | null
  protected delayedSelection: boolean
  protected shouldConsumeMouseUp: boolean

  protected dx: number | null
  protected dy: number | null

  constructor(graph: Graph) {
    super(graph)
    this.config()
    this.graph.addMouseListener(this)

    // Repaints the handler after autoscroll
    this.onPan = () => {
      this.updatePreview()
      this.updateHint()
    }

    this.graph.on(Graph.events.translate, this.onPan)

    this.onEscape = () => this.reset()
    this.graph.on(Graph.events.escape, this.onEscape)

    this.onRefresh = () => {
      if (this.origin != null) {
        try {
          this.bounds = this.graph.view.getBounds(this.cells)
          this.previewBounds = this.getPreviewBounds(this.cells)
          this.updatePreview()
        } catch (e) {
          this.reset()
        }
      }
    }

    this.graph.model.on(Model.events.change, this.onRefresh)
  }

  config() {
    const options = this.graph.options.movingPreview as MovingPreviewOptions
    this.htmlPreview = options.html
    this.minimumSize = options.minimumSize
  }

  protected updateHint() { }

  protected removeHint() { }

  protected roundLength(len: number) {
    return Math.round(len * 2) / 2
  }

  protected isDelayedSelection(cell: Cell | null, e: MouseEventEx) {
    return this.graph.isCellSelected(cell)
  }

  mouseDown(e: MouseEventEx) {
    if (
      this.isValid(e) &&
      this.isOnCell(e) &&
      !this.isMultiTouchEvent(e)
    ) {
      const cell = this.getCell(e)
      this.delayedSelection = this.isDelayedSelection(cell, e)
      this.cell = null

      // Select cell which was not selected immediately
      if (!this.delayedSelection && this.graph.isCellsSelectable()) {
        // Trigger selection change, then selectionHandler will refresh,
        // result to create cell resize/rotate handle knots.
        this.graph.selectionManager.selectCellForEvent(cell, e.getEvent())
      }

      // start move cell(s)
      if (cell && this.graph.isCellsMovable()) {
        const model = this.graph.model
        const geo = cell.getGeometry()

        if (
          this.graph.isCellMovable(cell) &&
          (
            this.graph.isDanglingEdgesEnabled()
            ||
            (
              !cell.isEdge() ||
              this.graph.getSelecedCellCount() > 1 ||
              (geo && geo.points && geo.points.length > 0) ||
              model.getTerminal(cell, true) == null ||
              model.getTerminal(cell, false) == null
            )
            ||
            (
              this.graph.isCloneEvent(e.getEvent()) &&
              this.graph.isCellsCloneable()
            )
          )
        ) {

          this.start(cell, e)

        } else if (this.delayedSelection) {

          this.cell = cell
        }

        this.shouldConsumeMouseUp = true
        this.consume(e, DomEvent.MOUSE_DOWN)
      }
    }
  }

  protected start(cell: Cell, e: MouseEventEx) {
    this.cell = cell
    this.cells = this.getCells(cell, e.getEvent())
    this.origin = util.clientToGraph(this.graph.container, e)
    this.bounds = this.graph.view.getBounds(this.cells)
    this.previewBounds = this.getPreviewBounds(this.cells)
  }

  protected getCells(cell: Cell, e: MouseEvent) {
    if (
      !this.delayedSelection &&
      this.graph.isCellMovable(cell) &&
      !this.graph.isToggleEvent(e)
    ) {
      return [cell]
    }

    // cell is selected before mouse-down, so return all moveable
    // cells in selection.
    return this.graph.getMovableCells(this.graph.getSelectedCells())
  }

  protected getPreviewBounds(cells: Cell[]) {
    const bounds = this.getBoundingBox(cells)
    if (bounds != null) {
      // Corrects width and height
      bounds.width = Math.max(0, bounds.width - 1)
      bounds.height = Math.max(0, bounds.height - 1)

      if (bounds.width < this.minimumSize) {
        const dx = this.minimumSize - bounds.width
        bounds.x -= dx / 2
        bounds.width = this.minimumSize
      } else {
        bounds.x = Math.round(bounds.x)
        bounds.width = Math.ceil(bounds.width)
      }

      if (bounds.height < this.minimumSize) {
        const dy = this.minimumSize - bounds.height
        bounds.y -= dy / 2
        bounds.height = this.minimumSize
      } else {
        bounds.y = Math.round(bounds.y)
        bounds.height = Math.ceil(bounds.height)
      }
    }

    return bounds
  }

  protected getBoundingBox(cells: Cell[]): Rectangle | null {
    let result: Rectangle | null = null
    const model = this.graph.getModel()

    cells && cells.forEach((cell) => {
      if (model.isNode(cell) || model.isEdge(cell)) {
        const state = this.graph.view.getState(cell)
        if (state) {
          let bbox = state.bounds
          if (model.isNode(cell) && state.shape && state.shape.boundingBox) {
            bbox = state.shape.boundingBox
          }

          if (result == null) {
            result = bbox.clone()
          } else {
            result.add(bbox)
          }
        }
      }
    })

    return result
  }

  protected getStatesForGuide() {
    const parent = this.graph.getDefaultParent()
    const cells = this.graph.model.filterDescendants(
      cell => (
        this.graph.view.getState(cell) != null &&
        this.graph.model.isNode(cell) &&
        cell.geometry != null &&
        !cell.geometry.relative
      ),
      parent,
    )

    return this.graph.view.getCellStates(cells)
  }

  /**
   * Highlight possible drop targets and update the preview.
   */
  mouseMove(e: MouseEventEx) {
    if (
      !this.isConsumed(e) &&
      this.isMouseDown() &&
      this.cell != null &&
      this.origin != null &&
      this.bounds != null
    ) {
      // Stops moving if a multi touch event is received
      if (this.isMultiTouchEvent(e)) {
        this.reset()
        return
      }

      const graph = this.graph
      const tol = graph.tolerance
      let delta = this.getDelta(e)
      let dx = delta.x
      let dy = delta.y

      if (
        this.previewShape ||
        Math.abs(dx) > tol ||
        Math.abs(dy) > tol
      ) {
        // Highlight is used for highlighting drop targets
        if (this.highlight == null) {
          this.highlight = new CellHighlight(graph)
        }

        if (this.previewShape == null) {
          this.previewShape = this.createPreviewShape(this.bounds)
        }

        const gridEnabled = graph.isGridEnabledForEvent(e.getEvent())
        let hideGuide = true

        if (this.isGuideEnabledForEvent(e)) {
          if (!this.guide) {
            this.guide = createGuide(this.graph, this.getStatesForGuide())
          }

          delta = this.guide.move(this.bounds, new Point(dx, dy), gridEnabled)
          dx = delta.x
          dy = delta.y
          hideGuide = false

        } else if (gridEnabled) {

          const t = graph.view.translate
          const s = graph.view.scale
          const x = (graph.snap(this.bounds.x / s - t.x) + t.x) * s
          const y = (graph.snap(this.bounds.y / s - t.y) + t.y) * s

          const tx = this.bounds.x - x
          const ty = this.bounds.y - y
          const v = this.snap(new Point(dx, dy))

          dx = v.x - tx
          dy = v.y - ty
        }

        if (this.guide && hideGuide) {
          this.guide.hide()
        }

        // Constrained movement if shift key is pressed
        if (graph.isConstrainedEvent(e.getEvent())) {
          if (Math.abs(dx) > Math.abs(dy)) {
            dy = 0
          } else {
            dx = 0
          }
        }

        this.dx = dx
        this.dy = dy
        this.updatePreview()
        this.updateDropTarget(e)
      }

      this.updateHint()
      this.consume(e, DomEvent.MOUSE_MOVE)

      // Cancels the bubbling of events to the container so
      // that the droptarget is not reset due to an mouseMove
      // fired on the container with no associated state.
      DomEvent.consume(e.getEvent())

    } else if (this.shouldUpdateCursor(e)) {
      this.setMovableCursor(e)
    }
  }

  protected shouldUpdateCursor(e: MouseEventEx) {
    return (
      this.graph.isAutoUpdateCursor() &&
      !this.isConsumed(e) &&
      !this.isMouseDown() &&
      (this.graph.isCellsMovable() || this.graph.isCellsCloneable()) &&
      this.isOnCell(e)
    )
  }

  protected setMovableCursor(e: MouseEventEx) {
    let cursor = this.getCursorForEvent(e)
    if (
      cursor == null &&
      this.graph.isEnabled() &&
      this.graph.isCellsMovable() &&
      this.graph.isCellMovable(e.getCell())
    ) {
      cursor = 'move'
    }

    // Sets the cursor on the original source state under the mouse
    // instead of the event source state which can be the parent
    if (cursor != null && e.state != null) {
      e.state.setCursor(cursor)
    }
  }

  protected getCursorForEvent(e: MouseEventEx): string | null {
    return this.graph.getCellCursor(e.getCell())
  }

  protected getDelta(e: MouseEventEx) {
    const s = this.graph.view.scale
    const p = util.clientToGraph(this.graph.container, e)

    return new Point(
      this.roundLength((p.x - this.origin!.x) / s) * s,
      this.roundLength((p.y - this.origin!.y) / s) * s,
    )
  }

  protected snap(p: Point) {
    const s = this.scaleGrid ? this.graph.view.scale : 1
    p.x = this.graph.snap(p.x / s) * s
    p.y = this.graph.snap(p.y / s) * s
    return p
  }

  protected createPreviewShape(bounds: Rectangle) {
    const shape = new RectangleShape(bounds)
    shape.dashed = true

    if (this.htmlPreview) {
      shape.dialect = 'html'
      shape.init(this.graph.container)
    } else {
      shape.dialect = 'svg'
      shape.pointerEvents = false
      shape.init(this.graph.view.getOverlayPane())
    }

    return shape
  }

  protected updatePreview() {
    if (
      this.previewShape &&
      this.previewBounds &&
      this.dx != null &&
      this.dy != null
    ) {
      const bounds = this.previewShape.bounds = new Rectangle(
        Math.round(this.previewBounds.x + this.dx - this.graph.tx),
        Math.round(this.previewBounds.y + this.dy - this.graph.ty),
        this.previewBounds.width,
        this.previewBounds.height,
      )

      applyMovingPreviewStyle({
        graph: this.graph,
        shape: this.previewShape,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      })

      this.previewShape.redraw()
    }
  }

  protected isGuideEnabledForEvent(e: MouseEventEx) {
    return isGuideEnabled({
      graph: this.graph,
      e: e.getEvent(),
    })
  }

  protected isClone(e: MouseEventEx) {
    return (
      this.graph.isCloneEvent(e.getEvent()) &&
      this.graph.isCellsCloneable()
    )
  }

  protected updateDropTarget(e: MouseEventEx) {
    const graph = this.graph
    const cell = this.getCell(e)
    const clone = this.isClone(e)

    let target = null

    if (graph.isDropEnabled()) {
      // Call getCellAt to find the cell under the mouse
      target = graph.getDropTarget(this.cells, e.getEvent(), cell, clone)
    }

    let state = graph.view.getState(target)
    let active = false

    if (state && (graph.model.getParent(this.cell) !== target || clone)) {
      if (this.target !== target) {
        this.target = target
        applyDropTargetHighlightStyle({
          graph,
          cell: target!,
          highlight: this.highlight!,
        })
      }

      active = true

    } else {

      this.target = null

      // Drag a cell onto another cell, then drop it to trigger a connection.
      if (
        this.graph.isConnectOnDrop() &&
        cell &&
        cell.isNode() &&
        this.cells.length === 1 &&
        graph.isCellConnectable(cell)
      ) {
        state = graph.view.getState(cell)
        if (state != null) {
          const error = graph.validator.getEdgeValidationError(
            null, this.cell, cell,
          )
          applyConnectionHighlightStyle({
            graph,
            cell,
            valid: error == null,
            highlight: this.highlight!,
          })
          active = true
        }
      }
    }

    if (this.highlight) {
      if (state != null && active) {
        this.highlight.highlight(state)
      } else {
        this.highlight.hide()
      }
    }
  }

  /**
   * Handles the event by applying the changes to the selection cells.
   */
  mouseUp(e: MouseEventEx) {
    if (!this.isConsumed(e)) {
      if (
        this.cell &&
        this.origin &&
        this.previewShape &&
        this.dx != null &&
        this.dy != null
      ) {
        const graph = this.graph
        const cell = e.getCell()
        const evt = e.getEvent()

        if (
          this.graph.isConnectOnDrop() &&
          this.target == null &&
          cell != null &&
          cell.isNode() &&
          graph.isCellConnectable(cell) &&
          graph.isEdgeValid(null, this.cell, cell)
        ) {

          graph.connectionHandler.connect(this.cell, cell, evt, null)

        } else {
          const clone = this.isClone(e)
          const target = this.target
          const scale = graph.view.scale
          const dx = this.roundLength(this.dx / scale)
          const dy = this.roundLength(this.dy / scale)

          if (
            target &&
            graph.isSplitEnabled() &&
            graph.isSplitTarget(target, this.cells, evt)
          ) {
            graph.splitEdge(target, this.cells, null, dx, dy)
          } else {
            this.moveCells(this.cells, dx, dy, clone, this.target, evt)
          }
        }
      } else if (
        this.graph.isCellsSelectable() &&
        this.delayedSelection &&
        this.cell != null
      ) {
        this.selectDelayed(e)
      }
    }

    if (this.shouldConsumeMouseUp) {
      this.consume(e, DomEvent.MOUSE_UP)
    }

    this.reset()
  }

  protected selectDelayed(e: MouseEventEx) {
    if (
      !this.graph.isCellSelected(this.cell) ||
      !this.graph.contextMenuHandler.isPopupTrigger(e)
    ) {
      this.graph.selectionManager.selectCellForEvent(this.cell, e.getEvent())
    }
  }

  protected reset() {
    this.destoryShapes()
    this.removeHint()

    this.dx = null
    this.dy = null
    this.guide = null
    this.origin = null
    this.cell = null
    this.target = null
    this.delayedSelection = false
    this.shouldConsumeMouseUp = false
  }

  protected shouldRemoveCellsFromParent(
    parent: Cell | null,
    cells: Cell[],
    e: MouseEvent,
  ) {
    if (this.graph.model.isNode(parent)) {
      const pState = this.graph.view.getState(parent)
      if (pState != null) {
        let pos = util.clientToGraph(this.graph.container, e)
        const rot = util.getRotation(pState)
        if (rot !== 0) {
          const cx = pState.bounds.getCenter()
          pos = util.rotatePoint(pos, -rot, cx)
        }

        return !pState.bounds.containsPoint(pos)
      }
    }

    return false
  }

  protected shouldRemoveParent(parent: Cell) {
    const state = this.graph.view.getState(parent)
    if (
      state != null && (
        this.graph.model.isEdge(state.cell) ||
        this.graph.model.isNode(state.cell)
      ) &&
      this.graph.isCellDeletable(state.cell) &&
      this.graph.model.getChildCount(state.cell) === 0
    ) {
      const NONE = 'none'
      const stroke = state.style.stroke || NONE
      const fill = state.style.fill || NONE

      return stroke === NONE && fill === NONE
    }

    return false
  }

  protected moveCells(
    cells: Cell[],
    dx: number,
    dy: number,
    clone: boolean,
    target: Cell | null,
    evt: MouseEvent,
  ) {
    if (clone) {
      // tslint:disable-next-line
      cells = this.graph.getCloneableCells(cells)
    }

    // Removes cells from parent
    const parent = this.graph.model.getParent(this.cell)

    if (
      target == null &&
      this.graph.isRemoveCellsFromParentAllowed() &&
      this.shouldRemoveCellsFromParent(parent, cells, evt)
    ) {
      // tslint:disable-next-line
      target = this.graph.getDefaultParent()
    }

    // Cloning into locked cells is not allowed
    // tslint:disable-next-line
    clone = clone && !this.graph.isCellLocked(
      target || this.graph.getDefaultParent(),
    )

    this.graph.batchUpdate(() => {
      const parents: Cell[] = []

      // Removes parent if all child cells are removed
      if (!clone && target != null && this.graph.isAutoRemoveEmptyParent()) {
        // Collects all non-selected parents
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(cell => (dict.set(cell, true)))
        cells.forEach((cell) => {
          const parent = this.graph.model.getParent(cell)
          if (parent != null && !dict.get(parent)) {
            dict.set(parent, true)
            parents.push(parent)
          }
        })
      }

      // Passes all selected cells in order to correctly clone or move into
      // the target cell. The method checks for each cell if its movable.
      // tslint:disable-next-line
      cells = this.graph.moveCells(
        cells,
        dx - this.graph.tx / this.graph.view.scale,
        dy - this.graph.ty / this.graph.view.scale,
        clone,
        target,
        evt,
      )

      // Removes parent if all child cells are removed
      const temp = parents.filter(parent => this.shouldRemoveParent(parent))
      this.graph.removeCells(temp, false)
    })

    // Selects the new cells if cells have been cloned
    if (clone) {
      this.graph.setSelectedCells(cells)
    }

    if (
      this.graph.isCellsSelectable() &&
      this.graph.isScrollOnMove()
    ) {
      this.graph.scrollCellToVisible(cells[0])
    }
  }

  protected destoryShapes() {
    // Destroys the preview dashed rectangle
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.guide != null) {
      this.guide.dispose()
      this.guide = null
    }

    // Destroys the drop target highlight
    if (this.highlight != null) {
      this.highlight.dispose()
      this.highlight = null
    }
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)

    this.graph.off(Graph.events.translate, this.onPan)
    this.onPan = null

    this.graph.off(Graph.events.escape, this.onEscape)
    this.onEscape = null

    this.graph.model.off(Model.events.change, this.onRefresh)
    this.onRefresh = null

    this.destoryShapes()
    this.removeHint()
  }
}
