import * as util from '../util'
import {
  constants,
  detector,
  DomEvent,
  CustomMouseEvent,
  Primer,
} from '../common'
import { Cell } from './cell'
import { Graph } from './graph'
import { Geometry } from './geometry'
import { State } from './state'
import { StyleRegistry } from '../stylesheet'
import { RectangleShape, ImageShape } from '../shape'
import { UndoableEdit, CurrentRootChange } from '../change'
import { Point, Rectangle, Constraint, Image } from '../struct'

export class View extends Primer {
  graph: Graph
  scale: number
  translate: Point

  /**
   * Specifies if a gesture should be captured when it goes outside of the
   * graph container.
   *
   * Default is `true`.
   */
  captureDocumentGesture: boolean = true

  /**
   * A `Cell` that acts as the root of the displayed cell hierarchy.
   */
  currentRoot: Cell | null

  /**
   * Specifies if the style should be updated in each validation step. If this
   * is `false` then the style is only updated if the state is created or if the
   * style of the cell was changed.
   *
   * Default is `false`.
   */
  updateStyle: boolean = false

  protected stage: HTMLElement | SVGGElement | null
  protected backgroundPane: HTMLElement | SVGGElement | null
  protected drawPane: HTMLElement | SVGGElement | null
  protected overlayPane: HTMLElement | SVGGElement | null
  protected decoratorPane: HTMLElement | SVGGElement | null

  protected states: WeakMap<Cell, State>
  protected readonly invalidatings: WeakSet<Cell>
  protected backgroundImage: ImageShape | null
  protected backgroundPageShape: RectangleShape | null

  /**
   * Shared temporary DIV is used for text measuring
   */
  textDiv: HTMLElement

  constructor(graph: Graph) {
    super()

    this.graph = graph
    this.scale = 1
    this.translate = new Point()
    this.graphBounds = new Rectangle()
    this.states = new WeakMap<Cell, State>()
    this.invalidatings = new WeakSet<Cell>()
  }

  get model() {
    return this.graph.model
  }

  /**
   * Specifies if shapes should be created, updated and destroyed
   */
  protected rendering: boolean = true

  isRendering() {
    return this.rendering
  }

  setRendering(rendering: boolean) {
    this.rendering = rendering
  }

  /**
   * Specifies if string values in cell styles should be evaluated using
   * `eval`. This will only be used if the string values can't be mapped
   * to objects using `StyleRegistry`.
   *
   * Default is `false`.
   *
   * NOTE: Enabling this carries a possible security risk.
   */
  protected allowEval: boolean = false

  isAllowEval() {
    return this.allowEval
  }

  setAllowEval(allowEval: boolean) {
    this.allowEval = allowEval
  }

  protected graphBounds: Rectangle

  getGraphBounds() {
    return this.graphBounds
  }

  setGraphBounds(bounds: Rectangle) {
    this.graphBounds = bounds
  }

  /**
   * Returns the union of all `CellStates` for the given array of `Cell`s.
   *
   * @param cells Array of `Cell` whose bounds should be returned.
   */
  getBounds(cells: Cell[]): Rectangle | null {
    let result: Rectangle | null = null

    if (cells != null && cells.length > 0) {
      const model = this.graph.getModel()
      cells.forEach((cell) => {
        if (model.isNode(cell) || model.isEdge(cell)) {
          const state = this.getState(cell)
          if (state != null) {
            if (result == null) {
              result = state.bounds.clone()
            } else {
              result.add(state.bounds)
            }
          }
        }
      })
    }

    return result
  }

  /**
   * Returns the bounding box of the shape and the label for the
   * given `CellState` and its children if recurse is true.
   */
  getBoundingBox(state: State | null, recurse: boolean = true) {
    let result: Rectangle | null = null
    if (state != null) {
      if (state.shape != null && state.shape.boundingBox != null) {
        result = state.shape.boundingBox.clone()
      }

      if (state.text != null && state.text.boundingBox != null) {
        if (result != null) {
          result.add(state.text.boundingBox)
        } else {
          result = state.text.boundingBox.clone()
        }
      }

      if (recurse) {
        state.cell.eachChild((child) => {
          const boundingBox = this.getBoundingBox(this.getState(child))
          if (boundingBox != null) {
            if (result == null) {
              result = boundingBox
            } else {
              result.add(boundingBox)
            }
          }
        })
      }
    }

    return result
  }

  protected getEmptyBounds() {
    return new Rectangle(
      this.translate.x * this.scale,
      this.translate.y * this.scale,
    )
  }

  // #region ::::::::::: Translate & Scale :::::::::::

  setCurrentRoot(root: Cell | null) {
    if (this.currentRoot !== root) {
      const change = new CurrentRootChange(this, root)
      change.execute()
      const edit = new UndoableEdit(this.graph.getModel())
      edit.add(change)
      this.trigger('undo', edit)
      this.graph.viewport.sizeDidChange()
    }

    return root
  }

  scaleAndTranslate(scale: number, tx: number, ty: number) {
    const previousScale = this.scale
    const previousTranslate = new Point(this.translate.x, this.translate.y)

    if (
      this.scale !== scale ||
      this.translate.x !== tx ||
      this.translate.y !== ty
    ) {
      this.scale = scale
      this.translate.x = tx
      this.translate.y = ty

      this.scaledOrTranslated()

      this.trigger('scaleAndTranslate', {
        previousScale,
        previousTranslate,
        scale,
        translate: this.translate,
      })
    }
  }

  getScale() {
    return this.scale
  }

  setScale(scale: number) {
    const previousScale = this.scale
    if (this.scale !== scale) {
      this.scale = scale
      this.scaledOrTranslated()
      this.trigger('scale', { scale, previousScale })
    }
  }

  getTranslate() {
    return this.translate
  }

  setTranslate(tx: number, ty: number) {
    if (this.translate.x !== tx || this.translate.y !== ty) {
      const previousTranslate = new Point(
        this.translate.x,
        this.translate.y,
      )

      this.translate.x = tx
      this.translate.y = ty

      this.scaledOrTranslated()
      this.trigger('translate', {
        previousTranslate,
        translate: this.translate,
      })
    }
  }

  protected scaledOrTranslated() {
    this.revalidate()
    this.graph.viewport.sizeDidChange()
  }

  // #endregion

  // #region ::::::::::::::: Refresh :::::::::::::::::

  refresh() {
    if (this.currentRoot != null) {
      this.clear()
    }

    this.revalidate()
  }

  revalidate() {
    this.invalidate()
    this.validate()
  }

