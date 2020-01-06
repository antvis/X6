import { Point, Line, Rectangle } from '../geometry'
import { Platform, NumberExt } from '../util'
import { DomEvent, DomUtil } from '../dom'
import { Basecoat } from '../entity'
import { Cell } from './cell'
import { State } from './state'
import { Graph } from '../graph'
import { Route } from '../route'
import { NodeType } from '../enum'
import { Geometry } from './geometry'
import { Perimeter } from '../perimeter'
import { RectangleShape } from '../shape'
import { UndoableEdit, CurrentRootChange } from '../change'
import { Anchor } from '../struct'
import { MouseEventEx } from '../handler'

export class View extends Basecoat<View.EventArgs> {
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
   * Specifies if the style should be updated in each validation step.
   * If this is `false` then the style is only updated if the state
   * is created or if the style of the cell was changed.
   *
   * Default is `false`.
   */
  updateStyle: boolean = false

  protected stage: HTMLElement | SVGGElement | null
  protected backgroundPane: HTMLElement | SVGGElement | null
  protected drawPane: HTMLElement | SVGGElement | null
  protected decoratorPane: HTMLElement | SVGGElement | null
  protected overlayPane: HTMLElement | SVGGElement | null

  protected states: WeakMap<Cell, State>
  protected backgroundPageShape: RectangleShape | null
  protected readonly invalidatings: WeakSet<Cell>

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
   * `eval`.
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

  // #region ::::::::::: Bounds & Bouding ::::::::::::

  protected graphBounds: Rectangle

  getGraphBounds() {
    return this.graphBounds
  }

  setGraphBounds(bounds: Rectangle) {
    this.graphBounds = bounds
  }

