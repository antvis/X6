import { Style } from '../../types'
import { View } from '../../core/view'
import { Point } from '../../struct'
import { MouseHandler } from '../handler-mouse'
import { Graph, Model, Cell, Geometry } from '../../core'
import { DomEvent, MouseEventEx, Disposable } from '../../common'
import { Knobs } from './knobs'
import { Preview } from './preview'
import { ConnectionOptions } from './option'

export class ConnectionHandler extends MouseHandler {
  knobs: Knobs
  preview: Preview

  factoryMethod?: (e: { source: Cell, target: Cell, style: Style }) => Cell

  autoSelect: boolean = true
  autoCreateTarget: boolean = false

  /**
   * Specifies if single clicks should add waypoints on the new edge.
   *
   * Default is `false`.
   */
  waypointsEnabled: boolean = false

  /**
   * Specifies if the connection handler should ignore the state of the mouse
   * button when highlighting the source. Default is `false`, that is, the
   * handler only highlights the source if no button is being pressed.
   */
  ignoreMouseDown: boolean = false

  /**
   * Specifies if the actual shape of the edge state should be used for
   * the preview.
   *
   * Default is `false`.
   */
  livePreview: boolean = false

  /**
   * Specifies the cursor to be used while the handler is active.
   *
   * Default is `null`.
   */
  cursor: string | null

  /**
   * Specifies if new edges should be inserted before the source node in the
   * cell hierarchy.
   *
   * Default is `false`.
   */
  insertBeforeSource: boolean = false

  private resetHandler: (() => void) | null
  private changeHandler: (() => void) | null
  protected mouseDownCounter: number = 0

  constructor(graph: Graph) {
    super(graph)
    this.graph.addMouseListener(this)
    this.config()
    this.init()
  }

  protected config() {
    const options = this.graph.options.connection as ConnectionOptions
    this.cursor = options.cursor
    this.factoryMethod = options.createEdge
    this.autoSelect = options.autoSelect
    this.autoCreateTarget = options.autoCreateTarget
    this.waypointsEnabled = options.waypointsEnabled
    this.ignoreMouseDown = options.ignoreMouseDown
    this.livePreview = options.livePreview
    this.insertBeforeSource = options.insertBeforeSource
    this.setEnadled(options.enabled)
  }

  protected init() {
    this.knobs = new Knobs(this)
    this.preview = new Preview(this)

    // Redraws the icons if the graph changes
    this.changeHandler = () => {
      if (this.knobs.refresh()) {
        this.preview.resetConstraint()
      } else if (
        this.preview.sourceState != null &&
        this.graph.view.getState(this.preview.sourceState.cell) == null
      ) {
        this.reset()
      }
    }

    this.graph.view.on(View.events.scale, this.changeHandler)
    this.graph.view.on(View.events.translate, this.changeHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.changeHandler)
    this.graph.model.on(Model.events.change, this.changeHandler)

    // Removes the icon if we step into/up or start editing
    this.resetHandler = () => this.reset()
    this.graph.on(Graph.events.escape, this.resetHandler)
    this.graph.on(DomEvent.START_EDITING, this.resetHandler)
    this.graph.view.on(View.events.down, this.resetHandler)
    this.graph.view.on(View.events.up, this.resetHandler)
  }

  isCreateTarget(e: MouseEvent) {
    return this.autoCreateTarget
  }

  isValidSource(cell: Cell) {
    return this.graph.isValidSource(cell)
  }

  isValidTarget(cell: Cell) {
    return this.graph.isValidTarget(cell)
  }

  isConnectableCell(cell: Cell | null) {
    return this.graph.isCellConnectable(cell)
  }

  validateConnection(source: Cell, target: Cell) {
    if (!this.isValidTarget(target) || !this.isValidSource(source)) {
      return ''
    }

    return this.graph.validator.getEdgeValidationError(
      null, source, target,
    )
  }

  protected isInsertBefore(
    edge: Cell,
    source: Cell,
    target: Cell,
    evt: MouseEvent,
    dropTarget: Cell | null,
  ) {
    return this.insertBeforeSource && source !== target
  }

  mouseDown(e: MouseEventEx) {
    this.mouseDownCounter += 1

    if (
      this.isValid(e) &&
      !this.preview.isConnecting() &&
      this.preview.isStartEvent(e)
    ) {
      this.mouseDownCounter = 1
      this.preview.start(e)
      this.setGlobalCursor(this.cursor)
      this.trigger(ConnectionHandler.events.start, {
        state: this.preview.sourceState,
      })
      e.consume()
    }

    this.knobs.active()
  }

