import { ArrayExt } from '../util'
import { Point, Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { State } from '../core/state'
import { Style } from '../types'
import { BaseManager } from './base-manager'

export class CreationManager extends BaseManager {
  render(data: Data) {
    const { nodes, edges } = data
    const nodeDataMap: { [key: string]: NodeData } = {}
    const groupIds: [string | number, string | number][] = []

    if (nodes != null) {
      nodes.forEach(n => {
        nodeDataMap[n.id] = n
        if (n.parent != null) {
          groupIds.push([n.parent, 0])
        }
      })
    }

    if (edges != null) {
      edges.forEach(n => {
        if (n.parent != null) {
          groupIds.push([n.parent, 0])
        }
      })
    }

    groupIds.forEach(arr => {
      const groupId = arr[0]
      const groupData = nodeDataMap[groupId]
      if (groupData != null && groupData.parent != null) {
        arr[1] = groupData.parent
      }
    })

    const nodeMap: { [key: string]: Cell } = {}
    const edgeMap: { [key: string]: Cell } = {}

    const renderGroups = (parentGroupId: string | number) => {
      const ids: (string | number)[] = []
      for (let i = groupIds.length - 1; i >= 0; i -= 1) {
        const sec = groupIds[i]
        if (sec[1] === parentGroupId) {
          ids.push(sec[0])
          groupIds.splice(i, 1)
        }
      }

      const parentGroup = nodeMap[parentGroupId] || null
      ids.forEach(i => {
        const { parent, id, ...dataItem } = nodeDataMap[i]
        nodeMap[i] = this.graph.addNode({
          ...dataItem,
          data: { ...nodeDataMap[i] },
          parent: parentGroup,
        })
      })

      ids.forEach(i => renderGroups(i))
    }

    this.graph.batchUpdate(() => {
      renderGroups(0)

      if (nodes != null) {
        nodes.forEach(item => {
          const { id, parent, ...dataItem } = item
          if (nodeMap[id] == null) {
            nodeMap[id] = this.graph.addNode({
              ...dataItem,
              data: { ...item },
              parent: parent ? nodeMap[parent] : undefined,
            })
          }
        })
      }

      if (edges != null) {
        edges.forEach(item => {
          const { id, parent, source, target, ...dataItem } = item
          if (edgeMap[id] == null) {
            edgeMap[id] = this.graph.addEdge({
              ...dataItem,
              data: { ...item },
              parent: parent != null ? nodeMap[parent] : undefined,
              source: source != null ? nodeMap[source] : undefined,
              target: target != null ? nodeMap[target] : undefined,
            })
          }
        })
      }
    })
  }

  addCells(
    cells: Cell[],
    parent: Cell,
    index: number,
    source?: Cell,
    target?: Cell,
  ) {
    this.model.batchUpdate(() => {
      this.graph.trigger('cells:adding', {
        cells,
        parent,
        index,
        source,
        target,
      })

      this.cellsAdded(cells, parent, index, source, target, false, true)
    })

    return cells
  }

  cellsAdded(
    cells: Cell[],
    parent: Cell,
    index: number,
    sourceNode?: Cell | null,
    targetNode?: Cell | null,
    absolute?: boolean,
    constrain?: boolean,
    extend?: boolean,
  ) {
    if (cells != null && parent != null && index != null) {
      this.model.batchUpdate(() => {
        const pState = absolute ? this.view.getState(parent) : null
        const o1 = pState != null ? pState.origin : null
        const zero = new Point(0, 0)

        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          if (cells[i] == null) {
            index -= 1 // tslint:disable-line
            continue
          }

          const oldParent = this.model.getParent(cells[i])

          // Keeps the cell at it's absolute location.
          if (o1 != null && cells[i] !== parent && parent !== oldParent) {
            const oldState = this.view.getState(oldParent)
            const o2 = oldState != null ? oldState.origin : zero
            let geo = this.model.getGeometry(cells[i])

            if (geo != null) {
              const dx = o2.x - o1.x
              const dy = o2.y - o1.y

              geo = geo.clone()
              geo.translate(dx, dy)

              if (
                !geo.relative &&
                !this.graph.isNegativeCoordinatesAllowed() &&
                this.model.isNode(cells[i])
              ) {
                geo.bounds.x = Math.max(0, geo.bounds.x)
                geo.bounds.y = Math.max(0, geo.bounds.y)
              }

              this.model.setGeometry(cells[i], geo)
            }
          }

          // Decrements all following indices if cell is already in parent
          if (
            parent === oldParent &&
            index + i > this.model.getChildCount(parent)
          ) {
            index -= 1 // tslint:disable-line
          }

          this.model.add(parent, cells[i], index + i)

          if (this.graph.autoSizeOnAdded) {
            this.graph.sizeManager.autoSizeCell(cells[i], true)
          }

          // Extends the parent or constrains the child
          if (
            (extend == null || extend) &&
            this.graph.isExtendParentsOnAdd() &&
            this.graph.isExtendParent(cells[i])
          ) {
            this.graph.sizeManager.extendParent(cells[i])
          }

          // Additionally constrains the child after extending the parent
          if (constrain == null || constrain) {
            this.graph.sizeManager.constrainChild(cells[i])
          }

          // Sets the source terminal
          if (sourceNode != null) {
            this.graph.connectionManager.cellConnected(
              cells[i],
              sourceNode,
              true,
            )
          }

          // Sets the target terminal
          if (targetNode != null) {
            this.graph.connectionManager.cellConnected(
              cells[i],
              targetNode,
              false,
            )
          }
        }

        this.graph.trigger('cells:added', {
          cells,
          parent,
          index,
          source: sourceNode,
          target: targetNode,
          absolute: absolute === true,
        })
      })
    }
  }

  duplicateCells(cells: Cell[], append: boolean) {
    const model = this.model
    const diff = this.graph.getGridSize()
    const sources = model.getTopmostCells(cells)
    const select: Cell[] = []

    model.batchUpdate(() => {
      const clones = this.cloneCells(sources, false, undefined, true)
      for (let i = 0, ii = sources.length; i < ii; i += 1) {
        const parent = model.getParent(sources[i])
        const child = this.graph.movingManager.moveCells(
          [clones[i]],
          diff,
          diff,
          false,
        )[0]

        select.push(child)

        if (append) {
          model.add(parent, clones[i])
        } else {
          const index = parent!.getChildIndex(sources[i])
          model.add(parent, clones[i], index + 1)
        }
      }
    })

    this.graph.selectCells(select)

    return select
  }

  deleteCells(
    cells: Cell[],
    includeEdges: boolean,
    selectParentAfterDelete: boolean,
  ) {
    if (cells != null && cells.length > 0) {
      const graph = this.graph
      this.graph.eventloopManager.escape(new KeyboardEvent(''))
      const parents = selectParentAfterDelete
        ? graph.model.getParents(cells)
        : null

      graph.removeCells(cells, includeEdges)

      // Selects parents for easier editing of groups
      if (parents != null) {
        const select = parents.filter(
          cell =>
            graph.model.contains(cell) &&
            (graph.model.isNode(cell) || graph.model.isEdge(cell)),
        )

        graph.selectCells(select)
      }
    }
  }

  removeCells(cells: Cell[], includeEdges: boolean) {
    let removing: Cell[]

    if (includeEdges) {
      removing = this.graph.getDeletableCells(this.addAllEdges(cells))
    } else {
      removing = cells.slice()

      // Removes edges that are currently not
      // visible as those cannot be updated
      const edges = this.graph.getDeletableCells(this.getAllEdges(cells))
      const dict = new WeakMap<Cell, boolean>()

      cells.forEach(cell => dict.set(cell, true))
      edges.forEach(edge => {
        if (this.view.getState(edge) == null && !dict.get(edge)) {
          dict.set(edge, true)
          removing.push(edge)
        }
      })
    }

    this.model.batchUpdate(() => {
      this.graph.trigger('cells:removing', {
        includeEdges,
        cells: removing,
      })
      this.cellsRemoved(removing)
    })

    return removing
  }

  /**
   * Returns an array with the given cells and all edges that are connected
   * to a cell or one of its descendants.
   */
  addAllEdges(cells: Cell[]) {
    const merged = [...cells, ...this.getAllEdges(cells)]
    return ArrayExt.uniq<Cell>(merged)
  }

  getAllEdges(cells: Cell[]) {
    const edges: Cell[] = []
    if (cells != null) {
      cells.forEach(cell => {
        cell.eachEdge(edge => edges.push(edge))
        const children = this.model.getChildren(cell)
        edges.push(...this.getAllEdges(children))
      })
    }

    return edges
  }

  cellsRemoved(cells: Cell[]) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(cell => dict.set(cell, true))
        cells.forEach(cell => {
          const edges = this.getAllEdges([cell])
          edges.forEach(edge => {
            if (!dict.get(edge)) {
              dict.set(edge, true)
              this.disconnectTerminal(cell, edge, true)
              this.disconnectTerminal(cell, edge, false)
            }
          })

          this.model.remove(cell)
        })

        this.graph.trigger('cells:removed', { cells })
      })
    }
  }

  disconnectTerminal(cell: Cell, edge: Cell, isSource: boolean) {
    const scale = this.view.scale
    const trans = this.view.translate

    let geo = this.model.getGeometry(edge)
    if (geo != null) {
      // Checks if terminal is being removed
      const terminal = this.model.getTerminal(edge, isSource)
      let connected = false
      let tmp = terminal

      while (tmp != null) {
        if (cell === tmp) {
          connected = true
          break
        }

        tmp = this.model.getParent(tmp)
      }

      if (connected) {
        geo = geo.clone()
        const state = this.view.getState(edge)

        if (state != null && state.absolutePoints != null) {
          const pts = state.absolutePoints
          const n = isSource ? 0 : pts.length - 1

          geo.setTerminalPoint(
            new Point(
              pts[n].x / scale - trans.x - state.origin.x,
              pts[n].y / scale - trans.y - state.origin.y,
            ),
            isSource,
          )
        } else {
          // fallback
          const state = this.view.getState(terminal)
          if (state != null) {
            geo.setTerminalPoint(
              new Point(
                state.bounds.getCenterX() / scale - trans.x,
                state.bounds.getCenterY() / scale - trans.y,
              ),
              isSource,
            )
          }
        }

        this.model.setGeometry(edge, geo)
        this.model.setTerminal(edge, null, isSource)
      }
    }
  }

  splitEdge(
    edge: Cell,
    cells: Cell[],
    newEdge: Cell | null,
    dx: number,
    dy: number,
  ) {
    this.model.batchUpdate(() => {
      const parent = this.model.getParent(edge)
      const source = this.model.getTerminal(edge, true)

      if (newEdge == null) {
        newEdge = this.graph.cloneCell(edge) // tslint:disable-line

        // Removes waypoints before/after new cell
        const state = this.view.getState(edge)
        let geo = this.graph.getCellGeometry(newEdge)

        if (geo != null && geo.points != null && state != null) {
          const t = this.view.translate
          const s = this.view.scale
          const idx = State.getNearestSegment(
            state,
            (dx + t.x) * s,
            (dy + t.y) * s,
          )

          geo.points = geo.points.slice(0, idx)

          geo = this.graph.getCellGeometry(edge)

          if (geo != null && geo.points != null) {
            geo = geo.clone()
            geo.points = geo.points.slice(idx)
            this.model.setGeometry(edge, geo)
          }
        }
      }

      this.graph.trigger('edge:splitting', { edge, cells, newEdge, dx, dy })

      this.graph.movingManager.cellsMoved(cells, dx, dy, false, false)

      let index = this.model.getChildCount(parent)
      this.cellsAdded(cells, parent!, index, null, null, true)

      index = this.model.getChildCount(parent)
      this.cellsAdded([newEdge], parent!, index, source, cells[0], false)
      this.graph.connectionManager.cellConnected(edge, cells[0], true)

      this.graph.trigger('edge:splitted', { edge, cells, newEdge, dx, dy })
    })

    return newEdge
  }

  cloneCells(
    cells: Cell[],
    allowInvalidEdges: boolean = true,
    mapping: WeakMap<Cell, Cell> = new WeakMap<Cell, Cell>(),
    keepPosition: boolean = false,
  ) {
    let clones: Cell[] = []
    if (cells != null) {
      // Creates a dictionary for fast lookups
      const dict = new WeakMap<Cell, boolean>()
      const tmp = []

      cells.forEach(cell => {
        dict.set(cell, true)
        tmp.push(cell)
      })

      if (tmp.length > 0) {
        const scale = this.view.scale
        const trans = this.view.translate

        clones = this.model.cloneCells(cells, true, mapping) as Cell[]

        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          if (
            !allowInvalidEdges &&
            this.model.isEdge(clones[i]!) &&
            !this.graph.isEdgeValid(
              clones[i],
              this.model.getTerminal(clones[i], true),
              this.model.getTerminal(clones[i], false),
            )
          ) {
            const tmp = clones as any
            tmp[i] = null
          } else {
            const geom = this.model.getGeometry(clones[i]!)
            if (geom != null) {
              const state = this.view.getState(cells[i])
              const pstate = this.view.getState(this.model.getParent(cells[i])!)

              if (state != null && pstate != null) {
                const dx = keepPosition ? 0 : pstate.origin.x
                const dy = keepPosition ? 0 : pstate.origin.y

                if (this.model.isEdge(clones[i])) {
                  const pts = state.absolutePoints
                  if (pts != null) {
                    // Checks if the source is cloned or sets the terminal point
                    let source = this.model.getTerminal(cells[i], true)
                    while (source != null && !dict.get(source)) {
                      source = this.model.getParent(source)
                    }

                    if (source == null && pts[0] != null) {
                      geom.setTerminalPoint(
                        new Point(
                          pts[0]!.x / scale - trans.x,
                          pts[0]!.y / scale - trans.y,
                        ),
                        true,
                      )
                    }

                    // Checks if the target is cloned or sets the terminal point
                    let target = this.model.getTerminal(cells[i], false)
                    while (target != null && !dict.get(target)) {
                      target = this.model.getParent(target)
                    }

                    const n = pts.length - 1

                    if (target == null && pts[n] != null) {
                      geom.setTerminalPoint(
                        new Point(
                          pts[n]!.x / scale - trans.x,
                          pts[n]!.y / scale - trans.y,
                        ),
                        false,
                      )
                    }

                    // Translates the control points
                    geom.points &&
                      geom.points.forEach(p => {
                        p.x += dx
                        p.y += dy
                      })
                  }
                } else {
                  geom.translate(dx, dy)
                }
              }
            }
          }
        }
      }
    }

    return clones
  }

  turnCells(cells: Cell[]) {
    const model = this.model
    const select: Cell[] = []

    model.batchUpdate(() => {
      for (let i = 0, ii = cells.length; i < ii; i += 1) {
        const cell = cells[i]

        if (model.isEdge(cell)) {
          const src = model.getTerminal(cell, true)
          const trg = model.getTerminal(cell, false)

          model.setTerminal(cell, trg, true)
          model.setTerminal(cell, src, false)

          let geo = model.getGeometry(cell)
          if (geo != null) {
            geo = geo.clone()

            if (geo.points != null) {
              geo.points.reverse()
            }

            const sp = geo.getTerminalPoint(true)
            const tp = geo.getTerminalPoint(false)

            geo.setTerminalPoint(sp, false)
            geo.setTerminalPoint(tp, true)
            model.setGeometry(cell, geo)

            // Inverts anchors
            const edgeState = this.view.getState(cell)
            const sourceState = this.view.getState(src)
            const targetState = this.view.getState(trg)

            if (edgeState != null) {
              const sc =
                sourceState != null
                  ? this.graph.getConnectionAnchor(edgeState, sourceState, true)
                  : null
              const tc =
                targetState != null
                  ? this.graph.getConnectionAnchor(
                      edgeState,
                      targetState,
                      false,
                    )
                  : null

              this.graph.setConnectionAnchor(cell, src, true, tc)
              this.graph.setConnectionAnchor(cell, trg, false, sc)
            }

            select.push(cell)
          }
        } else if (model.isNode(cell)) {
          let geo = model.getGeometry(cell)
          if (geo != null) {
            // Rotates the size and position in the geometry
            geo = geo.clone()
            const bounds = geo.bounds
            bounds.x += bounds.width / 2 - bounds.height / 2
            bounds.y += bounds.height / 2 - bounds.width / 2
            const tmp = bounds.width
            bounds.width = bounds.height
            bounds.height = tmp
            model.setGeometry(cell, geo)

            // Reads the current direction and advances by 90 degrees
            const state = this.view.getState(cell)
            if (state != null) {
              const style = state.style
              let direction = style.direction || 'east'
              if (direction === 'east') {
                direction = 'south'
              } else if (direction === 'south') {
                direction = 'west'
              } else if (direction === 'west') {
                direction = 'north'
              } else if (direction === 'north') {
                direction = 'east'
              }

              this.graph.setCellStyle({ ...style, direction }, [cell])
            }

            select.push(cell)
          }
        }
      }
    })

    this.graph.selectCells(select)

    return select
  }
}

export interface CellData {
  id: string | number
  visible?: boolean
  offset?: Point.PointLike
  parent?: string | number
}

export interface NestedStyle extends Style {
  style?: Style
}

export interface NodeData extends CellData, NestedStyle {
  x: number
  y: number
  width: number
  height: number
  relative?: boolean
  collapsed?: boolean
  alternateBounds?: Rectangle.RectangleLike
}

export interface EdgeData extends CellData, NestedStyle {
  source: string | number
  target: string | number
  sourcePoint?: Point.PointLike
  targetPoint?: Point.PointLike
  points?: (Point.PointLike | Point.PointData)[]
}

export interface Data {
  nodes: NodeData[]
  edges?: EdgeData[]
}
