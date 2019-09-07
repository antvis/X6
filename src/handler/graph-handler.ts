import * as util from '../util'
import { detector, constants, CustomMouseEvent, DomEvent } from '../common'
import { Graph, Cell, Model, State } from '../core'
import { Rectangle, Point } from '../struct'
import { RectangleShape } from '../shape'
import { Guide } from './guide'
import { CellHighlight } from './cell-highlight'
import { MouseHandler } from './handler-mouse'
import { Feature } from '../core/feature'

export class GraphHandler extends MouseHandler {
  /**
   * Specifies if cloning by control-drag is enabled.
   *
   * Default is `true`.
   */
  cloneable: boolean = true

  /**
   * Specifies if moving is enabled.
   *
   * Default is `true`.
   */
  movable: boolean = true

  /**
   * Specifies if selecting is enabled.
   *
   * Default is `true`.
   */
  selectable: boolean = true

  /**
   * Specifies if the bounding box should allow for rotation.
   *
   * Default is `true`.
   */
  rotatable: boolean = true

  /**
   * Specifies if drop targets under the mouse should be enabled.
   *
   * Default is `true`.
   */
  highlightEnabled: boolean = true

  /**
   * Specifies if other cells should be used for snapping
   * of the current selection.
   *
   * Default is `false`.
   */
  guideEnabled: boolean = false

  /**
   * Holds the `Guide` instance that is used for alignment.
   */
  guide: Guide | null = null

  /**
   * Specifies if a move cursor should be shown if the mouse
   * is over a movable cell.
   *
   * Default is `true`.
   */
  updateCursor: boolean = true

  /**
   * Specifies if cells may be moved out of their parents.
   *
   * Default is `true`.
   */
  removeCellsFromParent: boolean = true

  /**
   * If empty parents should be removed from the model after all child cells
   * have been moved out.
   *
   * Default is `true`.
   */
  removeEmptyParent: boolean = false

  /**
   * Specifies if drop events are interpreted as new connections if no other
   * drop action is defined.
   *
   * Default is `false`.
   */
  connectOnDrop: boolean = false

  /**
   * Specifies if the view should be scrolled so that a moved cell is
   * visible.
   *
   * Default is `true`.
   */
  scrollOnMove: boolean = true

  /**
   * Specifies the minimum number of pixels for the width and height of a
   * selection bounds.
   *
   * Default is `6`.
   */
  minimumSize: number = 6

  /**
   * Specifies the color of the preview shape.
   *
   * Default is `black`.
   */
  previewColor: string = 'black'

  /**
   * Specifies if the graph container should be used for preview. If this
   * is used then drop target detection relies entirely on `graph.getCellAt`
   * because the HTML preview does not "let events through".
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

  /**
   * Defines the maximum number of cells to paint subhandles for.
   *
   * Default is `20` for IE and `50` for others. Set this to `0` if you
   * want an unlimited number of handles to be displayed. This is only
   * recommended if the number of cells in the graph is limited to a
   * small number, eg. `500`.
   */
  maxCellCount: number = (detector.IS_IE) ? 20 : 50

  protected panHandler: (() => void) | null
  protected escapeHandler: (() => void) | null
  protected refreshHandler: (() => void) | null

  protected highlight: CellHighlight | null
  protected delayedSelection: boolean
  protected cell: Cell | null
  protected cells: Cell[]
  protected target: Cell | null
  protected origin: Point | null
  protected bounds: Rectangle | null
  protected previewBounds: Rectangle | null
  protected previewShape: RectangleShape | null = null
  protected shouldConsumeMouseUp: boolean = false

  protected dx: number | null = null
  protected dy: number | null = null

