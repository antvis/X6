import { Point } from '../geometry'
import { Cell } from '../core/cell'
import { State } from '../core/state'
import { Route } from '../route'
import { Anchor } from '../struct'
import { BaseManager } from './base-manager'

export class ConnectionManager extends BaseManager {
  connectCell(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    anchor?: Anchor,
  ) {
    this.model.batchUpdate(() => {
      const previous = this.model.getTerminal(edge, isSource)
      this.graph.trigger('cell:connecting', {
        edge,
        terminal,
        isSource,
        anchor,
        previous,
      })

      this.cellConnected(edge, terminal, isSource, anchor)
    })
    return edge
  }

  cellConnected(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    anchor?: Anchor,
  ) {
    if (edge != null) {
      this.model.batchUpdate(() => {
        const previous = this.model.getTerminal(edge, isSource)

        // Updates the anchor
        this.setConnectionAnchor(edge, terminal, isSource, anchor)

        // Checks if the new terminal is a port, uses the ID of the port
        // in the style and the parent of the port as the actual terminal
        // of the edge.
        if (this.graph.isPortsEnabled()) {
          let id = null

          if (terminal != null && this.graph.isPort(terminal)) {
            id = terminal.getId()
            // tslint:disable-next-line
            terminal = this.graph.getTerminalForPort(terminal, isSource)!
          }

          if (id != null) {
            const key = isSource ? 'sourcePort' : 'targetPort'
            this.graph.updateCellsStyle(key, id, [edge])
          }
        }

        this.model.setTerminal(edge, terminal, isSource)

        if (this.graph.resetEdgesOnConnect) {
          this.graph.resetEdge(edge)
        }

        this.graph.trigger('cell:connected', {
          edge,
          terminal,
          isSource,
          previous,
          anchor,
        })
      })
    }
  }

  getConnectionAnchor(
    edgeState: State,
    terminalState?: State | null,
    isSource: boolean = false,
  ) {
    let point: Point | null = null
    const style = edgeState.style

    // connection point specified in style
    const x = isSource ? style.sourceAnchorX : style.targetAnchorX
    if (x != null) {
      const y = isSource ? style.sourceAnchorY : style.targetAnchorY
      if (y != null) {
        point = new Point(x, y)
      }
    }

    let dx = 0
    let dy = 0
    let perimeter = true

    if (point != null) {
      perimeter =
        (isSource ? style.sourcePerimeter : style.targetPerimeter) !== false

      // Add entry/exit offset
      dx = (isSource ? style.sourceAnchorDx : style.targetAnchorDx) as number
      dy = (isSource ? style.sourceAnchorDy : style.targetAnchorDy) as number

      dx = isFinite(dx) ? dx : 0
      dy = isFinite(dy) ? dy : 0
    }

    return new Anchor({
      dx,
      dy,
      perimeter,
      x: point != null ? point.x : null,
      y: point != null ? point.y : null,
    })
  }

  setConnectionAnchor(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    anchor?: Anchor | null,
  ) {
    if (anchor != null) {
      this.model.batchUpdate(() => {
        if (anchor == null || anchor.position == null) {
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorX' : 'targetAnchorX',
            null,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorY' : 'targetAnchorY',
            null,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorDx' : 'targetAnchorDx',
            null,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorDx' : 'targetAnchorDy',
            null,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourcePerimeter' : 'targetPerimeter',
            null,
            [edge],
          )
        } else if (anchor.position != null) {
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorX' : 'targetAnchorX',
            `${anchor.position.x}`,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorY' : 'targetAnchorY',
            `${anchor.position.y}`,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorDx' : 'targetAnchorDx',
            `${anchor.dx}`,
            [edge],
          )
          this.graph.updateCellsStyle(
            isSource ? 'sourceAnchorDx' : 'targetAnchorDy',
            `${anchor.dy}`,
            [edge],
          )

          // Only writes `false` since `true` is default
          if (!anchor.perimeter) {
            this.graph.updateCellsStyle(
              isSource ? 'sourcePerimeter' : 'targetPerimeter',
              false,
              [edge],
            )
          } else {
            this.graph.updateCellsStyle(
              isSource ? 'sourcePerimeter' : 'targetPerimeter',
              null,
              [edge],
            )
          }
        }
      })
    }
  }

  disconnectGraph(cells: Cell[]) {
    if (cells != null) {
      this.model.batchUpdate(() => {
        const s = this.view.scale
        const t = this.view.translate

        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(c => dict.set(c, true))

        cells.forEach(edge => {
          if (this.model.isEdge(edge)) {
            let geo = this.model.getGeometry(edge)
            if (geo != null) {
              const state = this.view.getState(edge)
              const pstate = this.view.getState(this.model.getParent(edge))

              if (state != null && pstate != null) {
                geo = geo.clone()

                const dx = -pstate.origin.x
                const dy = -pstate.origin.y
                const pts = state.absolutePoints

                let src = this.model.getTerminal(edge, true)
                if (
                  src != null &&
                  this.graph.isCellDisconnectable(edge, src, true)
                ) {
                  while (src != null && !dict.get(src)) {
                    src = this.model.getParent(src)
                  }

                  if (src == null) {
                    geo.setTerminalPoint(
                      new Point(
                        pts[0]!.x / s - t.x + dx,
                        pts[0]!.y / s - t.y + dy,
                      ),
                      true,
                    )
                    this.model.setTerminal(edge, null, true)
                  }
                }

                let trg = this.model.getTerminal(edge, false)
                if (
                  trg != null &&
                  this.graph.isCellDisconnectable(edge, trg, false)
                ) {
                  while (trg != null && !dict.get(trg)) {
                    trg = this.model.getParent(trg)
                  }

                  if (trg == null) {
                    const n = pts.length - 1
                    geo.setTerminalPoint(
                      new Point(
                        pts[n]!.x / s - t.x + dx,
                        pts[n]!.y / s - t.y + dy,
                      ),
                      false,
                    )
                    this.model.setTerminal(edge, null, false)
                  }
                }

                this.model.setGeometry(edge, geo)
              }
            }
          }
        })
      })
    }
  }

  /**
   * Returns true if perimeter points should be computed such that the
   * resulting edge has only horizontal or vertical segments.
   */
  isOrthogonal(state: State) {
    const orthogonal = state.style.orthogonal
    if (orthogonal != null) {
      return orthogonal
    }

    const route = this.view.getRoute(state)
    return (
      route === Route.segment ||
      route === Route.elbow ||
      route === Route.sideToSide ||
      route === Route.topToBottom ||
      route === Route.er ||
      route === Route.orth
    )
  }

  /**
   * Returns true if the given cell state is a loop.
   */
  isLoop(state: State) {
    const src = state.getVisibleTerminalState(true)
    const trg = state.getVisibleTerminalState(false)

    return src != null && src === trg
  }

  getConnectableAnchors(cell: Cell, isSource: boolean = false) {
    const items = this.graph.getAnchors(cell, isSource)
    if (items != null) {
      return items
        .map(item => (item instanceof Anchor ? item : new Anchor(item)))
        .filter(anchor => this.graph.isAnchorConnectable(cell, anchor))
    }

    return null
  }
}