  mouseMove(e: MouseEventEx) {
    if (
      !this.isConsumed(e) &&
      (
        this.preview.isStarted() ||
        this.ignoreMouseDown ||
        !this.isMouseDown()
      )
    ) {
      // Handles special case when handler is disabled during highlight
      if (!this.isEnabled() && this.preview.currentState != null) {
        this.knobs.destroyIcons()
        this.preview.currentState = null
      }

      this.preview.process(e)

    } else {
      this.preview.resetConstraint()
    }
  }

  mouseUp(e: MouseEventEx) {
    if (!this.isConsumed(e) && this.preview.isConnecting()) {
      if (this.waypointsEnabled && !this.preview.isStopEvent(e)) {
        this.preview.addWaypoint(e, this.mouseDownCounter)
        e.consume()
        return
      }

      this.preview.execute(e)
      this.knobs.destroyIcons()
      this.resetGlobalCursor()
      e.consume()
    }

    if (this.preview.isStarted()) {
      this.reset()
    }
  }

  /**
   * Connects the given source and target using a new edge.
   *
   * @param source The source terminal.
   * @param target The target terminal.
   * @param evt - Mousedown event of the connect gesture.
   * @param dropTarget The cell under the mouse when it was released.
   */
  connect(
    source: Cell,
    target: Cell | null,
    evt: MouseEvent,
    dropTarget: Cell | null,
  ) {
    if (
      target != null ||
      this.isCreateTarget(evt) ||
      this.graph.isDanglingEdgesEnabled()
    ) {

      const model = this.graph.getModel()
      let terminalInserted = false
      let edge = null

      model.batchUpdate(() => {
        if (
          source != null &&
          target == null &&
          !this.graph.isConnectionIgnored(evt) &&
          this.isCreateTarget(evt)
        ) {
          target = this.createTargetNode(evt, source) // tslint:disable-line

          if (target != null) {
            // tslint:disable-next-line
            dropTarget = this.graph.getDropTarget([target], evt, dropTarget)!

            // Disables edges as drop targets if the target cell was created
            if (
              dropTarget == null ||
              !this.graph.getModel().isEdge(dropTarget)
            ) {
              const pstate = this.graph.view.getState(dropTarget)
              if (pstate != null) {
                const geo = model.getGeometry(target)!
                geo.bounds.x -= pstate.origin.x
                geo.bounds.y -= pstate.origin.y
              }
            } else {
              dropTarget = this.graph.getDefaultParent() // tslint:disable-line
            }

            this.graph.addCell(target, dropTarget)
            terminalInserted = true
          }
        }

        let parent = this.graph.getDefaultParent()

        // Uses the common parent of source and target or
        // the default parent to insert the edge.
        if (
          source != null &&
          target != null &&
          model.getParent(source) === model.getParent(target) &&
          model.getParent(model.getParent(source)) !== model.getRoot()
        ) {
          parent = model.getParent(source)!

          if (
            (source.geometry != null && source.geometry.relative) &&
            (target.geometry != null && target.geometry.relative)
          ) {
            parent = model.getParent(parent)!
          }
        }

        // Uses the value of the preview edge state for inserting
        // the new edge into the graph.
        let data = null
        let style = {}

        const waypoints = this.preview.waypoints
        const edgeState = this.preview.edgeState
        const sourceConstraint = this.preview.sourceConstraint
        const currentConstraint = this.preview.constraintHandler.currentConstraint

        if (edgeState != null) {
          data = edgeState.cell.data
          style = edgeState.cell.style
        }

        edge = this.insertEdge(parent, null, data, source, target!, style)

        if (edge != null) {
          // Updates the connection constraints
          this.graph.setConnectionConstraint(
            edge, source, true, sourceConstraint,
          )

          this.graph.setConnectionConstraint(
            edge, target, false, currentConstraint,
          )

          // Uses geometry of the preview edge state
          if (edgeState != null) {
            model.setGeometry(edge, edgeState.cell.geometry!)
          }

          // Inserts edge before source
          if (this.isInsertBefore(edge, source, target!, evt, dropTarget)) {
            let tmp = source

            while (tmp.parent != null && tmp.geometry != null &&
              tmp.geometry.relative && tmp.parent !== edge.parent) {
              tmp = this.graph.model.getParent(tmp)!
            }

            if (
              tmp != null &&
              tmp.parent != null &&
              tmp.parent === edge.parent
            ) {
              const parent = model.getParent(source)
              model.add(parent, edge, tmp.parent.getChildIndex(tmp))
            }
          }

          const s = this.graph.view.scale
          const t = this.graph.view.translate

          // Makes sure the edge has a non-null, relative geometry
          let geo = model.getGeometry(edge)
          if (geo == null) {
            geo = new Geometry()
            geo.relative = true
            model.setGeometry(edge, geo)
          }

          // Uses scaled waypoints in geometry
          if (waypoints != null && waypoints.length > 0) {
            geo.points = waypoints.map(p => this.preview.normalizeWaypoint(p))
          }

          if (target == null) {
            const targetPoint =
              this.preview.targetPoint || this.preview.currentPoint!
            const p = new Point(
              targetPoint.x / s - t.x,
              targetPoint.y / s - t.y,
            )

            p.x -= this.graph.tx / s
            p.y -= this.graph.ty / s

            geo.setTerminalPoint(p, false)
          }

          this.trigger(ConnectionHandler.events.connect, {
            terminalInserted,
            edge,
            terminal: target,
            target: dropTarget,
            event: evt,
          })
        }
      })

      if (this.autoSelect && edge != null) {
        this.selectCells(edge, terminalInserted ? target : null)
      }
    }
  }