  /**
   * Returns the union of all state's bounds for the given `Cell`s.
   *
   * @param cells Array of `Cell` whose bounds should be returned.
   */
  getBounds(cells: Cell[]): Rectangle | null {
    let result: Rectangle | null = null

    if (cells != null && cells.length > 0) {
      const model = this.graph.getModel()
      cells.forEach(cell => {
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
   * Returns the bounding box of the shape and the label for the given
   * `State` and its children if recurse is true. A bouding box is the
   * smallest rectangle that includes all pixels of the shape.
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
        state.cell.eachChild(child => {
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

  // #endregion

  // #region ::::::::::: Translate & Scale :::::::::::

  getScale() {
    return this.scale
  }

  setScale(scale: number) {
    const previousScale = this.scale
    if (this.scale !== scale) {
      this.scale = scale
      this.scaledOrTranslated()
      const args = { scale, previousScale }
      this.trigger('scale', args)
      this.graph.trigger('scale', args)
    }
  }

  getTranslate() {
    return this.translate
  }

  setTranslate(tx: number, ty: number) {
    if (this.translate.x !== tx || this.translate.y !== ty) {
      const previousTranslate = this.translate.clone()

      this.translate.x = tx
      this.translate.y = ty

      this.scaledOrTranslated()

      const args = {
        previousTranslate,
        translate: this.translate,
      }
      this.trigger('translate', args)
      this.graph.trigger('translate', args)
    }
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
      const args = {
        scale,
        previousScale,
        previousTranslate,
        translate: this.translate,
      }
      this.trigger('scaleAndTranslate', args)
      this.graph.trigger('scaleAndTranslate', args)
    }
  }

  protected scaledOrTranslated() {
    this.revalidate()
    this.graph.sizeDidChange()
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
   * Invalidates the state of the given cell, all its descendants and
   * connected edges.
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
    this.updateTranslate()
    this.resetValidationState()
    const root = cell || this.currentRoot || this.graph.model.getRoot()
    const state = this.validateCellState(this.validateCell(root))
    const bounds = this.getBoundingBox(state)
    this.setGraphBounds(bounds || this.getEmptyBounds())
    this.validateBackground()
    this.resetValidationState()
  }

  /**
   * Recursively creates the cell state for the given cell if visible
   * is `true` and the given cell is visible. If the cell is not visible
   * but the state exists then it is removed.
   */
  protected validateCell(cell: Cell, visible: boolean = true) {
    if (cell != null) {
      visible = visible && this.graph.isCellVisible(cell) // tslint:disable-line
      const state = this.getState(cell, visible)
      if (state != null && !visible) {
        // remove unvisible cell's state
        this.removeState(cell)
      } else {
        cell.eachChild(child => {
          const childVisible =
            visible &&
            (!this.graph.isCellCollapsed(cell) || cell === this.currentRoot)
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
          const sourceState = this.validateCellState(source, false)
          const targetState = this.validateCellState(target, false)
          state.setVisibleTerminalState(sourceState, true)
          state.setVisibleTerminalState(targetState, false)

          this.updateCellState(state)

          // repaint
          if (cell !== this.currentRoot) {
            this.graph.renderer.redraw(state, false, this.isRendering())
            state.updateCachedBounds()
          }
        }

        // recursion
        if (recurse && !state.invalid) {
          // Updates order in DOM if recursively traversing
          if (state.shape != null) {
            this.stateValidated(state)
          }

          cell.eachChild(child => this.validateCellState(child, true))
        }
      }
    }

    return state
  }

  // #endregion

  // #region ::::::::::: Update Cell State :::::::::::

  updateCellState(state: State) {
    state.totalLength = 0
    state.origin.x = 0
    state.origin.y = 0
    state.absoluteOffset.x = 0
    state.absoluteOffset.y = 0

    if (state.cell !== this.currentRoot) {
      const parent = this.model.getParent(state.cell)
      const pState = this.getState(parent)

      // inherit parent's origin
      if (pState != null && parent !== this.currentRoot) {
        state.origin.add(pState.origin)
      }

      // invoke hook
      let offset = this.graph.getChildOffset(state.cell)
      if (offset != null) {
        state.origin.add(offset)
      }

      const s = this.scale
      const t = this.translate
      const geo = this.graph.getCellGeometry(state.cell)
      if (geo != null) {
        if (!this.model.isEdge(state.cell)) {
          offset = geo.offset || new Point()

          if (geo.relative && pState != null) {
            // parent is edge
            if (this.model.isEdge(pState.cell)) {
              const origin = this.getPointOnEdge(pState, geo)
              if (origin != null) {
                state.origin.add(
                  origin.x / s - t.x - pState.origin.x,
                  origin.y / s - t.y - pState.origin.y,
                )
              }
            } else {
              // parent is node
              state.origin.add(
                (geo.bounds.x * pState.bounds.width) / s + offset.x,
                (geo.bounds.y * pState.bounds.height) / s + offset.y,
              )
            }
          } else {
            state.origin.add(geo.bounds.x, geo.bounds.y)

            // update label position
            state.absoluteOffset.x = s * offset.x
            state.absoluteOffset.y = s * offset.y
          }
        }

        state.unscaledWidth = geo.bounds.width
        state.unscaledHeight = geo.bounds.height

        // transform
        state.bounds.x = s * (t.x + state.origin.x)
        state.bounds.y = s * (t.y + state.origin.y)
        state.bounds.width = s * geo.bounds.width
        state.bounds.height = s * geo.bounds.height

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

  updateNodeState(state: State, geo: Geometry) {
    const parent = this.model.getParent(state.cell)
    const pState = this.getState(parent)

    // Apply ratation when relative and parent is node.
    if (geo.relative && pState != null && !this.model.isEdge(parent)) {
      const rot = State.getRotation(pState)
      if (rot !== 0) {
        const nodeCenter = state.bounds.getCenter()
        const parentCenter = pState.bounds.getCenter()
        const pt = Point.rotate(nodeCenter, rot, parentCenter)
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

      state.absoluteOffset.x -= lw
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

  updateEdgeState(state: State, geo: Geometry) {
    const sourceState = state.getVisibleTerminalState(true)!
    const targetState = state.getVisibleTerminalState(false)!

    // Remove edges with invalid terminals.
    if (
      (sourceState == null &&
        this.model.getTerminal(state.cell, true) != null) ||
      (targetState == null &&
        this.model.getTerminal(state.cell, false) != null) ||
      (sourceState == null && geo.getTerminalPoint(true) == null) ||
      (targetState == null && geo.getTerminalPoint(false) == null)
    ) {
      this.clear(state.cell, true)
    } else {
      // Get fixed point from anchor point or manual specified point.
      this.updateFixedTerminalPoints(state, sourceState, targetState)
      this.updateRouterPoints(state, geo.points, sourceState, targetState)
      // Get float(intersection) point when there's no fixed point.
      this.updateFloatingTerminalPoints(state, sourceState, targetState)

      const points = state.absolutePoints
      // Remove edges with invalid points.
      if (
        state.cell !== this.currentRoot &&
        (points == null ||
          points.length < 2 ||
          points[0] == null ||
          points[points.length - 1] == null)
      ) {
        this.clear(state.cell, true)
      } else {
        this.updateEdgeBounds(state)
        this.updateEdgeLabelOffset(state)
      }
    }
  }

  updateFixedTerminalPoints(
    edgeState: State,
    sourceState: State,
    targetState: State,
  ) {
    const sourceAnchor = this.graph.getConnectionAnchor(
      edgeState,
      sourceState,
      true,
    )
    this.updateFixedTerminalPoint(edgeState, sourceState, true, sourceAnchor)

    const targetAnchor = this.graph.getConnectionAnchor(
      edgeState,
      targetState,
      false,
    )
    this.updateFixedTerminalPoint(edgeState, targetState, false, targetAnchor)
  }

  updateFixedTerminalPoint(
    edgeState: State,
    terminalState: State,
    isSource: boolean,
    anchor: Anchor,
  ) {
    const point = this.getFixedTerminalPoint(
      edgeState,
      terminalState,
      isSource,
      anchor,
    )
    edgeState.setAbsoluteTerminalPoint(point!, isSource)
  }

  /**
   * Returns the fixed source or target terminal point for the given edge.
   */
  getFixedTerminalPoint(
    edgeState: State,
    terminalState: State,
    isSource: boolean,
    anchor: Anchor,
  ) {
    let point: Point | null = null

    if (anchor != null) {
      point = this.getConnectionPoint(
        terminalState,
        anchor,
        this.graph.connectionManager.isOrthogonal(edgeState),
      )
    }

    // get manual specified point when no terminal connected with edge.
    if (point == null && terminalState == null) {
      const geom = edgeState.cell.getGeometry()!
      point = geom.getTerminalPoint(isSource)
      if (point != null) {
        const s = this.scale
        const t = this.translate
        const o = edgeState.origin

        point = new Point(s * (t.x + point.x + o.x), s * (t.y + point.y + o.y))
      }
    }

    return point
  }

  /**
   * Returns the nearest point in the list of absolute points or the
   * center of the opposite terminal.
   */
  getConnectionPoint(
    terminalState: State,
    anchor: Anchor,
    round: boolean = true,
  ) {
    let result: Point | null = null

    if (terminalState != null && anchor.position != null) {
      const direction = terminalState.style.direction
      const bounds = this.getPerimeterBounds(terminalState)
      const cx = bounds.getCenter()

      let r1 = 0

      if (
        direction != null &&
        terminalState.style.anchorWithDirection !== false
      ) {
        if (direction === 'north') {
          r1 += 270
        } else if (direction === 'west') {
          r1 += 180
        } else if (direction === 'south') {
          r1 += 90
        }

        // Bounds need to be rotated by 90 degrees for further computation
        if (direction === 'north' || direction === 'south') {
          bounds.rotate90()
        }
      }

      const s = this.scale
      result = new Point(
        bounds.x + anchor.position.x * bounds.width + anchor.dx * s,
        bounds.y + anchor.position.y * bounds.height + anchor.dy * s,
      )

      // Rotation for direction before projection on perimeter
      let r2 = terminalState.style.rotation || 0

      if (anchor.perimeter) {
        if (r1 !== 0) {
          result.rotate(r1, cx)
        }

        result = this.getPerimeterPoint(terminalState, result, false)
      } else {
        r2 += r1

        if (this.model.isNode(terminalState.cell)) {
          const flipH = State.isFlipH(terminalState)
          const flipV = State.isFlipV(terminalState)

          if (flipH) {
            result.x = 2 * bounds.getCenterX() - result.x
          }

          if (flipV) {
            result.y = 2 * bounds.getCenterY() - result.y
          }
        }
      }

      // Generic rotation after projection on perimeter
      if (r2 !== 0 && result != null) {
        result.rotate(r2, cx)
      }
    }

    if (round && result != null) {
      result.x = Math.round(result.x)
      result.y = Math.round(result.y)
    }

    return result
  }

  /**
   * Updates the absolute points in the given state using the specified
   * array of `Point`s as the relative points.
   *
   * @param edgeState The edge state whose absolute points should be updated.
   * @param points Array of `Point`s that constitute the relative points.
   * @param sourceState The source terminal state.
   * @param targetState The target terminal state.
   */
  updateRouterPoints(
    edgeState: State,
    points: Point[],
    sourceState: State,
    targetState: State,
  ) {
    if (edgeState != null) {
      const pts = []

      // source connection point
      pts.push(edgeState.absolutePoints[0])

      const router = this.getRoute(edgeState, points, sourceState, targetState)

      if (router != null) {
        const sps = this.getTerminalPortState(edgeState, sourceState, true)
        const tps = this.getTerminalPortState(edgeState, targetState, false)

        // Uses the stencil bounds for routing and restores after routing
        const srcBounds = this.updateBoundsFromStencil(sps)
        const trgBounds = this.updateBoundsFromStencil(tps)

        router(edgeState, sps, tps, points, pts)

        // Restores previous bounds
        if (srcBounds != null) {
          sps.bounds.update(
            srcBounds.x,
            srcBounds.y,
            srcBounds.width,
            srcBounds.height,
          )
        }

        if (trgBounds != null) {
          tps.bounds.update(
            trgBounds.x,
            trgBounds.y,
            trgBounds.width,
            trgBounds.height,
          )
        }
      } else if (points != null) {
        points.forEach(p => {
          if (p != null) {
            pts.push(this.transformControlPoint(edgeState, p))
          }
        })
      }

      // target connection point
      const tmp = edgeState.absolutePoints
      pts.push(tmp[tmp.length - 1])

      edgeState.absolutePoints = pts
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
      previous = state.bounds.clone()
      const asp = state.shape.stencil.computeAspect(
        state.shape,
        state.bounds.x,
        state.bounds.y,
        state.bounds.width,
        state.bounds.height,
      )

      state.bounds.update(
        asp.x,
        asp.y,
        state.shape.stencil.width * asp.sx,
        state.shape.stencil.height * asp.sy,
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
        edgeState,
        targetState,
        sourceState,
        false,
      )
    }

    if (p0 == null && sourceState != null) {
      this.updateFloatingTerminalPoint(
        edgeState,
        sourceState,
        targetState,
        true,
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

    const rot = State.getRotation(relateState)
    const orth = this.graph.connectionManager.isOrthogonal(edgeState)
    const center = relateState.bounds.getCenter()

    const nextPoint = this.getNextPoint(edgeState, opposeState, isSource)
    if (rot !== 0 && nextPoint != null) {
      // rotate with related cell
      nextPoint.rotate(-rot, center)
    }

    let border = edgeState.style.perimeterSpacing || 0
    border +=
      (isSource
        ? edgeState.style.sourcePerimeterSpacing
        : edgeState.style.targetPerimeterSpacing) || 0

    border = isNaN(border) || !isFinite(border) ? 0 : border

    const p = this.getPerimeterPoint(
      relateState,
      nextPoint!,
      rot === 0 && orth,
      border,
    )

    if (rot !== 0 && p != null) {
      p.rotate(rot, center)
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
      const index = isSource ? Math.min(1, count - 1) : Math.max(0, count - 2)
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
   * @param terminalState the source or target terminal state.
   * @param nextPoint The `Point` that lies outside of the given terminal.
   * @param orthogonal Specifies if the orthogonal projection onto the
   * perimeter should be returned. If this is `false` then the intersection
   * of the perimeter and the line between the next and the center point
   * is returned.
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
            flipH = State.isFlipH(terminalState)
            flipV = State.isFlipV(terminalState)

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
        result = this.getPointOnEdge(terminalState)
      }
    }

    return result
  }

  getPerimeterFunction(state: State) {
    let perimeter = state.style.perimeter
    if (typeof perimeter === 'string') {
      perimeter = Perimeter.getPerimeter(perimeter, this.isAllowEval())
    }

    if (typeof perimeter === 'function') {
      return perimeter
    }

    return null
  }

  /**
   * Returns the `Rectangle` that should be used as the perimeter of the cell.
   */
  getPerimeterBounds(terminalState: State, border: number = 0) {
    if (terminalState != null) {
      // tslint:disable-next-line
      border += terminalState.style.perimeterSpacing || 0
    }

    return terminalState.getPerimeterBounds(border * this.scale)
  }

  /**
   * Transforms the given control point to an absolute point.
   */
  transformControlPoint(state: State, p: Point) {
    if (state != null && p != null) {
      const orig = state.origin

      return new Point(
        this.scale * (p.x + this.translate.x + orig.x),
        this.scale * (p.y + this.translate.y + orig.y),
      )
    }

    return null
  }

  isLoopStyleEnabled(
    edgeState: State,
    points?: Point[] | null,
    sourceState?: State | null,
    targetState?: State | null,
  ) {
    const sc = this.graph.getConnectionAnchor(edgeState, sourceState, true)
    const tc = this.graph.getConnectionAnchor(edgeState, targetState, false)

    if (
      (points == null || points.length < 2) &&
      (!edgeState.style.orthogonalLoop ||
        ((sc == null || sc.position == null) &&
          (tc == null || tc.position == null)))
    ) {
      return sourceState != null && sourceState === targetState
    }

    return false
  }

  /**
   * Returns the edge style function to be used to render the given edge state.
   */
  getRoute(
    edgeState: State,
    points?: Point[] | null,
    sourceState?: State | null,
    targetState?: State | null,
  ) {
    let edge = this.isLoopStyleEnabled(
      edgeState,
      points,
      sourceState,
      targetState,
    )
      ? edgeState.style.loopStyle || this.graph.defaultLoopRouter
      : edgeState.style.edge

    // Converts string values to objects
    if (typeof edge === 'string') {
      edge = Route.getRouter(edge, this.isAllowEval())
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
   * is cached in `State`.
   */
  getVisibleTerminal(edge: Cell, isSsource: boolean) {
    const model = this.graph.getModel()
    let result = this.model.getTerminal(edge, isSsource)
    let best = result

    while (result != null && result !== this.currentRoot) {
      if (!this.graph.isCellVisible(best) || this.isCellCollapsed(result)) {
        best = result
      }

      result = model.getParent(result)
    }

    // Checks if the result is valid for the current view state
    if (
      best != null &&
      (!model.contains(best) ||
        model.getParent(best) === model.getRoot() ||
        best === this.currentRoot)
    ) {
      best = null
    }

    return best
  }

  /**
   * Returns the absolute point on the edge for the given relative geometry.
   *
   * @param state The state of the parent edge.
   * @param geo `Geometry` that represents the relative location.
   */
  getPointOnEdge(state: State, geo?: Geometry) {
    let x = state.bounds.getCenterX()
    let y = state.bounds.getCenterY()

    if (state.segmentsLength != null && (geo == null || geo.relative)) {
      const gx = geo != null ? geo.bounds.x / 2 : 0
      const dist = Math.round((gx + 0.5) * state.totalLength)
      const len = state.absolutePoints.length

      let index = 0
      let length = 0
      let segment = state.segmentsLength[0]
      while (dist >= Math.round(length + segment) && index < len - 1) {
        index += 1
        length += segment
        segment = state.segmentsLength[index]
      }

      const factor = segment === 0 ? 0 : (dist - length) / segment
      const p0 = state.absolutePoints[index]
      const pe = state.absolutePoints[index + 1]

      if (p0 != null && pe != null) {
        let gy = 0
        let offsetX = 0
        let offsetY = 0

        if (geo != null) {
          gy = geo.bounds.y
          const offset = geo.offset
          if (offset != null) {
            offsetX = offset.x
            offsetY = offset.y
          }
        }

        const dx = pe.x - p0.x
        const dy = pe.y - p0.y
        const nx = segment === 0 ? 0 : dy / segment
        const ny = segment === 0 ? 0 : dx / segment

        x = p0.x + dx * factor + (nx * gy + offsetX) * this.scale
        y = p0.y + dy * factor - (ny * gy - offsetY) * this.scale
      }
    } else if (geo != null) {
      const offset = geo.offset
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

      // TODO: include marker size
      const markerSize = 1

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
        const offset = this.getPointOnEdge(state, geometry)
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
        let minDist = new Line(p0, pe).pointSquaredDistance(x, y)

        let tmp = 0
        let index = 0
        let length = 0

        for (let i = 2; i < pointCount; i += 1) {
          tmp += segments[i - 2]
          pe = edgeState.absolutePoints[i]!
          const dist = new Line(p0, pe).pointSquaredDistance(x, y)

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
          projlenSq =
            (dotprod * dotprod) / (xSegment * xSegment + ySegment * ySegment)
        }

        let projlen = Math.sqrt(projlenSq)

        if (projlen > seg) {
          projlen = seg
        }

        const line = new Line(p0, pe)
        let yDistance = line.pointDistance(x, y)
        const direction = line.relativeCcw(x, y)
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
      state.dispose()
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
   * Returns `State` for the given array of `Cells`. The array
   * contains all states that are not null, that is, the returned
   * array may have less elements than the given array.
   */
  getCellStates(cells: Cell[]) {
    const result: State[] = []

    cells.forEach(cell => {
      const state = this.getState(cell)
      if (state != null) {
        result.push(state)
      }
    })

    return result
  }

  // #endregion

  // #region :::::::::: Validate Background ::::::::::

  validateBackground() {
    this.validateBackgroundImage()
    this.validateBackgroundPage()
    this.validateBackgroundStyle()
  }

  validateBackgroundImage() {}

  validateBackgroundPage() {
    if (this.graph.pageVisible) {
      const bounds = this.getBackgroundPageBounds()
      if (this.backgroundPageShape == null) {
        let firstChild = this.graph.container.firstChild as HTMLElement
        while (firstChild && firstChild.nodeType !== NodeType.element) {
          firstChild = firstChild.nextSibling as HTMLElement
        }

        if (firstChild != null) {
          this.backgroundPageShape = new RectangleShape(bounds, '#ffffff')
          this.backgroundPageShape.scale = this.scale
          this.backgroundPageShape.dialect = 'html'
          this.backgroundPageShape.className = 'x6-page-background'
          this.backgroundPageShape.init(this.graph.container)
          this.graph.container.insertBefore(
            this.backgroundPageShape.elem!,
            firstChild,
          )
          firstChild.style.position = 'absolute'
          this.backgroundPageShape.redraw()
          this.setupBackgroundPage()
        }
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

  protected setupBackgroundPage() {
    if (this.backgroundPageShape != null) {
      // Adds listener for double click handling on background
      if (this.graph.nativeDblClickEnabled) {
        DomEvent.addListener(
          this.backgroundPageShape.elem!,
          'dblclick',
          (e: MouseEvent) => {
            this.graph.eventloopManager.dblClick(e)
          },
        )
      }

      // Adds basic listeners for graph event dispatching outside of the
      // container and finishing the handling of a single gesture
      DomEvent.addMouseListeners(
        this.backgroundPageShape.elem!,
        (e: MouseEvent) => {
          this.graph.dispatchMouseEvent(
            DomEvent.MOUSE_DOWN,
            new MouseEventEx(e),
          )
        },
        (e: MouseEvent) => {
          // Hides the tooltip if mouse is outside container
          if (
            this.graph.tooltipHandler != null &&
            this.graph.tooltipHandler.hideOnHover
          ) {
            this.graph.hideTooltip()
          }

          if (
            this.graph.eventloopManager.isMouseDown &&
            !DomEvent.isConsumed(e)
          ) {
            this.graph.dispatchMouseEvent(
              DomEvent.MOUSE_MOVE,
              new MouseEventEx(e),
            )
          }
        },
        (e: MouseEvent) => {
          this.graph.dispatchMouseEvent(DomEvent.MOUSE_UP, new MouseEventEx(e))
        },
      )
    }
  }

  validateBackgroundStyle() {
    const graph = this.graph
    const bgColor = graph.getBackgroundColor() || ''
    let bgGridImage: string = ''
    let bgPosition: string = ''

    if (
      graph.isGridEnabled() &&
      graph.isGridVisible() &&
      graph.getGridType() != null &&
      graph.getGridColor() != null
    ) {
      bgGridImage = View.createGrid({
        type: graph.getGridType(),
        size: graph.getGridSize() * this.scale,
        minSize: graph.getGridMinSize(),
        color: graph.getGridColor(),
        step: graph.getGridStep(),
      })
    }

    let ox = 0
    let oy = 0

    if (graph.getGridType() === 'line') {
      const s = this.scale
      const t = this.translate
      const phase = graph.getGridSize() * s * graph.getGridStep()
      if (this.backgroundPageShape != null) {
        const bounds = this.getBackgroundPageBounds()
        ox = 1 + bounds.x
        oy = 1 + bounds.y
      }
      ox = -Math.round(phase - NumberExt.mod(t.x * s - ox, phase))
      oy = -Math.round(phase - NumberExt.mod(t.y * s - oy, phase))
    }

    bgPosition = `${ox}px ${oy}px`

    let canvas = this.getStage()
    if ((canvas as SVGElement).ownerSVGElement != null) {
      canvas = (canvas as SVGElement).ownerSVGElement!
    }

    if (this.backgroundPageShape != null) {
      const page = this.backgroundPageShape.elem!
      page.style.backgroundColor = bgColor
      page.style.backgroundImage = bgGridImage
      page.style.backgroundPosition = bgPosition
      canvas.style.backgroundImage = ''
      canvas.style.backgroundColor = ''
      canvas.style.backgroundPosition = ''
    } else {
      canvas.style.backgroundImage = bgGridImage
      canvas.style.backgroundColor = bgColor
      canvas.style.backgroundPosition = bgPosition
    }
  }

  getBackgroundPageBounds() {
    return this.graph.infinite
      ? this.getBackgroundPageBoundsInfinite()
      : this.getBackgroundPageBoundsNormal()
  }

  x0: number
  y0: number
  protected getBackgroundPageBoundsInfinite() {
    const s = this.scale
    const t = this.translate
    const gb = this.getGraphBounds()

    // Computes unscaled, untranslated graph bounds
    const x = gb.width > 0 ? gb.x / s - t.x : 0
    const y = gb.height > 0 ? gb.y / s - t.y : 0
    const w = gb.width / s
    const h = gb.height / s

    const ps = this.graph.pageScale
    const fmt = this.graph.pageFormat
    const pw = fmt.width * ps
    const ph = fmt.height * ps

    const x0 = Math.floor(Math.min(0, x) / pw)
    const y0 = Math.floor(Math.min(0, y) / ph)
    const xe = Math.ceil(Math.max(1, x + w) / pw)
    const ye = Math.ceil(Math.max(1, y + h) / ph)

    const rows = xe - x0
    const cols = ye - y0

    return new Rectangle(
      s * (t.x + x0 * pw),
      s * (t.y + y0 * ph),
      s * rows * pw,
      s * cols * ph,
    )
  }

  protected getBackgroundPageBoundsNormal() {
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

  protected updateTranslate() {
    if (
      this.graph.infinite &&
      this.graph.container &&
      DomUtil.hasScrollbars(this.graph.container)
    ) {
      const size = this.graph.viewportManager.getPageSize()
      const padding = this.graph.viewportManager.getPagePadding()
      this.translate.x = padding[0] - (this.x0 || 0) * size.width
      this.translate.y = padding[1] - (this.y0 || 0) * size.height
    }
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
    const foreground =
      (this.model.isEdge(state.cell) && this.graph.keepEdgesInForeground) ||
      (this.model.isNode(state.cell) && this.graph.keepEdgesInBackground)
    const htmlNode = foreground
      ? this.lastForegroundHtmlNode || this.lastHtmlNode
      : this.lastHtmlNode
    const node = foreground
      ? this.lastForegroundNode || this.lastNode
      : this.lastNode

    const result = this.insertStateAfter(state, node, htmlNode)

    if (foreground) {
      this.lastForegroundHtmlNode = result[1]
      this.lastForegroundNode = result[0]
    } else {
      this.lastHtmlNode = result[1]
      this.lastNode = result[0]
    }
  }

  /**
   * Inserts the shapes of the state after the given nodes in the DOM.
   *
   * @param state The state to be inserted.
   * @param node Node in `drawPane` after which the shapes should be inserted.
   * @param htmlNode Node in the graph container after which the shapes should
   * be inserted that will not go into the `drawPane` (eg. HTML labels without
   * foreignObjects).
   */
  protected insertStateAfter(
    state: State,
    node: HTMLElement | null,
    htmlNode: HTMLElement | null,
  ) {
    const shapes = this.getShapesForState(state)
    shapes.forEach(shape => {
      if (shape != null && shape.elem != null) {
        const isHtml =
          shape.elem.parentNode !== state.view.getDrawPane() &&
          shape.elem.parentNode !== state.view.getOverlayPane()

        const temp = isHtml ? htmlNode : node

        if (temp != null && temp.nextSibling !== shape.elem) {
          // prepend
          if (temp.nextSibling == null) {
            temp.parentNode!.appendChild(shape.elem)
          } else {
            temp.parentNode!.insertBefore(shape.elem, temp.nextSibling)
          }
        } else if (temp == null) {
          const sParent = shape.elem.parentNode!

          // Special case: First HTML node should be first sibling after canvas
          if (sParent === state.view.graph.container) {
            let stage = state.view.getStage()
            while (
              stage != null &&
              stage.parentNode !== state.view.graph.container
            ) {
              stage = stage.parentNode as HTMLElement
            }

            if (stage != null && stage.nextSibling != null) {
              if (stage.nextSibling !== shape.elem) {
                sParent.insertBefore(shape.elem, stage.nextSibling)
              }
            } else {
              sParent.appendChild(shape.elem)
            }
          } else if (
            sParent.firstChild != null &&
            sParent.firstChild !== shape.elem
          ) {
            // Inserts the node as the first child of the parent
            // to implement the order
            sParent.insertBefore(shape.elem, sParent.firstChild)
          }
        }

        if (isHtml) {
          htmlNode = shape.elem as HTMLElement // tslint:disable-line
        } else {
          node = shape.elem as HTMLElement // tslint:disable-line
        }
      }
    })

    return [node, htmlNode]
  }

  private getShapesForState(state: State) {
    return [state.shape, state.text, state.control]
  }

  // #endregion

  // #region ::::::::::::::::: Init ::::::::::::::::::

  /**
   * Initializes the graph event dispatch loop for the specified
   * container and create the required DOM nodes for the display.
   */
  init() {
    this.installListeners()
    if (this.graph.dialect === 'svg') {
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

    if (container == null) {
      return
    }

    // Support for touch device gestures (eg. pinch to zoom)
    if (Platform.SUPPORT_TOUCH) {
      DomEvent.addListener(container, 'gesturestart', (e: MouseEvent) => {
        graph.eventloopManager.gesture(e)
        DomEvent.consume(e)
      })

      DomEvent.addListener(container, 'gesturechange', (e: MouseEvent) => {
        graph.eventloopManager.gesture(e)
        DomEvent.consume(e)
      })

      DomEvent.addListener(container, 'gestureend', (e: MouseEvent) => {
        graph.eventloopManager.gesture(e)
        DomEvent.consume(e)
      })
    }

    // Adds basic listeners for graph event dispatching
    DomEvent.addMouseListeners(
      container,
      (e: MouseEvent) => {
        if (
          this.isContainerEvent(e) &&
          // Avoid scrollbar events starting a rubberband selection
          ((!Platform.IS_IE &&
            !Platform.IS_IE11 &&
            !Platform.IS_CHROME &&
            !Platform.IS_OPERA &&
            !Platform.IS_SAFARI) ||
            !this.isScrollEvent(e))
        ) {
          graph.dispatchMouseEvent(DomEvent.MOUSE_DOWN, new MouseEventEx(e))
        }
      },
      (e: MouseEvent) => {
        if (this.isContainerEvent(e)) {
          graph.dispatchMouseEvent(DomEvent.MOUSE_MOVE, new MouseEventEx(e))
        }
      },
      (e: MouseEvent) => {
        if (this.isContainerEvent(e)) {
          graph.dispatchMouseEvent(DomEvent.MOUSE_UP, new MouseEventEx(e))
        }
      },
    )

    // Adds basic listeners for graph event dispatching outside of
    // the container and finishing the handling of a single gesture
    // Implemented via graph event dispatch loop to avoid duplicate
    // events in Firefox and Chrome
    graph.addHandler({
      mouseDown() {
        graph.hideContextMenu()
      },
      mouseMove() {},
      mouseUp() {},
    })

    // Adds listener for double click handling on background, this does
    // always use native event handler, we assume that the DOM of the
    // background does not change during the double click
    DomEvent.addListener(container, 'dblclick', (e: MouseEvent) => {
      if (this.isContainerEvent(e)) {
        graph.eventloopManager.dblClick(e)
      }
    })

    // Hides tooltips and resets tooltip timer if mouse leaves container
    DomEvent.addListener(container, 'mouseleave', () => {
      graph.hideTooltip()
    })

    // Workaround for touch events which started on some DOM node
    // on top of the container, in which case the cells under the
    // mouse for the move and up events are not detected.
    const getState = (e: MouseEvent) => {
      let state = null

      // Workaround for touch events which started on some DOM node
      // on top of the container, in which case the cells under the
      // mouse for the move and up events are not detected.
      if (Platform.SUPPORT_TOUCH) {
        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        const p = graph.clientToGraph(e)
        state = graph.view.getState(graph.getCellAt(p.x, p.y))
      }

      return state
    }

    this.mouseMoveHandler = (e: MouseEvent) => {
      // Hides the tooltip if mouse is outside container
      if (graph.tooltipHandler != null && graph.tooltipHandler.hideOnHover) {
        graph.hideTooltip()
      }

      if (this.shouldHandleDocumentEvent(e) && !DomEvent.isConsumed(e)) {
        this.graph.dispatchMouseEvent(
          DomEvent.MOUSE_MOVE,
          new MouseEventEx(e, getState(e)),
        )
      }
    }

    this.mouseUpHandler = (e: MouseEvent) => {
      if (this.shouldHandleDocumentEvent(e)) {
        this.graph.dispatchMouseEvent(DomEvent.MOUSE_UP, new MouseEventEx(e))
      }
    }

    DomEvent.addMouseListeners(
      document,
      null,
      this.mouseMoveHandler,
      this.mouseUpHandler,
    )
  }

  protected shouldHandleDocumentEvent(e: MouseEvent) {
    return (
      this.captureDocumentGesture &&
      this.graph.eventloopManager.isMouseDown &&
      this.isContainerVisible() &&
      !this.isContainerEvent(e)
    )
  }

  protected isContainerVisible() {
    return DomUtil.isVisible(this.graph.container)
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
      (source.parentNode != null &&
        source.parentNode.parentNode === this.backgroundPane) ||
      source === this.stage ||
      source === this.stage!.parentNode ||
      source === this.backgroundPane ||
      source === this.drawPane ||
      source === this.overlayPane ||
      source === this.decoratorPane
    )
  }

  /**
   * Returns true if the event origin is one of the scrollbars
   * of the container in IE. Such events are ignored.
   */
  protected isScrollEvent(e: MouseEvent) {
    const offset = DomUtil.getOffset(this.graph.container)
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
    }
  }

  protected createHtmlPane(width?: string, height?: string) {
    const div = DomUtil.createElement('div')
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

    const root = DomUtil.createSvgElement('svg')
    root.style.left = '0px'
    root.style.top = '0px'
    root.style.width = '100%'
    root.style.height = '100%'
    root.style.display = 'block'
    root.appendChild(this.stage)

    if (Platform.IS_IE || Platform.IS_IE11) {
      root.style.overflow = 'hidden'
    }

    if (container != null) {
      container.appendChild(root)
      this.updateContainerStyle(container)
    }
  }

  protected createSvgPane() {
    return DomUtil.createSvgElement('g') as SVGGElement
  }

  protected updateContainerStyle(container: HTMLElement) {
    const position = DomUtil.getComputedStyle(container, 'position')
    if (position === 'static') {
      container.style.position = 'relative'
    }

    // Disables built-in pan and zoom in IE10 and later
    if (Platform.SUPPORT_POINTER) {
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
    return this.stage!
  }

  getBackgroundPane() {
    return this.backgroundPane!
  }

  getDrawPane() {
    return this.drawPane!
  }

  getOverlayPane() {
    return this.overlayPane!
  }

  getDecoratorPane() {
    return this.decoratorPane!
  }

  getBackgroundPageShape() {
    return this.backgroundPageShape
  }

  setCurrentRoot(root: Cell | null) {
    if (this.currentRoot !== root) {
      const change = new CurrentRootChange(this, root)
      change.execute()
      const edit = new UndoableEdit(this.graph.getModel())
      edit.add(change)
      this.model.trigger('afterUndo', edit)
      this.graph.sizeDidChange()
    }

    return root
  }

  @Basecoat.dispose()
  dispose() {
    let stage: SVGSVGElement | HTMLDivElement | null =
      this.stage != null ? (this.stage as SVGElement).ownerSVGElement : null

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
      DomUtil.remove(stage)

      this.mouseMoveHandler = null
      this.mouseUpHandler = null

      this.stage = null
      this.backgroundPane = null
      this.drawPane = null
      this.overlayPane = null
      this.decoratorPane = null
    }
  }

  // #endregion
}

export namespace View {
  export interface ScaleArgs {
    scale: number
    previousScale: number
  }

  export interface TranslateArgs {
    translate: Point
    previousTranslate: Point
  }

  export interface ScaleAndTranslateArgs extends ScaleArgs, TranslateArgs {}

  export interface EventArgs {
    up: {
      previous: Cell | null
      currentRoot: Cell | null
    }
    down: {
      previous: Cell | null
      currentRoot: Cell | null
    }
    scale: ScaleArgs
    translate: TranslateArgs
    scaleAndTranslate: ScaleAndTranslateArgs
  }
}

export namespace View {
  export type GridType = 'line' | 'dot'

  export interface CreateGridOptions {
    id: string
    size: number
    minSize: number
    color: string
    step: number
    type: GridType
  }

  const defaults: CreateGridOptions = {
    id: 'x6-graph-grid',
    size: 10,
    step: 4,
    minSize: 4,
    color: '#e0e0e0',
    type: 'line',
  }

  export function createGrid(options: Partial<CreateGridOptions> = {}) {
    const opts: CreateGridOptions = { ...defaults, ...options }
    fixSize(opts)

    const svg =
      opts.type === 'line' ? createLineGrid(opts) : createDotGrid(opts)
    return base64(svg)
  }

  function createLineGrid(options: CreateGridOptions) {
    const gridSize = options.size
    const blockSize = options.size * options.step
    const d = []
    for (let i = 1, ii = options.step; i < ii; i += 1) {
      const tmp = i * gridSize
      d.push(
        `M 0 ${tmp} L ${blockSize} ${tmp} M ${tmp} 0 L ${tmp} ${blockSize}`,
      )
    }

    const content = `
      <path
        d="${d.join(' ')}"
        fill="none"
        opacity="0.2"
        stroke="${options.color}"
        stroke-width="1"
      />
      <path
        d="M ${blockSize} 0 L 0 0 0 ${blockSize}"
        fill="none"
        stroke="${options.color}"
        stroke-width="1"
      />
    `

    return wrap(options.id, blockSize, content)
  }

  function createDotGrid(options: CreateGridOptions) {
    const content = `<rect width="1" height="1" fill="${options.color}"/>`
    return wrap(options.id, options.size, content)
  }

  function fixSize(options: CreateGridOptions) {
    let size = options.size
    while (size < options.minSize) {
      size *= 2
    }
    options.size = size
    return size
  }

  function wrap(id: string, size: number, content: string) {
    return `<svg
        width="${size}"
        height="${size}"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <pattern
            id="${id}"
            width="${size}"
            height="${size}"
            patternUnits="userSpaceOnUse"
          >
            ${content}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#${id})"/>
      </svg>`
  }

  function base64(svg: string) {
    const img = unescape(encodeURIComponent(svg))
    return `url(data:image/svg+xml;base64,${window.btoa(img)})`
  }
}