  /**
   * Invalidates the state of the given cell, all
   * its descendants and connected edges.
   */
  invalidate(
    cell: Cell = this.model.getRoot(),
    recurse: boolean = true,
    includeEdges: boolean = true,
  ) {
    const state = this.getState(cell)
    if (state != null) {
      state.invalid = true
    }

    // avoid endless circulation
    if (!this.invalidatings.has(cell)) {
      this.invalidatings.add(cell)

      if (recurse) {
        cell.eachChild(child => this.invalidate(child, recurse, includeEdges))
      }

      if (includeEdges) {
        cell.eachEdge(edge => this.invalidate(edge, recurse, includeEdges))
      }

      this.invalidatings.delete(cell)
    }
  }

  validate(cell?: Cell) {
    this.resetValidationState()

    const top = cell || (this.currentRoot != null
      ? this.currentRoot
      : this.graph.model.getRoot()
    )

    const boundingBox = this.getBoundingBox(
      this.validateCellState(
        this.validateCell(top),
      ),
    )

    this.setGraphBounds(boundingBox || this.getEmptyBounds())
    this.validateBackground()

    this.resetValidationState()
  }

  /**
   * Recursively creates the cell state for the given cell if visible is true
   * and the given cell is visible. If the cell is not visible but the state
   * exists then it is removed.
   */
  protected validateCell(cell: Cell, visible: boolean = true) {
    if (cell != null) {
      visible = visible && this.graph.isCellVisible(cell) // tslint:disable-line
      const state = this.getState(cell, visible)
      if (state != null && !visible) {
        this.removeState(cell) // remove unvisible cell's state
      } else {
        cell.eachChild((child) => {
          const childVisible = visible && (
            !this.graph.isCellCollapsed(cell) ||
            cell === this.currentRoot
          )
          this.validateCell(child, childVisible)
        })
      }
    }

    return cell
  }

  /**
   * Validates and repaints
   */
  protected validateCellState(cell: Cell | null, recurse: boolean = true) {
    let state = null
    if (cell != null) {
      state = this.getState(cell)
      if (state != null) {
        if (state.invalid) {
          state.invalid = false

          // set `state.invalidStyle = true` only when process `StyleChange`
          if (state.style == null || state.invalidStyle) {
            state.style = this.graph.getCellStyle(state.cell)
            state.invalidStyle = false
          }

          // parent
          if (cell !== this.currentRoot) {
            this.validateCellState(this.model.getParent(cell)!, false)
          }

          // terminal
          const source = this.getVisibleTerminal(cell, true)
          const target = this.getVisibleTerminal(cell, false)
          const sourceState = this.validateCellState(source, true)
          const targetState = this.validateCellState(target, false)
          state.setVisibleTerminalState(sourceState, true)
          state.setVisibleTerminalState(targetState, false)

          this.updateCellState(state)

          // repaint
          if (cell !== this.currentRoot && !state.invalid) {
            this.graph.renderer.redraw(state, false, this.isRendering())
            state.updateCachedBounds()
          }
        }

        // recursion
        if (recurse && !state.invalid) {
          if (state.shape != null) {
            // Updates order in DOM if recursively traversing
            this.stateValidated(state)
          }

          cell.eachChild(child => this.validateCellState(child, true))
        }
      }
    }

    return state
  }

  // #endregion

  // #region :::::::::: Validate Background ::::::::::

  protected validateBackground() {
    this.validateBackgroundImage()
    this.validateBackgroundPage()
  }

  protected validateBackgroundImage() {
    const bg = this.graph.getBackgroundImage()
    if (bg != null) {
      if (
        this.backgroundImage == null ||
        this.backgroundImage.image !== bg.src
      ) {
        if (this.backgroundImage != null) {
          this.backgroundImage.dispose()
        }

        const bounds = new Rectangle(0, 0, 1, 1)
        this.backgroundImage = new ImageShape(bounds, bg.src)
        this.backgroundImage.dialect = this.graph.dialect
        this.backgroundImage.init(this.backgroundPane!)
        this.backgroundImage.redraw()
      }

      this.redrawBackgroundImage(this.backgroundImage, bg)
    } else if (this.backgroundImage != null) {
      this.backgroundImage.dispose()
      this.backgroundImage = null
    }
  }

  protected redrawBackgroundImage(backgroundImage: ImageShape, bg: Image) {
    backgroundImage.scale = this.scale
    backgroundImage.bounds.x = this.scale * this.translate.x
    backgroundImage.bounds.y = this.scale * this.translate.y
    backgroundImage.bounds.width = this.scale * bg.width
    backgroundImage.bounds.height = this.scale * bg.height

    backgroundImage.redraw()
  }

  protected validateBackgroundPage() {
    if (this.graph.pageVisible) {
      const bounds = this.getBackgroundPageBounds()
      if (this.backgroundPageShape == null) {
        this.backgroundPageShape = new RectangleShape(bounds, 'white', 'black')
        this.backgroundPageShape.scale = this.scale
        this.backgroundPageShape.shadow = true
        this.backgroundPageShape.dialect = this.graph.dialect
        this.backgroundPageShape.init(this.backgroundPane!)
        this.backgroundPageShape.redraw()

        // Adds listener for double click handling on background
        if (this.graph.nativeDblClickEnabled) {
          DomEvent.addListener(
            this.backgroundPageShape.elem!,
            'dblclick',
            (e: MouseEvent) => {
              this.graph.eventloop.dblClick(e)
            },
          )
        }

        // Adds basic listeners for graph event dispatching outside of the
        // container and finishing the handling of a single gesture
        DomEvent.addMouseListeners(
          this.backgroundPageShape.elem!,
          (e: MouseEvent) => {
            this.graph.fireMouseEvent(
              DomEvent.MOUSE_DOWN, new CustomMouseEvent(e),
            )
          },
          (e: MouseEvent) => {
            // Hides the tooltip if mouse is outside container
            if (
              this.graph.tooltipHandler != null &&
              this.graph.tooltipHandler.hideOnHover
            ) {
              this.graph.tooltipHandler.hide()
            }

            if (this.graph.eventloop.isMouseDown && !DomEvent.isConsumed(e)) {
              this.graph.fireMouseEvent(
                DomEvent.MOUSE_MOVE, new CustomMouseEvent(e),
              )
            }
          },
          (e: MouseEvent) => {
            this.graph.fireMouseEvent(
              DomEvent.MOUSE_UP, new CustomMouseEvent(e),
            )
          },
        )
      } else {
        this.backgroundPageShape.scale = this.scale
        this.backgroundPageShape.bounds = bounds
        this.backgroundPageShape.redraw()
      }
    } else if (this.backgroundPageShape != null) {
      this.backgroundPageShape.dispose()
      this.backgroundPageShape = null
    }
  }

  protected getBackgroundPageBounds() {
    const pageFormat = this.graph.pageFormat
    const pageScale = this.scale * this.graph.pageScale
    const bounds = new Rectangle(
      this.scale * this.translate.x,
      this.scale * this.translate.y,
      pageFormat.width * pageScale,
      pageFormat.height * pageScale,
    )

    return bounds
  }

  // #endregion