  protected selectCells(edge: Cell, target: Cell | null) {
    this.graph.setSelectedCell(edge)
  }

  protected insertEdge(
    parent: Cell,
    id: string | null,
    data: any,
    source: Cell,
    target: Cell,
    style: Style,
  ) {
    if (this.factoryMethod == null) {
      return this.graph.addEdge({ parent, id, data, source, target, style })
    }

    let edge = this.createEdge(data, source, target, style)
    edge = this.graph.addEdge(edge, parent, source, target)

    return edge
  }

  protected createEdge(data: any, source: Cell, target: Cell, style: Style) {
    let edge = null

    // Creates a new edge using the factoryMethod
    if (this.factoryMethod != null) {
      edge = this.factoryMethod({ source, target, style })
    }

    if (edge == null) {
      edge = new Cell(data)
      edge.asEdge(true)
      edge.setStyle(style)
      const geo = new Geometry()
      geo.relative = true
      edge.setGeometry(geo)
    }

    return edge
  }

  protected createTargetNode(evt: MouseEvent, source: Cell) {
    const cloned = this.graph.cloneCell(source)
    const geo = this.graph.model.getGeometry(cloned)

    if (geo != null) {
      const t = this.graph.view.translate
      const s = this.graph.view.scale
      const p = new Point(
        this.preview.currentPoint!.x / s - t.x,
        this.preview.currentPoint!.y / s - t.y,
      )
      geo.bounds.x = Math.round(p.x - geo.bounds.width / 2 - this.graph.tx / s)
      geo.bounds.y = Math.round(p.y - geo.bounds.height / 2 - this.graph.ty / s)

      // Aligns with source if within certain tolerance
      const tol = this.getAlignmentTolerance(evt)
      if (tol > 0) {
        const sourceState = this.graph.view.getState(source)
        if (sourceState != null) {
          const x = sourceState.bounds.x / s - t.x
          const y = sourceState.bounds.y / s - t.y

          if (Math.abs(x - geo.bounds.x) <= tol) {
            geo.bounds.x = Math.round(x)
          }

          if (Math.abs(y - geo.bounds.y) <= tol) {
            geo.bounds.y = Math.round(y)
          }
        }
      }
    }

    return cloned
  }

  protected getAlignmentTolerance(evt: MouseEvent) {
    return (this.graph.isGridEnabled())
      ? this.graph.gridSize / 2
      : this.graph.tolerance
  }

  protected reset() {
    this.preview.reset()
    this.knobs.destroyIcons()
    this.mouseDownCounter = 0
  }

  @Disposable.aop()
  dispose() {
    this.preview.dispose()
    this.knobs.dispose()
    this.graph.removeMouseListener(this)

    if (this.changeHandler != null) {
      this.graph.model.off(null, this.changeHandler)
      this.graph.view.off(null, this.changeHandler)
      this.changeHandler = null
    }

    if (this.resetHandler != null) {
      this.graph.off(null, this.resetHandler)
      this.graph.view.off(null, this.resetHandler)
      this.resetHandler = null
    }
  }
}

export namespace ConnectionHandler {
  export const events = {
    start: 'start',
    connect: 'connect',
  }
}