  constructor(graph: Graph) {
    super(graph)
    this.graph.addMouseListener(this)

    // Repaints the handler after autoscroll
    this.panHandler = () => {
      this.updatePreview()
      this.updateHint()
    }

    this.graph.on(Graph.events.translate, this.panHandler)

    this.escapeHandler = () => this.reset()
    this.graph.on(Graph.events.escape, this.escapeHandler)

    this.refreshHandler = () => {
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

    this.graph.model.on(Model.events.change, this.refreshHandler)
  }

  protected updateHint() { }

  protected removeHint() { }

  protected roundLength(len: number) {
    return Math.round(len * 2) / 2
  }

  protected setHighlightColor(color: string | null) {
    if (this.highlight != null) {
      this.highlight.setHighlightColor(color)
    }
  }

  protected isDelayedSelection(cell: Cell | null, e: CustomMouseEvent) {
    return this.graph.isCellSelected(cell)
  }

  /**
   * Select the given cell and create a handle for it.
   */
  mouseDown(e: CustomMouseEvent) {
    if (
      !e.isConsumed() && this.isEnabled() && this.graph.isEnabled() &&
      e.getState() != null && !DomEvent.isMultiTouchEvent(e.getEvent())
    ) {
      const cell = this.getCell(e)
      this.delayedSelection = this.isDelayedSelection(cell, e)
      this.cell = null

      // Select cell which was not selected immediately
      if (this.selectable && !this.delayedSelection) {
        // Trigger selection change, then selectionHandler will refresh,
        // result to create cell resize/rotate handle knots.
        this.graph.selectionManager.selectCellForEvent(cell, e.getEvent())
      }

      // start move cell(s)
      if (this.movable && cell) {
        const model = this.graph.model
        const geo = cell.getGeometry()

        if (
          this.graph.isCellMovable(cell) &&
          (
            this.graph.allowDanglingEdges
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

  protected start(cell: Cell, e: CustomMouseEvent) {
    this.cell = cell
    this.cells = this.getCells(cell, e.getEvent())
    this.origin = util.clientToGraph(
      this.graph.container, e.getClientX(), e.getClientY(),
    )
    this.bounds = this.graph.view.getBounds(this.cells)
    this.previewBounds = this.getPreviewBounds(this.cells)

    if (this.guideEnabled) {
      this.guide = Feature.createGuide(this.graph, this.getGuideStates())
    }
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

  protected getGuideStates() {
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

    return this.graph.view.getCellStates(cells) as State[]
  }

  /**
   * Highlight possible drop targets and update the preview.
   */
  mouseMove(e: CustomMouseEvent) {
    const graph = this.graph

    if (
      !e.isConsumed() &&
      graph.eventloop.isMouseDown &&
      this.cell != null &&
      this.origin != null &&
      this.bounds != null
    ) {
      // Stops moving if a multi touch event is received
      if (DomEvent.isMultiTouchEvent(e.getEvent())) {
        this.reset()
        return
      }

      let delta = this.getDelta(e)
      let dx = delta.x
      let dy = delta.y
      const tol = graph.tolerance

      if (
        this.previewShape ||
        Math.abs(dx) > tol ||
        Math.abs(dy) > tol
      ) {
        // Highlight is used for highlighting drop targets
        if (this.highlight == null) {
          this.highlight = new CellHighlight(this.graph, {
            highlightColor: constants.DROP_TARGET_COLOR,
            strokeWidth: 3,
          })
        }

        if (this.previewShape == null) {
          this.previewShape = this.createPreviewShape(this.bounds)
        }

        const gridEnabled = graph.isGridEnabledForEvent(e.getEvent())
        let hideGuide = true

        if (this.guide && this.isGuideEnabledForEvent(e)) {
          delta = this.guide.move(this.bounds, new Point(dx, dy), gridEnabled)
          dx = delta.x
          dy = delta.y
          hideGuide = false

        } else if (gridEnabled) {

          const t = graph.view.translate
          const s = graph.view.scale

          const tx = this.bounds.x - (graph.snap(this.bounds.x / s - t.x) + t.x) * s
          const ty = this.bounds.y - (graph.snap(this.bounds.y / s - t.y) + t.y) * s
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

  protected shouldUpdateCursor(e: CustomMouseEvent) {
    return (
      !e.isConsumed() &&
      !this.graph.eventloop.isMouseDown &&
      this.updateCursor &&
      (this.movable || this.cloneable) &&
      e.getState() != null
    )
  }

  protected setMovableCursor(e: CustomMouseEvent) {
    let cursor = this.graph.eventloop.getCursorForEvent(e)
    if (
      cursor == null &&
      this.graph.isEnabled() &&
      this.graph.isCellMovable(e.getCell())
    ) {
      if (this.graph.model.isEdge(e.getCell())) {
        cursor = constants.CURSOR_MOVABLE_EDGE
      } else {
        cursor = constants.CURSOR_MOVABLE_NODE
      }
    }

    // Sets the cursor on the original source state under the mouse
    // instead of the event source state which can be the parent
    if (cursor != null && e.state != null) {
      e.state.setCursor(cursor)
    }
  }

  protected getDelta(e: CustomMouseEvent) {
    const scale = this.graph.view.scale
    const point = util.clientToGraph(
      this.graph.container,
      e.getClientX(),
      e.getClientY(),
    )

    return new Point(
      this.roundLength((point.x - this.origin!.x) / scale) * scale,
      this.roundLength((point.y - this.origin!.y) / scale) * scale,
    )
  }

  protected snap(p: Point) {
    const s = this.scaleGrid ? this.graph.view.scale : 1
    p.x = this.graph.snap(p.x / s) * s
    p.y = this.graph.snap(p.y / s) * s
    return p
  }

  protected createPreviewShape(bounds: Rectangle) {
    const shape = new RectangleShape(bounds, null, this.previewColor)
    shape.dashed = true

    if (this.htmlPreview) {
      shape.dialect = 'html'
      shape.init(this.graph.container)
    } else {
      shape.dialect = 'svg'
      shape.init(this.graph.view.getOverlayPane()!)
      shape.pointerEvents = false
    }

    return shape
  }

  protected isGuideEnabledForEvent(e: CustomMouseEvent) {
    return Feature.isGuideEnabled({
      e: e.getEvent(),
      graph: this.graph,
    })
  }

  protected updatePreview() {
    if (
      this.previewShape &&
      this.previewBounds &&
      this.dx != null &&
      this.dy != null
    ) {
      this.previewShape.bounds = new Rectangle(
        Math.round(this.previewBounds.x + this.dx - this.graph.tx),
        Math.round(this.previewBounds.y + this.dy - this.graph.ty),
        this.previewBounds.width,
        this.previewBounds.height,
      )

      this.previewShape.redraw()
    }
  }

  protected isClone(e: CustomMouseEvent) {
    return (
      this.graph.isCloneEvent(e.getEvent()) &&
      this.graph.isCellsCloneable() &&
      this.cloneable
    )
  }

  protected updateDropTarget(e: CustomMouseEvent) {
    const graph = this.graph
    const cell = e.getCell()
    const clone = this.isClone(e)

    let target = null

    if (graph.isDropEnabled() && this.highlightEnabled) {
      // Call getCellAt to find the cell under the mouse
      target = graph.getDropTarget(this.cells, e.getEvent(), cell, clone)
    }

    let state = graph.view.getState(target)
    let active = false

    if (state && (graph.model.getParent(this.cell) !== target || clone)) {
      if (this.target !== target) {
        this.target = target
        this.setHighlightColor(constants.DROP_TARGET_COLOR)
      }

      active = true

    } else {

      this.target = null

      if (
        this.connectOnDrop && cell && this.cells.length === 1 &&
        cell.isNode() && graph.isCellConnectable(cell)
      ) {
        state = graph.view.getState(cell)

        if (state != null) {
          const error = graph.validator.getEdgeValidationError(
            null, this.cell, cell,
          )

          const color = (error == null) ?
            constants.VALID_COLOR :
            constants.INVALID_CONNECT_TARGET_COLOR

          this.setHighlightColor(color)
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
  mouseUp(e: CustomMouseEvent) {
    if (!e.isConsumed()) {
      if (
        this.cell && this.origin && this.previewShape &&
        this.dx != null && this.dy != null
      ) {
        const graph = this.graph
        const cell = e.getCell()
        const evt = e.getEvent()

        if (
          this.connectOnDrop &&
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
        this.selectable &&
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

  protected selectDelayed(e: CustomMouseEvent) {
    if (
      !this.graph.isCellSelected(this.cell) ||
      !this.graph.popupMenuHandler.isPopupTrigger(e)
    ) {
      this.graph.selectionManager.selectCellForEvent(this.cell, e.getEvent())
    }
  }

  protected reset() {
    this.disposeShapes()
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

  /**
   * Returns true if the given cells should be removed from the
   * parent for the specified mousereleased event.
   */
  protected shouldRemoveCellsFromParent(
    parent: Cell | null,
    cells: Cell[],
    e: MouseEvent,
  ) {
    if (this.graph.model.isNode(parent)) {
      const pState = this.graph.view.getState(parent)
      if (pState != null) {
        let pos = util.clientToGraph(
          this.graph.container,
          DomEvent.getClientX(e),
          DomEvent.getClientY(e),
        )
        const alpha = util.toRad(util.getRotation(pState))
        if (alpha !== 0) {
          const cos = Math.cos(-alpha)
          const sin = Math.sin(-alpha)
          const cx = pState.bounds.getCenter()
          pos = util.rotatePoint(pos, cos, sin, cx)
        }

        return !util.contains(pState.bounds, pos.x, pos.y)
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
      const stroke = state.style.stroke || constants.NONE
      const fill = state.style.fill || constants.NONE

      return stroke === constants.NONE && fill === constants.NONE
    }

    return false
  }

  /**
   * Moves the given cells by the specified amount.
   */
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
      this.removeCellsFromParent &&
      this.shouldRemoveCellsFromParent(parent, cells, evt)
    ) {
      // tslint:disable-next-line
      target = this.graph.getDefaultParent()
    }

    // Cloning into locked cells is not allowed
    // tslint:disable-next-line
    clone = clone && !this.graph.isCellLocked(target || this.graph.getDefaultParent())

    this.graph.batchUpdate(() => {
      const parents: Cell[] = []

      // Removes parent if all child cells are removed
      if (!clone && target != null && this.removeEmptyParent) {
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

    if (this.selectable && this.scrollOnMove) {
      this.graph.scrollCellToVisible(cells[0])
    }
  }

  protected disposeShapes() {
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

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this)

    this.graph.off(Graph.events.translate, this.panHandler)
    this.panHandler = null

    this.graph.off(Graph.events.escape, this.escapeHandler)
    this.escapeHandler = null

    this.graph.model.off(Model.events.change, this.refreshHandler)
    this.refreshHandler = null

    this.disposeShapes()
    this.removeHint()

    super.dispose()
  }
}