  // #region :::::::::::: Update DOM Order :::::::::::

  protected lastNode: HTMLElement | null = null
  protected lastHtmlNode: HTMLElement | null = null
  protected lastForegroundNode: HTMLElement | null = null
  protected lastForegroundHtmlNode: HTMLElement | null = null

  protected resetValidationState() {
    this.lastNode = null
    this.lastHtmlNode = null
    this.lastForegroundNode = null
    this.lastForegroundHtmlNode = null
  }

  protected stateValidated(state: State) {
    this.updateDomOrder(state)
  }

  protected updateDomOrder(state: State) {
    const foreground = (
      (this.model.isEdge(state.cell) && this.graph.keepEdgesInForeground) ||
      (this.model.isNode(state.cell) && this.graph.keepEdgesInBackground)
    )
    const htmlNode = foreground
      ? this.lastForegroundHtmlNode || this.lastHtmlNode
      : this.lastHtmlNode
    const node = foreground
      ? this.lastForegroundNode || this.lastNode
      : this.lastNode

    const result = this.graph.renderer.insertStateAfter(state, node, htmlNode)

    if (foreground) {
      this.lastForegroundHtmlNode = result[1]
      this.lastForegroundNode = result[0]
    } else {
      this.lastHtmlNode = result[1]
      this.lastNode = result[0]
    }
  }

  // #endregion

  // #region ::::::::::: Update Cell State :::::::::::

  protected updateCellState(state: State) {
    state.totalLength = 0
    state.origin.x = 0
    state.origin.y = 0
    state.absoluteOffset.x = 0
    state.absoluteOffset.y = 0

    if (state.cell !== this.currentRoot) {
      const parent = this.model.getParent(state.cell)!
      const parentState = this.getState(parent)

      // inherit parent's origin
      if (parentState != null && parent !== this.currentRoot) {
        state.origin.x += parentState.origin.x
        state.origin.y += parentState.origin.y
      }

      // invoke hook
      let offset = this.graph.getChildOffsetForCell(state.cell)
      if (offset != null) {
        state.origin.x += offset.x
        state.origin.y += offset.y
      }

      const scale = this.scale
      const trans = this.translate
      const geo = this.graph.getCellGeometry(state.cell)

      if (geo != null) {
        if (!this.model.isEdge(state.cell)) {
          offset = geo.offset || new Point()

          if (geo.relative && parentState != null) {
            if (this.model.isEdge(parentState.cell)) {
              const origin = this.getPoint(parentState, geo)
              if (origin != null) {
                state.origin.x += (origin.x / scale) - parentState.origin.x - trans.x
                state.origin.y += (origin.y / scale) - parentState.origin.y - trans.y
              }
            } else {
              state.origin.x += geo.bounds.x * parentState.bounds.width / scale + offset.x
              state.origin.y += geo.bounds.y * parentState.bounds.height / scale + offset.y
            }
          } else {
            state.origin.x += geo.bounds.x
            state.origin.y += geo.bounds.y

            state.absoluteOffset.x = scale * offset.x
            state.absoluteOffset.y = scale * offset.y
          }
        }

        state.unscaledWidth = geo.bounds.width
        state.unscaledHeight = geo.bounds.height

        state.bounds.x = scale * (trans.x + state.origin.x)
        state.bounds.y = scale * (trans.y + state.origin.y)
        state.bounds.width = scale * geo.bounds.width
        state.bounds.height = scale * geo.bounds.height

        if (this.model.isNode(state.cell)) {
          this.updateNodeState(state, geo)
        }

        if (this.model.isEdge(state.cell)) {
          this.updateEdgeState(state, geo)
        }
      }
    }

    state.updateCachedBounds()
  }

  protected updateNodeState(state: State, geo: Geometry) {
    const parent = this.model.getParent(state.cell)!
    const parentState = this.getState(parent)

    if (geo.relative && parentState != null && !this.model.isEdge(parent)) {
      const rot = parentState.style.rotation || 0
      const rad = util.toRad(rot)
      if (rad !== 0) {
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        const nodeCenter = state.bounds.getCenter()
        const parentCenter = parentState.bounds.getCenter()
        const pt = util.rotatePoint(nodeCenter, cos, sin, parentCenter)
        state.bounds.x = pt.x - state.bounds.width / 2
        state.bounds.y = pt.y - state.bounds.height / 2
      }
    }

    this.updateNodeLabelOffset(state)
  }

  /**
   * Updates the `absoluteOffset` of the given node cell state.
   * This takes into account the label position styles.
   */
  updateNodeLabelOffset(state: State) {
    const h = state.style.labelPosition || 'center'
    if (h === 'left') {
      let lw = state.style.labelWidth
      if (lw != null) {
        lw *= this.scale
      } else {
        lw = state.bounds.width
      }

      state.absoluteOffset.x -= lw as number

    } else if (h === 'right') {

      state.absoluteOffset.x += state.bounds.width

    } else if (h === 'center') {

      const lw = state.style.labelWidth
      if (lw != null) {
        // Aligns text block with given width inside the node width
        const align = state.style.align || 'center'
        let dx = 0

        if (align === 'center') {
          dx = 0.5
        } else if (align === 'right') {
          dx = 1
        }

        if (dx !== 0) {
          state.absoluteOffset.x -= (lw * this.scale - state.bounds.width) * dx
        }
      }
    }

    const v = state.style.labelVerticalPosition || 'middle'
    if (v === 'top') {
      state.absoluteOffset.y -= state.bounds.height
    } else if (v === 'bottom') {
      state.absoluteOffset.y += state.bounds.height
    }
  }

  protected updateEdgeState(state: State, geo: Geometry) {
    const sourceState = state.getVisibleTerminalState(true)!
    const targetState = state.getVisibleTerminalState(false)!

    // This will remove edges with no terminals and no terminal points
    // as such edges are invalid and produce NPEs in the edge styles.
    // Also removes connected edges that have no visible terminals.
    if (
      (sourceState == null && this.model.getTerminal(state.cell, true) != null) ||
      (sourceState == null && geo.getTerminalPoint(true) == null) ||
      (targetState == null && this.model.getTerminal(state.cell, false) != null) ||
      (targetState == null && geo.getTerminalPoint(false) == null)
    ) {

      this.clear(state.cell, true)

    } else {

      this.updateFixedTerminalPoints(state, sourceState, targetState)
      this.updatePoints(state, geo.points, sourceState, targetState)
      this.updateFloatingTerminalPoints(state, sourceState, targetState)

      const points = state.absolutePoints
      if (state.cell !== this.currentRoot && (
        points == null ||
        points.length < 2 ||
        points[0] == null ||
        points[points.length - 1] == null
      )) {
        // This will remove edges with invalid points from the list of
        // states in the view. Happens if the one of the terminals and
        // the corresponding terminal point is null.
        this.clear(state.cell, true)
      } else {
        this.updateEdgeBounds(state)
        this.updateEdgeLabelOffset(state)
      }
    }
  }

  /**
   * Sets the initial absolute terminal points in the given state
   * before the edge style is computed.
   */
  updateFixedTerminalPoints(
    edgeState: State,
    sourceState: State,
    targetState: State,
  ) {
    const sourceConstraint = this.graph.getConnectionConstraint(edgeState, sourceState, true)
    this.updateFixedTerminalPoint(edgeState, sourceState, true, sourceConstraint)

    const targetConstraint = this.graph.getConnectionConstraint(edgeState, targetState, false)
    this.updateFixedTerminalPoint(edgeState, targetState, false, targetConstraint)
  }

  updateFixedTerminalPoint(
    edgeState: State,
    terminalState: State,
    isSource: boolean,
    constraint: Constraint,
  ) {
    const point = this.getFixedTerminalPoint(edgeState, terminalState, isSource, constraint)
    edgeState.setAbsoluteTerminalPoint(point!, isSource)
  }

  /**
   * Returns the fixed source or target terminal point for the given edge.
   */
  protected getFixedTerminalPoint(
    edgeState: State,
    terminalState: State,
    isSource: boolean,
    constraint: Constraint,
  ) {
    let point: Point | null = null

    if (constraint != null) {
      point = this.graph.cellManager.getConnectionPoint(
        terminalState,
        constraint,
        this.graph.cellManager.isOrthogonal(edgeState),
      )
    }

    // get manual specified point when no terminal connected with edge.
    if (point == null && terminalState == null) {
      const geom = edgeState.cell.getGeometry()!
      point = geom.getTerminalPoint(isSource)
      if (point != null) {
        const scale = this.scale
        const trans = this.translate
        const origin = edgeState.origin

        point = new Point(
          scale * (trans.x + point.x + origin.x),
          scale * (trans.y + point.y + origin.y),
        )
      }
    }

    return point
  }

  /**
   * Updates the absolute points in the given state using the specified array
   * of <mxPoints> as the relative points.
   *
   * Parameters:
   *
   * edge - <mxCellState> whose absolute points should be updated.
   * points - Array of <mxPoints> that constitute the relative points.
   * source - <mxCellState> that represents the source terminal.
   * target - <mxCellState> that represents the target terminal.
   */
  updatePoints(
    edge: State,
    points: Point[],
    sourceState: State,
    targetState: State,
  ) {
    if (edge != null) {
      const pts = []
      pts.push(edge.absolutePoints[0])

      const edgeFn = this.getEdgeFunction(edge, points, sourceState, targetState)
      if (edgeFn != null) {
        const src = this.getTerminalPortState(edge, sourceState, true)
        const trg = this.getTerminalPortState(edge, targetState, false)

        // Uses the stencil bounds for routing and restores after routing
        const srcBounds = this.updateBoundsFromStencil(src)
        const trgBounds = this.updateBoundsFromStencil(trg)

        edgeFn(edge, src, trg, points, pts as Point[])

        // Restores previous bounds
        if (srcBounds != null) {
          src.bounds.update(
            srcBounds.x, srcBounds.y, srcBounds.width, srcBounds.height,
          )
        }

        if (trgBounds != null) {
          trg.bounds.update(
            trgBounds.x, trgBounds.y, trgBounds.width, trgBounds.height,
          )
        }
      } else if (points != null) {
        points.forEach((p) => {
          if (p != null) {
            pts.push(this.transformControlPoint(edge, p.clone()))
          }
        })
      }

      const tmp = edge.absolutePoints
      pts.push(tmp[tmp.length - 1])

      edge.absolutePoints = pts
    }
  }

  getTerminalPortState(
    edgeState: State,
    terminalState: State,
    isSource: boolean,
  ) {
    // get port id from edge, then try to get port-cell
    const portId = isSource
      ? edgeState.style.sourcePort
      : edgeState.style.targetPort
    if (portId != null) {
      const port = this.model.getCell(portId)
      if (port != null) {
        const portState = this.getState(port)
        if (portState != null) {
          // only uses ports where a cell state exists
          return portState
        }
      }
    }

    return terminalState
  }

  /**
   * Updates the bounds of the given cell state to reflect the bounds
   * of the stencil if it has a fixed aspect and returns the previous
   * bounds as an `Rectangle` if the bounds have been modified or null
   * otherwise.
   */
  updateBoundsFromStencil(state: State) {
    let previous = null

    if (
      state != null &&
      state.shape != null &&
      state.shape.stencil != null &&
      state.shape.stencil.aspect === 'fixed'
    ) {
      previous = Rectangle.clone(state.bounds)
      const asp = state.shape.stencil!.computeAspect(
        state.shape,
        state.bounds.x,
        state.bounds.y,
        state.bounds.width,
        state.bounds.height,
      )

      state.bounds.update(
        asp.x,
        asp.y,
        state.shape.stencil.w0 * asp.width,
        state.shape.stencil.h0 * asp.height,
      )
    }

    return previous
  }

  updateFloatingTerminalPoints(
    edgeState: State,
    sourceState: State,
    targetState: State,
  ) {
    const pts = edgeState.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (pe == null && targetState != null) {
      this.updateFloatingTerminalPoint(
        edgeState, targetState, sourceState, false,
      )
    }

    if (p0 == null && sourceState != null) {
      this.updateFloatingTerminalPoint(
        edgeState, sourceState, targetState, true,
      )
    }
  }

  protected updateFloatingTerminalPoint(
    edgeState: State,
    relateState: State,
    opposeState: State,
    isSource: boolean,
  ) {
    const point = this.getFloatingTerminalPoint(
      edgeState,
      relateState,
      opposeState,
      isSource,
    )

    edgeState.setAbsoluteTerminalPoint(point!, isSource)
  }

  /**
   * Returns the floating terminal point for the given edge.
   *
   * @param edgeState whose terminal point should be returned.
   * @param relateState the terminal on "this" side of the edge.
   * @param opposeState the terminal on the other side of the edge.
   * @param isSource Boolean indicating if target is the source terminal state.
   */
  protected getFloatingTerminalPoint(
    edgeState: State,
    relateState: State,
    opposeState: State,
    isSource: boolean,
  ) {
    // tslint:disable-next-line:no-parameter-reassignment
    relateState = this.getTerminalPortState(edgeState, relateState, isSource)

    let nextPoint = this.getNextPoint(edgeState, opposeState, isSource)
    const center = relateState.bounds.getCenter()
    const rot = relateState.style.rotation || 0
    const rad = util.toRad(rot)
    if (rad !== 0) {
      // rotate with related cell
      const cos = Math.cos(-rad)
      const sin = Math.sin(-rad)
      nextPoint = util.rotatePoint(nextPoint!, cos, sin, center)
    }

    let border = edgeState.style.perimeterSpacing || 0
    border += (
      isSource
        ? edgeState.style.sourcePerimeterSpacing
        : edgeState.style.targetPerimeterSpacing
    ) || 0

    border = isNaN(border) || !isFinite(border) ? 0 : border

    const orth = this.graph.cellManager.isOrthogonal(edgeState)
    let p = this.getPerimeterPoint(
      relateState,
      nextPoint!,
      rad === 0 && orth,
      border,
    )

    if (rad !== 0) {
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)
      p = util.rotatePoint(p!, cos, sin, center)
    }

    return p
  }

  /**
   * Returns the nearest point in the list of absolute points
   * or the center of the opposite terminal.
   */
  protected getNextPoint(
    edgeState: State,
    opposeState: State,
    isSource: boolean,
  ) {
    let point = null
    const pts = edgeState.absolutePoints
    if (pts != null && pts.length >= 2) {
      const count = pts.length
      const index = isSource
        ? Math.min(1, count - 1)
        : Math.max(0, count - 2)
      point = pts[index]
    }

    if (point == null && opposeState != null) {
      point = opposeState.bounds.getCenter()
    }

    return point
  }

  /**
   * Returns an `Point` that defines the location of the intersection
   * point between the perimeter and the line between the center of
   * the shape and the given point.
   *
   * @param terminalState the source or target terminal.
   * @param nextPoint `Point` that lies outside of the given terminal.
   * @param orthogonal Specifies if the orthogonal projection onto the
   *                   perimeter should be returned. If this is false then
   *                   the intersection of the perimeter and the line between
   *                   the next and the center point is returned.
   * @param border Optional border between the perimeter and the shape.
   */
  getPerimeterPoint(
    terminalState: State,
    nextPoint: Point,
    orthogonal: boolean,
    border: number = 0,
  ) {
    let result: Point | null = null
    if (terminalState != null) {
      const perimeterFn = this.getPerimeterFunction(terminalState)
      if (perimeterFn != null && nextPoint != null) {

        const bounds = this.getPerimeterBounds(terminalState, border)
        if (bounds.width > 0 || bounds.height > 0) {

          result = nextPoint.clone()

          let flipH = false
          let flipV = false

          if (this.graph.model.isNode(terminalState.cell)) {
            flipH = terminalState.style.flipH === true
            flipV = terminalState.style.flipV === true

            if (flipH) {
              result.x = 2 * bounds.getCenterX() - result.x
            }

            if (flipV) {
              result.y = 2 * bounds.getCenterY() - result.y
            }
          }

          result = perimeterFn(bounds, terminalState, result, orthogonal)

          if (result != null) {
            if (flipH) {
              result.x = 2 * bounds.getCenterX() - result.x
            }

            if (flipV) {
              result.y = 2 * bounds.getCenterY() - result.y
            }
          }
        }
      }

      if (result == null) {
        result = this.getPoint(terminalState)
      }
    }

    return result
  }

  getPerimeterFunction(state: State) {
    let perimeter = state.style.perimeter
    if (typeof perimeter === 'string') {
      let tmp = StyleRegistry.getValue(perimeter)
      if (tmp == null && this.isAllowEval()) {
        tmp = util.evalString(perimeter)
      }

      perimeter = tmp
    }

    if (typeof perimeter === 'function') {
      return perimeter
    }

    return null
  }

  getPerimeterBounds(terminalState: State, border: number = 0) {
    if (terminalState != null) {
      // tslint:disable-next-line
      border += (terminalState.style.perimeterSpacing || 0)
    }

    return terminalState.getPerimeterBounds(border * this.scale)
  }

  /**
   * Transforms the given control point to an absolute point.
   */
  transformControlPoint(state: State, pt: Point) {
    if (state != null && pt != null) {
      const orig = state.origin

      return new Point(
        this.scale * (pt.x + this.translate.x + orig.x),
        this.scale * (pt.y + this.translate.y + orig.y),
      )
    }

    return null
  }

  /**
   * Returns true if the given edge should be routed with <mxGraph.defaultLoopStyle>
   * or the <constants.STYLE_LOOP> defined for the given edge. This implementation
   * returns true if the given edge is a loop and does not have connections constraints
   * associated.
   */
  isLoopStyleEnabled(
    edgeState: State,
    points?: Point[] | null,
    sourceState?: State | null,
    targetState?: State | null,
  ) {
    const sc = this.graph.getConnectionConstraint(edgeState, sourceState, true)
    const tc = this.graph.getConnectionConstraint(edgeState, targetState, false)

    if (
      (points == null || points.length < 2) &&
      (
        !edgeState.style.orthogonalLoop ||
        ((sc == null || sc.point == null) && (tc == null || tc.point == null))
      )
    ) {
      return sourceState != null && sourceState === targetState
    }

    return false
  }

  /**
   * Returns the edge style function to be used to render the given edge state.
   */
  getEdgeFunction(
    edgeState: State,
    points?: Point[] | null,
    sourceState?: State | null,
    targetState?: State | null,
  ) {
    let edge = this.isLoopStyleEnabled(edgeState, points, sourceState, targetState)
      ? (edgeState.style.loopStyle || this.graph.defaultLoopStyle)
      : edgeState.style.noEdgeStyle
        ? null
        : edgeState.style.edge

    // Converts string values to objects
    if (typeof edge === 'string') {
      let tmp = StyleRegistry.getValue(edge)
      if (tmp == null && this.isAllowEval()) {
        tmp = util.evalString(edge)
      }

      edge = tmp
    }

    if (typeof edge === 'function') {
      return edge
    }

    return null
  }

  getRoutingCenterX(state: State) {
    const f = state.style.routingCenterX || 0
    return state.bounds.getCenterX() + f * state.bounds.width
  }

  getRoutingCenterY(state: State) {
    const f = state.style.routingCenterY || 0
    return state.bounds.getCenterY() + f * state.bounds.height
  }

  protected isCellCollapsed(cell: Cell) {
    return this.graph.isCellCollapsed(cell)
  }

  /**
   * Returns the nearest ancestor terminal that is visible. The edge appears
   * to be connected to this terminal on the display. The result of this method
   * is cached in `CellState`.
   */
  getVisibleTerminal(edge: Cell, isSsource: boolean) {
    const model = this.graph.getModel()
    let result = this.model.getTerminal(edge, isSsource)
    let best = result

    while (result != null && result !== this.currentRoot) {
      if (
        !this.graph.isCellVisible(best) ||
        this.isCellCollapsed(result)
      ) {
        best = result
      }

      result = model.getParent(result)
    }

    // Checks if the result is valid for the current view state
    if (
      best != null &&
      (
        !model.contains(best) ||
        model.getParent(best) === model.getRoot() ||
        best === this.currentRoot
      )
    ) {
      best = null
    }

    return best
  }

  /**
   * Returns the absolute point on the edge for the given relative
   * `Geometry` as an `Point`.
   *
   * @param state The state of the parent edge.
   * @param geometry `Geometry` that represents the relative location.
   */
  getPoint(state: State, geometry?: Geometry) {
    let x = state.bounds.getCenterX()
    let y = state.bounds.getCenterY()

    if (state.segmentsLength != null && (geometry == null || geometry.relative)) {

      const cc = state.absolutePoints.length
      const gx = geometry != null ? geometry.bounds.x / 2 : 0
      const dist = Math.round((gx + 0.5) * state.totalLength)

      let segment = state.segmentsLength[0]
      let length = 0
      let index = 0

      while (dist >= Math.round(length + segment) && index < cc - 1) {
        index += 1
        length += segment
        segment = state.segmentsLength[index]
      }

      const factor = (segment === 0) ? 0 : (dist - length) / segment
      const p0 = state.absolutePoints[index - 1]
      const pe = state.absolutePoints[index]

      if (p0 != null && pe != null) {
        let gy = 0
        let offsetX = 0
        let offsetY = 0

        if (geometry != null) {
          gy = geometry.bounds.y
          const offset = geometry.offset

          if (offset != null) {
            offsetX = offset.x
            offsetY = offset.y
          }
        }

        const dx = pe.x - p0.x
        const dy = pe.y - p0.y
        const nx = (segment === 0) ? 0 : dy / segment
        const ny = (segment === 0) ? 0 : dx / segment

        x = p0.x + dx * factor + (nx * gy + offsetX) * this.scale
        y = p0.y + dy * factor - (ny * gy - offsetY) * this.scale
      }
    } else if (geometry != null) {
      const offset = geometry.offset
      if (offset != null) {
        x += offset.x
        y += offset.y
      }
    }

    return new Point(x, y)
  }

  updateEdgeBounds(state: State) {
    const points = state.absolutePoints
    const p0 = points[0]!
    const pe = points[points.length - 1]!

    if (p0.x !== pe.x || p0.y !== pe.y) {
      const dx = pe.x - p0.x
      const dy = pe.y - p0.y
      state.terminalDistance = Math.sqrt(dx * dx + dy * dy)
    } else {
      state.terminalDistance = 0
    }

    const segments = []
    let length = 0
    let pt = p0

    if (pt != null) {
      let minX = pt.x
      let minY = pt.y
      let maxX = minX
      let maxY = minY

      for (let i = 1, ii = points.length; i < ii; i += 1) {
        const p = points[i]
        if (p != null) {
          const dx = pt.x - p.x
          const dy = pt.y - p.y

          const segment = Math.sqrt(dx * dx + dy * dy)
          segments.push(segment)
          length += segment

          pt = p

          minX = Math.min(pt.x, minX)
          minY = Math.min(pt.y, minY)
          maxX = Math.max(pt.x, maxX)
          maxY = Math.max(pt.y, maxY)
        }
      }

      state.segmentsLength = segments
      state.totalLength = length

      const markerSize = 1 // TODO: include marker size

      state.bounds.x = minX
      state.bounds.y = minY
      state.bounds.width = Math.max(markerSize, maxX - minX)
      state.bounds.height = Math.max(markerSize, maxY - minY)
    }
  }

  /**
   * Updates `absoluteOffset` for the given edge state. The absolute
   * offset is normally used for the position of the edge label. Is is
   * calculated from the geometry as an absolute offset from the center
   * between the two endpoints if the geometry is absolute, or as the
   * relative distance between the center along the line and the absolute
   * orthogonal distance if the geometry is relative.
   */
  updateEdgeLabelOffset(state: State) {

    state.absoluteOffset.x = state.bounds.getCenterX()
    state.absoluteOffset.y = state.bounds.getCenterY()

    const points = state.absolutePoints
    if (points != null && points.length > 0 && state.segmentsLength != null) {

      const geometry = state.cell.getGeometry()!
      if (geometry.relative) {
        const offset = this.getPoint(state, geometry)
        if (offset != null) {
          state.absoluteOffset = offset
        }
      } else {
        const p0 = points[0]
        const pe = points[points.length - 1]

        if (p0 != null && pe != null) {
          const dx = pe.x - p0.x
          const dy = pe.y - p0.y
          let x0 = 0
          let y0 = 0

          const off = geometry.offset

          if (off != null) {
            x0 = off.x
            y0 = off.y
          }

          const x = p0.x + dx / 2 + x0 * this.scale
          const y = p0.y + dy / 2 + y0 * this.scale

          state.absoluteOffset.x = x
          state.absoluteOffset.y = y
        }
      }
    }
  }

  /**
   * Gets the relative point that describes the given, absolute label
   * position for the given edge state.
   *
   * @param edgeState The state of the edge.
   * @param x Specifies the x-coordinate of the absolute label location.
   * @param y Specifies the y-coordinate of the absolute label location.
   */
  getRelativePoint(edgeState: State, x: number, y: number) {
    const geometry = edgeState.cell.getGeometry()
    if (geometry != null) {
      const pointCount = edgeState.absolutePoints.length

      if (geometry.relative && pointCount > 1) {
        const totalLength = edgeState.totalLength
        const segments = edgeState.segmentsLength

        // Works which line segment the point of the label is closest to
        let p0 = edgeState.absolutePoints[0]!
        let pe = edgeState.absolutePoints[1]!
        let minDist = util.ptSegmentDist(p0.x, p0.y, pe.x, pe.y, x, y)

        let tmp = 0
        let index = 0
        let length = 0

        for (let i = 2; i < pointCount; i += 1) {
          tmp += segments[i - 2]
          pe = edgeState.absolutePoints[i]!
          const dist = util.ptSegmentDist(p0.x, p0.y, pe.x, pe.y, x, y)

          if (dist <= minDist) {
            minDist = dist
            index = i - 1
            length = tmp
          }

          p0 = pe
        }

        const seg = segments[index]
        p0 = edgeState.absolutePoints[index]!
        pe = edgeState.absolutePoints[index + 1]!

        const x2 = p0.x
        const y2 = p0.y

        const x1 = pe.x
        const y1 = pe.y

        let px = x
        let py = y

        const xSegment = x2 - x1
        const ySegment = y2 - y1

        px -= x1
        py -= y1
        let projlenSq = 0

        px = xSegment - px
        py = ySegment - py
        const dotprod = px * xSegment + py * ySegment

        if (dotprod <= 0.0) {
          projlenSq = 0
        } else {
          projlenSq = dotprod * dotprod / (xSegment * xSegment + ySegment * ySegment)
        }

        let projlen = Math.sqrt(projlenSq)

        if (projlen > seg) {
          projlen = seg
        }

        let yDistance = Math.sqrt(
          util.ptSegmentDist(p0.x, p0.y, pe.x, pe.y, x, y),
        )
        const direction = util.relativeCcw(p0.x, p0.y, pe.x, pe.y, x, y)
        if (direction === -1) {
          yDistance = -yDistance
        }

        // Constructs the relative point for the label
        return new Point(
          ((totalLength / 2 - length - projlen) / totalLength) * -2,
          yDistance / this.scale,
        )
      }
    }

    return new Point()
  }

  // #endregion

  // #region ::::::::::::::: Cell State ::::::::::::::

  createState(cell: Cell) {
    return new State(this, cell, this.graph.getCellStyle(cell))
  }

  removeState(cell: Cell) {
    const state = this.states.get(cell)
    if (state != null) {
      state.invalid = true
      state.destroy()
      this.states.delete(cell)
    }
    return state
  }

  getState(cell: Cell | null, create: boolean = false) {
    let state = null
    if (cell != null) {
      state = this.states.get(cell) || null

      if (
        create &&
        (state == null || this.updateStyle) &&
        this.graph.isCellVisible(cell)
      ) {
        if (state == null) {
          state = this.createState(cell)
          this.states.set(cell, state)
        } else {
          state.style = this.graph.getCellStyle(cell)
        }
      }
    }

    return state
  }

  /**
   * Removes the state of the given cell and all descendants
   * if the given cell is not the current root.
   */
  clear(
    cell: Cell | null = this.model.getRoot(),
    force: boolean = false,
    recurse: boolean = true,
  ) {
    if (cell) {
      this.removeState(cell)

      if (recurse && (force || cell !== this.currentRoot)) {
        cell.eachChild(child => this.clear(child, force, true))
      } else {
        this.invalidate(cell)
      }
    }
  }

  /**
   * Returns `CellState` for the given array of `Cells`. The array
   * contains all states that are not null, that is, the returned
   * array may have less elements than the given array. If no argument
   * is given, then this returns `this.states`.
   */
  getCellStates(cells?: Cell[]) {
    if (cells == null) {
      return this.states
    }

    const result: State[] = []

    cells.forEach((cell) => {
      const state = this.getState(cell)
      if (state != null) {
        result.push(state)
      }
    })

    return result
  }

  // #endregion

  // #region ::::::::::::::::: Init ::::::::::::::::::

  /**
   * Initializes the graph event dispatch loop for the specified
   * container and create the required DOM nodes for the display.
   */
  init() {
    this.installListeners()
    if (this.graph.dialect === constants.DIALECT_SVG) {
      this.initSvgPanes()
    } else {
      this.initHtmlPanes()
    }
  }

  protected mouseMoveHandler: ((e: MouseEvent) => void) | null
  protected mouseUpHandler: ((e: MouseEvent) => void) | null

  protected installListeners() {
    const graph = this.graph
    const container = graph.container

    if (container != null) {
      // Support for touch device gestures (eg. pinch to zoom)
      if (detector.SUPPORT_TOUCH) {
        DomEvent.addListener(container, 'gesturestart', (e: MouseEvent) => {
          graph.fireGestureEvent(e)
          DomEvent.consume(e)
        })

        DomEvent.addListener(container, 'gesturechange', (e: MouseEvent) => {
          graph.fireGestureEvent(e)
          DomEvent.consume(e)
        })

        DomEvent.addListener(container, 'gestureend', (e: MouseEvent) => {
          graph.fireGestureEvent(e)
          DomEvent.consume(e)
        })
      }

      // Adds basic listeners for graph event dispatching
      DomEvent.addMouseListeners(
        container,
        (e: MouseEvent) => {
          // Condition to avoid scrollbar events starting
          // a rubberband selection
          if (
            this.isContainerEvent(e) &&
            (
              (
                !detector.IS_IE &&
                !detector.IS_IE11 &&
                !detector.IS_CHROME &&
                !detector.IS_OPERA &&
                !detector.IS_SAFARI
              ) ||
              !this.isScrollEvent(e)
            )
          ) {
            graph.fireMouseEvent(DomEvent.MOUSE_DOWN, new CustomMouseEvent(e))
          }
        },
        (e: MouseEvent) => {
          if (this.isContainerEvent(e)) {
            graph.fireMouseEvent(DomEvent.MOUSE_MOVE, new CustomMouseEvent(e))
          }
        },
        (e: MouseEvent) => {
          if (this.isContainerEvent(e)) {
            graph.fireMouseEvent(DomEvent.MOUSE_UP, new CustomMouseEvent(e))
          }
        },
      )

      // Adds listener for double click handling on background, this does
      // always use native event handler, we assume that the DOM of the
      // background does not change during the double click
      DomEvent.addListener(container, 'dblclick', (e: MouseEvent) => {
        if (this.isContainerEvent(e)) {
          graph.eventloop.dblClick(e)
        }
      })

      // Workaround for touch events which started on some DOM node
      // on top of the container, in which case the cells under the
      // mouse for the move and up events are not detected.
      const getState = (e: MouseEvent) => {
        let state = null

        // Workaround for touch events which started on some DOM node
        // on top of the container, in which case the cells under the
        // mouse for the move and up events are not detected.
        if (detector.SUPPORT_TOUCH) {
          const x = DomEvent.getClientX(e)
          const y = DomEvent.getClientY(e)

          // Dispatches the drop event to the graph which
          // consumes and executes the source function
          const pt = util.clientToGraph(container, x, y)
          state = graph.view.getState(graph.getCellAt(pt.x, pt.y))
        }

        return state
      }

      // Adds basic listeners for graph event dispatching outside of
      // the container and finishing the handling of a single gesture
      // Implemented via graph event dispatch loop to avoid duplicate
      // events in Firefox and Chrome
      graph.addMouseListener({
        mouseDown() { graph.popupMenuHandler.hideMenu() },
        mouseMove() { },
        mouseUp() { },
      })

      // Hides tooltips and resets tooltip timer if mouse leaves container
      DomEvent.addListener(container, 'mouseleave', () => {
        graph.tooltipHandler.hide()
      })

      this.mouseMoveHandler = (e: MouseEvent) => {
        // Hides the tooltip if mouse is outside container
        if (
          graph.tooltipHandler != null &&
          graph.tooltipHandler.hideOnHover
        ) {
          graph.tooltipHandler.hide()
        }

        if (
          this.shouldHandleDocumentEvent(e) &&
          !DomEvent.isConsumed(e)
        ) {
          this.graph.fireMouseEvent(
            DomEvent.MOUSE_MOVE, new CustomMouseEvent(e, getState(e)),
          )
        }
      }

      this.mouseUpHandler = (e: MouseEvent) => {
        if (this.shouldHandleDocumentEvent(e)) {
          this.graph.fireMouseEvent(
            DomEvent.MOUSE_UP, new CustomMouseEvent(e),
          )
        }
      }

      DomEvent.addMouseListeners(
        document,
        null,
        this.mouseMoveHandler,
        this.mouseUpHandler,
      )
    }
  }

  protected shouldHandleDocumentEvent(e: MouseEvent) {
    return (
      this.captureDocumentGesture &&
      this.graph.eventloop.isMouseDown &&
      this.isContainerVisible() &&
      !this.isContainerEvent(e)
    )
  }

  protected isContainerVisible() {
    return (
      this.graph.container != null &&
      this.graph.container.style.display !== 'none' &&
      this.graph.container.style.visibility !== 'hidden'
    )
  }

  /**
   * Returns true if the event origin is one of the
   * drawing panes or containers of the view.
   */
  protected isContainerEvent(e: MouseEvent) {
    const source = DomEvent.getSource(e)
    return (
      source === this.graph.container ||
      source.parentNode === this.backgroundPane ||
      (
        source.parentNode != null &&
        source.parentNode.parentNode === this.backgroundPane
      ) ||
      source === this.stage ||
      source === this.stage!.parentNode ||
      source === this.backgroundPane ||
      source === this.drawPane ||
      source === this.overlayPane ||
      source === this.decoratorPane
    )
  }

  /**
   * Returns true if the event origin is one of the scrollbars of the
   * container in IE. Such events are ignored.
   */
  protected isScrollEvent(e: MouseEvent) {
    const offset = util.getOffset(this.graph.container)
    const pt = new Point(e.clientX - offset.x, e.clientY - offset.y)

    const outWidth = this.graph.container.offsetWidth
    const inWidth = this.graph.container.clientWidth

    if (outWidth > inWidth && pt.x > inWidth + 2 && pt.x <= outWidth) {
      return true
    }

    const outHeight = this.graph.container.offsetHeight
    const inHeight = this.graph.container.clientHeight

    if (outHeight > inHeight && pt.y > inHeight + 2 && pt.y <= outHeight) {
      return true
    }

    return false
  }

  protected initHtmlPanes() {
    const container = this.graph.container
    if (container != null) {
      this.stage = this.createHtmlPane('100%', '100%')
      this.stage.style.overflow = 'hidden'

      // Uses minimal size for inner DIVs on Canvas. This is required
      // for correct event processing in IE. If we have an overlapping
      // DIV then the events on the cells are only fired for labels.
      this.backgroundPane = this.createHtmlPane('1px', '1px')
      this.drawPane = this.createHtmlPane('1px', '1px')
      this.overlayPane = this.createHtmlPane('1px', '1px')
      this.decoratorPane = this.createHtmlPane('1px', '1px')

      this.stage.appendChild(this.backgroundPane)
      this.stage.appendChild(this.drawPane)
      this.stage.appendChild(this.overlayPane)
      this.stage.appendChild(this.decoratorPane)

      container.appendChild(this.stage)
      this.updateContainerStyle(container)

      // Implements minWidth/minHeight in quirks mode
      if (detector.IS_QUIRKS) {
        DomEvent.addListener(window, 'resize', () => {
          const bounds = this.getGraphBounds()
          const width = bounds.x + bounds.width + this.graph.border
          const height = bounds.y + bounds.height + this.graph.border
          this.updateHtmlStageSize(width, height)
        })
      }
    }
  }

  protected createHtmlPane(width?: string, height?: string) {
    const div = document.createElement('div')
    if (width != null && height != null) {
      div.style.position = 'absolute'
      div.style.left = '0px'
      div.style.top = '0px'
      div.style.width = width
      div.style.height = height
    } else {
      div.style.position = 'relative'
    }

    return div
  }

  updateHtmlStageSize(width: number, height: number) {
    if (this.graph.container != null && this.stage != null) {
      const ow = this.graph.container.offsetWidth
      const oh = this.graph.container.offsetHeight

      if (ow < width) {
        this.stage.style.width = `${width}px`
      } else {
        this.stage.style.width = '100%'
      }

      if (oh < height) {
        this.stage.style.height = `${height}px`
      } else {
        this.stage.style.height = '100%'
      }
    }
  }

  protected initSvgPanes() {
    const container = this.graph.container

    this.stage = this.createSvgPane()
    this.backgroundPane = this.createSvgPane()
    this.drawPane = this.createSvgPane()
    this.overlayPane = this.createSvgPane()
    this.decoratorPane = this.createSvgPane()

    this.stage.appendChild(this.backgroundPane)
    this.stage.appendChild(this.drawPane)
    this.stage.appendChild(this.overlayPane)
    this.stage.appendChild(this.decoratorPane)

    const root = document.createElementNS(constants.NS_SVG, 'svg') as SVGElement
    root.style.left = '0px'
    root.style.top = '0px'
    root.style.width = '100%'
    root.style.height = '100%'
    root.style.display = 'block'
    root.appendChild(this.stage)

    if (detector.IS_IE || detector.IS_IE11) {
      root.style.overflow = 'hidden'
    }

    if (container != null) {
      container.appendChild(root)
      this.updateContainerStyle(container)
    }
  }

  protected createSvgPane() {
    return document.createElementNS(constants.NS_SVG, 'g') as SVGGElement
  }

  protected updateContainerStyle(container: HTMLElement) {
    const position = util.getCurrentStyle(container, 'position')
    if (position === 'static') {
      container.style.position = 'relative'
    }

    // Disables built-in pan and zoom in IE10 and later
    if (detector.SUPPORT_POINTER) {
      container.style.touchAction = 'none'
    }
  }

  /**
   * Returns the DOM node that contains the `backgroundPane`, `drawPane`,
   * `overlayPane` and `decoratorPane`.
   *
   * In SVG dialect, it'is a SVGGElement.
   */
  getStage() {
    return this.stage
  }

  getBackgroundPane() {
    return this.backgroundPane
  }

  getDrawPane() {
    return this.drawPane
  }

  getOverlayPane() {
    return this.overlayPane
  }

  getDecoratorPane() {
    return this.decoratorPane
  }

  dispose() {
    if (this.disposed) {
      return
    }

    let stage: SVGSVGElement | HTMLDivElement | null =
      (this.stage != null)
        ? (this.stage as SVGElement).ownerSVGElement
        : null

    if (stage == null) {
      stage = this.stage as HTMLDivElement
    }

    if (stage != null) {
      this.clear(this.currentRoot, true)

      DomEvent.removeMouseListeners(
        document,
        null,
        this.mouseMoveHandler,
        this.mouseUpHandler,
      )

      DomEvent.release(this.graph.container)
      util.removeElement(stage)

      this.mouseMoveHandler = null
      this.mouseUpHandler = null

      this.stage = null
      this.backgroundPane = null
      this.drawPane = null
      this.overlayPane = null
      this.decoratorPane = null
    }

    super.dispose()
  }

  // #endregion
}

export namespace View {
  export const events = {
    undo: 'undo',
    scale: 'scale',
    translate: 'translate',
    scaleAndTranslate: 'scaleAndTranslate',
    up: 'up',
    down: 'down',
  }
}
