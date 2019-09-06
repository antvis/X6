import * as util from '../util'
import { constants } from '../common'
import { BaseManager } from './manager-base'
import { Graph, Cell, Geometry, State } from '../core'
import { CellStyle, Align, VAlign } from '../types'
import { Point, Rectangle, Overlay, Image, Shapes, Constraint } from '../struct'
import { Label } from '../shape'

export class CellManager extends BaseManager {
  constructor(graph: Graph) {
    super(graph)
  }

  // #region :::::::::::: Creating

  /**
   * Returns the clones for the given cells. If the terminal of an edge is not
   * in the given array, then the respective end is assigned a terminal point
   * and the terminal is removed.
   *
   * @param cells - Array of `Cell`s to be cloned.
   * @param allowInvalidEdges - Optional boolean that specifies if invalid
   * edges should be cloned. Default is `true`.
   * @param mapping - Optional mapping for existing clones.
   * @param keepPosition - Optional boolean indicating if the position of the
   * cells should be updated to reflect the lost parent cell. Default is `false`.
   */
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

      cells.forEach((cell) => {
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
            (clones as any)[i] = null
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
                    geom.points && geom.points.forEach((p) => {
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

  createNode(options: Graph.CreateNodeOptions = {}): Cell {
    const geom = new Geometry(
      options.x,
      options.y,
      options.width,
      options.height,
    )
    geom.relative = options.relative != null ? options.relative : false
    if (options.offset != null) {
      geom.offset = Point.clone(options.offset)
    }

    const node = new Cell(options.data, geom, options.style)
    node.setId(options.id)
    node.asNode(true)

    if (options.visible != null) {
      node.setVisible(options.visible)
    } else {
      node.setVisible(true)
    }

    if (options.connectable != null) {
      node.setConnectable(options.connectable)
    } else {
      node.setConnectable(true)
    }

    if (options.collapsed != null) {
      node.setCollapsed(options.collapsed)
    }

    if (options.overlays != null) {
      node.setOverlays(options.overlays)
    }

    return node
  }

  createEdge(options: Graph.CreateEdgeOptions = {}): Cell {
    const geom = new Geometry()
    geom.relative = true

    if (options.sourcePoint != null) {
      geom.sourcePoint = Point.clone(options.sourcePoint)
    }

    if (options.targetPoint != null) {
      geom.targetPoint = Point.clone(options.targetPoint)
    }

    if (options.offset != null) {
      geom.offset = Point.clone(options.offset)
    }

    if (options.points != null) {
      geom.points = options.points.map(p => Point.clone(p))
    }

    const edge = new Cell(options.data, geom, options.style)
    edge.setId(options.id)
    edge.asEdge(true)

    if (options.visible != null) {
      edge.setVisible(options.visible)
    } else {
      edge.setVisible(true)
    }

    if (options.overlays != null) {
      edge.setOverlays(options.overlays)
    }

    return edge
  }

  addCells(
    cells: Cell[],
    parent: Cell = this.graph.getDefaultParent()!,
    index: number = this.model.getChildCount(parent),
    sourceNode?: Cell,
    targetNode?: Cell,
  ) {
    this.model.batchUpdate(() => {
      this.graph.trigger(
        Graph.events.addCells,
        { cells, parent, index, sourceNode, targetNode },
      )

      this.cellsAdded(
        cells, parent, index, sourceNode, targetNode, false, true,
      )
    })

    return cells
  }

  protected cellsAdded(
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
        const o1 = (pState != null) ? pState.origin : null
        const zero = new Point(0, 0)

        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          if (cells[i] == null) {
            index -= 1 // tslint:disable-line
            continue
          }

          const oldParent = this.model.getParent(cells[i])

          // Keeps the cell at its absolute location
          if (o1 != null && cells[i] !== parent && parent !== oldParent) {
            const oldState = this.view.getState(oldParent)
            const o2 = (oldState != null) ? oldState.origin : zero
            let geo = this.model.getGeometry(cells[i])

            if (geo != null) {
              const dx = o2.x - o1.x
              const dy = o2.y - o1.y

              geo = geo.clone()
              geo.translate(dx, dy)

              if (
                !geo.relative &&
                !this.graph.isAllowNegativeCoordinates() &&
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

          if (this.graph.autoSizeCellsOnAdd) {
            this.autoSizeCell(cells[i], true)
          }

          // Extends the parent or constrains the child
          if (
            (extend == null || extend) &&
            this.graph.isExtendParentsOnAdd() &&
            this.graph.isExtendParent(cells[i])
          ) {
            this.extendParent(cells[i])
          }

          // Additionally constrains the child after extending the parent
          if (constrain == null || constrain) {
            this.constrainChild(cells[i])
          }

          // Sets the source terminal
          if (sourceNode != null) {
            this.cellConnected(cells[i], sourceNode, true)
          }

          // Sets the target terminal
          if (targetNode != null) {
            this.cellConnected(cells[i], targetNode, false)
          }
        }

        this.graph.trigger(
          Graph.events.cellsAdded,
          { cells, parent, index, sourceNode, targetNode, absolute },
        )
      })
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

      cells.forEach(cell => (dict.set(cell, true)))
      edges.forEach((edge) => {
        if (this.view.getState(edge) == null && !dict.get(edge)) {
          dict.set(edge, true)
          removing.push(edge)
        }
      })
    }

    this.model.batchUpdate(() => {
      this.cellsRemoved(removing)
      this.graph.trigger(Graph.events.removeCells, {
        includeEdges,
        cells: removing,
      })
    })

    return removing
  }

  /**
   * Returns an array with the given cells and all edges that are connected
   * to a cell or one of its descendants.
   */
  protected addAllEdges(cells: Cell[]) {
    const merged = [
      ...cells,
      ...this.getAllEdges(cells),
    ]
    return util.removeDuplicates<Cell>(merged)
  }

  getAllEdges(cells: Cell[]) {
    const edges: Cell[] = []
    if (cells != null) {
      cells.forEach((cell) => {
        cell.eachEdge(edge => edges.push(edge))
        const children = this.model.getChildren(cell)
        edges.push(...this.getAllEdges(children))
      })
    }

    return edges
  }

  protected cellsRemoved(cells: Cell[]) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(cell => (dict.set(cell, true)))
        cells.forEach((cell) => {
          const edges = this.getAllEdges([cell])
          edges.forEach((edge) => {
            if (!dict.get(edge)) {
              dict.set(edge, true)
              this.disconnectTerminal(cell, edge, true)
              this.disconnectTerminal(cell, edge, false)
            }
          })

          this.model.remove(cell)
        })

        this.graph.trigger(Graph.events.cellsRemoved, { cells })
      })
    }
  }

  splitEdge(
    edge: Cell,
    cells: Cell[],
    newEdge: Cell | null,
    dx: number,
    dy: number,
  ) {
    const parent = this.model.getParent(edge)
    const source = this.model.getTerminal(edge, true)

    this.model.batchUpdate(() => {
      if (newEdge == null) {
        newEdge = this.graph.cloneCell(edge) // tslint:disable-line

        // Removes waypoints before/after new cell
        const state = this.view.getState(edge)
        let geo = this.graph.getCellGeometry(newEdge)

        if (geo != null && geo.points != null && state != null) {
          const t = this.view.translate
          const s = this.view.scale
          const idx = util.findNearestSegment(state, (dx + t.x) * s, (dy + t.y) * s)
          geo.points = geo.points.slice(0, idx)

          geo = this.graph.getCellGeometry(edge)

          if (geo != null && geo.points != null) {
            geo = geo.clone()
            geo.points = geo.points.slice(idx)
            this.model.setGeometry(edge, geo)
          }
        }
      }

      this.cellsMoved(cells, dx, dy, false, false)
      this.cellsAdded(cells, parent!, this.model.getChildCount(parent), null, null, true)
      this.cellsAdded([newEdge], parent!, this.model.getChildCount(parent), source, cells[0], false)
      this.cellConnected(edge, cells[0], true)

      this.graph.trigger(Graph.events.splitEdge, { edge, cells, newEdge, dx, dy })
    })

    return newEdge
  }

  // #endregion

  // #region :::::::::::: Grouping

  /**
   * Adds the cells into the given group. The change is carried out using
   * <cellsAdded>, <cellsMoved> and <cellsResized>. This method fires
   * <DomEvent.GROUP_CELLS> while the transaction is in progress. Returns the
   * new group. A group is only created if there is at least one entry in the
   * given array of cells.
   *
   * Parameters:
   *
   * group - <Cell> that represents the target group. If null is specified
   * then a new group is created using <createGroupCell>.
   * border - Optional integer that specifies the border between the child
   * area and the group bounds. Default is 0.
   * cells - Optional array of <Cells> to be grouped. If null is specified
   * then the selection cells are used.
   */
  groupCells(
    group: Cell,
    border: number = 0,
    cells: Cell[] = util.sortCells(this.graph.getSelectedCells(), true),
  ) {

    // tslint:disable-next-line
    cells = this.getCellsForGroup(cells)

    if (group == null) {
      // tslint:disable-next-line
      group = this.createGroupCell(cells)
    }

    const bounds = this.getBoundsForGroup(group, cells, border)

    if (cells.length > 0 && bounds != null) {
      // Uses parent of group or previous parent of first child
      let parent = this.model.getParent(group)
      if (parent == null) {
        parent = this.model.getParent(cells[0])
      }

      this.model.batchUpdate(() => {
        // Checks if the group has a geometry and
        // creates one if one does not exist
        if (this.graph.getCellGeometry(group) == null) {
          this.model.setGeometry(group, new Geometry())
        }

        // Adds the group into the parent
        let index = this.model.getChildCount(parent!)
        this.cellsAdded([group], parent!, index, null, null, false, false, false)

        // Adds the children into the group and moves
        index = this.model.getChildCount(group)
        this.cellsAdded(cells, group, index, null, null, false, false, false)
        this.cellsMoved(cells, -bounds.x, -bounds.y, false, false, false)

        // Resizes the group
        this.cellsResized([group], [bounds], false)

        this.graph.trigger(Graph.events.groupCells, { group, cells, border })
      })
    }

    return group
  }

  /**
   * Returns the cells with the same parent as the first cell
   * in the given array.
   */
  protected getCellsForGroup(cells: Cell[]) {
    const result = []

    if (cells != null && cells.length > 0) {
      const parent = this.model.getParent(cells[0])
      result.push(cells[0])

      // Filters selection cells with the same parent
      for (let i = 1, ii = cells.length; i < ii; i += 1) {
        if (this.model.getParent(cells[i]) === parent) {
          result.push(cells[i])
        }
      }
    }

    return result
  }

  /**
   * Returns the bounds to be used for the given group and children.
   */
  protected getBoundsForGroup(group: Cell, children: Cell[], border: number) {
    const result = this.graph.getBoundingBoxFromGeometry(children, true)
    if (result != null) {
      if (this.graph.isSwimlane(group)) {
        const size = this.graph.getStartSize(group)

        result.x -= size.width
        result.y -= size.height
        result.width += size.width
        result.height += size.height
      }

      // Adds the border
      if (border != null) {
        result.x -= border
        result.y -= border
        result.width += 2 * border
        result.height += 2 * border
      }
    }

    return result
  }

  /**
   * Hook for creating the group cell to hold the given array of <Cells> if
   * no group cell was given to the <group> function.
   */
  protected createGroupCell(cells: Cell[]) {
    const group = new Cell()
    group.asNode(true)
    group.setConnectable(false)
    return group
  }

  /**
 * Ungroups the given cells by moving the children the children to their
 * parents parent and removing the empty groups. Returns the children that
 * have been removed from the groups.
 *
 * Parameters:
 *
 * cells - Array of cells to be ungrouped. If null is specified then the
 * selection cells are used.
 */
  ungroupCells(cells: Cell[]) {
    let result: Cell[] = []

    // tslint:disable-next-line
    cells = cells.filter(cell => this.model.getChildCount(cell) > 0)

    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach((cell) => {
          let children = this.model.getChildren(cell)
          if (children != null && children.length > 0) {
            children = children.slice()
            const parent = this.model.getParent(cell)!
            const index = this.model.getChildCount(parent)

            this.cellsAdded(children, parent, index, null, null, true)
            result = result.concat(children)
          }
        })

        this.removeCellsAfterUngroup(cells)
        this.graph.trigger(Graph.events.ungroupCells, { cells })
      })
    }

    return result
  }

  /**
   * Hook to remove the groups after <ungroupCells>.
   */
  removeCellsAfterUngroup(cells: Cell[]) {
    this.cellsRemoved(this.addAllEdges(cells))
  }

  removeCellsFromParent(cells: Cell[]) {
    this.model.batchUpdate(() => {
      const parent = this.graph.getDefaultParent()!
      const index = this.model.getChildCount(parent)

      this.cellsAdded(cells, parent, index, null, null, true)
      this.graph.trigger(Graph.events.removeCellsFromParent, { cells })
    })

    return cells
  }

  /**
   * Updates the bounds of the given groups to include all children and returns
   * the passed-in cells. Call this with the groups in parent to child order,
   * top-most group first, the cells are processed in reverse order and cells
   * with no children are ignored.
   *
   * Parameters:
   *
   * cells - The groups whose bounds should be updated. If this is null, then
   * the selection cells are used.
   * border - Optional border to be added in the group. Default is 0.
   * moveGroup - Optional boolean that allows the group to be moved. Default
   * is false.
   * topBorder - Optional top border to be added in the group. Default is 0.
   * rightBorder - Optional top border to be added in the group. Default is 0.
   * bottomBorder - Optional top border to be added in the group. Default is 0.
   * leftBorder - Optional top border to be added in the group. Default is 0.
   */
  updateGroupBounds(
    cells: Cell[],
    border: number = 0,
    moveGroup: boolean = false,
    topBorder: number = 0,
    rightBorder: number = 0,
    bottomBorder: number = 0,
    leftBorder: number = 0,
  ) {
    this.model.beginUpdate()
    try {
      for (let i = cells.length - 1; i >= 0; i -= 1) {
        let geo = this.graph.getCellGeometry(cells[i])
        if (geo != null) {
          const children = this.graph.getChildCells(cells[i])

          if (children != null && children.length > 0) {
            const bounds = this.graph.getBoundingBoxFromGeometry(children, true)

            if (bounds != null && bounds.width > 0 && bounds.height > 0) {
              let left = 0
              let top = 0

              // Adds the size of the title area for swimlanes
              if (this.graph.isSwimlane(cells[i])) {
                const size = this.graph.getStartSize(cells[i])
                left = size.width
                top = size.height
              }

              geo = geo.clone()

              if (moveGroup) {
                geo.bounds.x = Math.round(geo.bounds.x + bounds.x - border - left - leftBorder)
                geo.bounds.y = Math.round(geo.bounds.y + bounds.y - border - top - topBorder)
              }

              geo.bounds.width =
                Math.round(bounds.width + 2 * border + left + leftBorder + rightBorder)
              geo.bounds.height =
                Math.round(bounds.height + 2 * border + top + topBorder + bottomBorder)

              this.model.setGeometry(cells[i], geo)
              this.moveCells(
                children,
                border + left - bounds.x + leftBorder,
                border + top - bounds.y + topBorder,
              )
            }
          }
        }
      }
    } finally {
      this.model.endUpdate()
    }

    return cells
  }

  // #endregion

  // #region :::::::::::: Connecting

  connectCell(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    constraint?: Constraint,
  ) {
    this.model.beginUpdate()
    try {
      // const previous = this.model.getTerminal(edge, isSource)
      this.cellConnected(edge, terminal, isSource, constraint)
      // this.fireEvent(new DomEventObject(DomEvent.CONNECT_CELL,
      //   'edge', edge, 'terminal', terminal, 'source', isSource,
      //   'previous', previous))
    } finally {
      this.model.endUpdate()
    }

    return edge
  }

  protected cellConnected(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    constraint?: Constraint,
  ) {
    if (edge != null) {
      this.model.beginUpdate()
      try {
        // const previous = this.model.getTerminal(edge, isSource)

        // Updates the constraint
        this.setConnectionConstraint(edge, terminal, isSource, constraint)

        // Checks if the new terminal is a port, uses the ID of the port in the
        // style and the parent of the port as the actual terminal of the edge.
        if (this.graph.isPortsEnabled()) {
          let id = null

          if (terminal != null && this.graph.isPort(terminal)) {
            id = terminal.getId()
            // tslint:disable-next-line
            terminal = this.graph.getTerminalForPort(terminal, isSource)!
          }

          if (id != null) {
            const key = isSource ? 'sourcePort' : 'targetPort'
            this.setCellsStyle(key, id, [edge])
          }
        }

        this.model.setTerminal(edge, terminal, isSource)

        if (this.graph.resetEdgesOnConnect) {
          this.resetEdge(edge)
        }

        // this.fireEvent(new DomEventObject(DomEvent.CELL_CONNECTED,
        //   'edge', edge, 'terminal', terminal, 'source', isSource,
        //   'previous', previous))
      } finally {
        this.model.endUpdate()
      }
    }
  }

  /**
 * Sets the <mxConnectionConstraint> that describes the given connection point.
 * If no constraint is given then nothing is changed. To remove an existing
 * constraint from the given edge, use an empty constraint instead.
 *
 * Parameters:
 *
 * edge - <Cell> that represents the edge.
 * terminal - <Cell> that represents the terminal.
 * source - Boolean indicating if the terminal is the source or target.
 * constraint - Optional <mxConnectionConstraint> to be used for this
 * connection.
 */
  setConnectionConstraint(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    constraint?: Constraint | null,
  ) {
    if (constraint != null) {
      this.model.beginUpdate()

      try {
        if (constraint == null || constraint.point == null) {
          this.setCellsStyle(
            isSource ? 'exitX' : 'entryX',
            null,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitY' : 'entryY',
            null,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitDx' : 'entryDx',
            null,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitDy' : 'entryDy',
            null,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitPerimeter' : 'entryPerimeter',
            null,
            [edge],
          )
        } else if (constraint.point != null) {
          this.setCellsStyle(
            isSource ? 'exitX' : 'entryX',
            `${constraint.point.x}`,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitY' : 'entryY',
            `${constraint.point.y}`,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitDx' : 'entryDx',
            `${constraint.dx}`,
            [edge],
          )
          this.setCellsStyle(
            isSource ? 'exitDy' : 'entryDy',
            `${constraint.dy}`,
            [edge],
          )

          // Only writes 0 since 1 is default
          if (!constraint.perimeter) {
            this.setCellsStyle(
              isSource ? 'exitPerimeter' : 'entryPerimeter',
              '0',
              [edge],
            )
          } else {
            this.setCellsStyle(
              isSource ? 'exitPerimeter' : 'entryPerimeter',
              null,
              [edge],
            )
          }
        }
      } finally {
        this.model.endUpdate()
      }
    }
  }

  disconnectGraph(cells: Cell[]) {
    if (cells != null) {
      this.model.beginUpdate()
      try {
        const scale = this.view.scale
        const tr = this.view.translate

        // Fast lookup for finding cells in array
        const dict = new WeakMap<Cell, boolean>()

        for (let i = 0; i < cells.length; i += 1) {
          dict.set(cells[i], true)
        }

        for (let i = 0; i < cells.length; i += 1) {
          if (this.model.isEdge(cells[i])) {
            let geo = this.model.getGeometry(cells[i])

            if (geo != null) {
              const state = this.view.getState(cells[i])
              const pstate = this.view.getState(
                this.model.getParent(cells[i]))

              if (state != null &&
                pstate != null) {
                geo = geo.clone()

                const dx = -pstate.origin.x
                const dy = -pstate.origin.y
                const pts = state.absolutePoints

                let src = this.model.getTerminal(cells[i], true)

                if (src != null && this.graph.isCellDisconnectable(cells[i], src, true)) {
                  while (src != null && !dict.get(src)) {
                    src = this.model.getParent(src)
                  }

                  if (src == null) {
                    geo.setTerminalPoint(
                      new Point(
                        pts[0]!.x / scale - tr.x + dx,
                        pts[0]!.y / scale - tr.y + dy,
                      ),
                      true,
                    )
                    this.model.setTerminal(cells[i], null, true)
                  }
                }

                let trg = this.model.getTerminal(cells[i], false)

                if (trg != null && this.graph.isCellDisconnectable(cells[i], trg, false)) {
                  while (trg != null && !dict.get(trg)) {
                    trg = this.model.getParent(trg)
                  }

                  if (trg == null) {
                    const n = pts.length - 1
                    geo.setTerminalPoint(
                      new Point(
                        pts[n]!.x / scale - tr.x + dx,
                        pts[n]!.y / scale - tr.y + dy,
                      ),
                      false,
                    )
                    this.model.setTerminal(cells[i], null, false)
                  }
                }

                this.model.setGeometry(cells[i], geo)
              }
            }
          }
        }
      } finally {
        this.model.endUpdate()
      }
    }
  }

  protected disconnectTerminal(cell: Cell, edge: Cell, isSource: boolean) {
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
        } else { // fallback
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

  getConnectionPoint(
    terminalState: State,
    constraint: Constraint,
    round: boolean = true,
  ) {
    let result: Point | null = null

    if (terminalState != null && constraint.point != null) {
      const direction = terminalState.style.direction
      const bounds = this.view.getPerimeterBounds(terminalState)
      const cx = bounds.getCenter()

      let r1 = 0

      if (
        direction != null &&
        terminalState.style.anchorPointDirection !== false
      ) {
        if (direction === 'north') {
          r1 += 270
        } else if (direction === 'west') {
          r1 += 180
        } else if (direction === 'south') {
          r1 += 90
        }

        // Bounds need to be rotated by 90 degrees for further computation
        if (
          direction === 'north' ||
          direction === 'south'
        ) {
          bounds.rotate90()
        }
      }

      const scale = this.view.scale

      result = new Point(
        bounds.x + constraint.point.x * bounds.width + constraint.dx * scale,
        bounds.y + constraint.point.y * bounds.height + constraint.dy * scale,
      )

      // Rotation for direction before projection on perimeter
      let r2 = terminalState.style.rotation || 0

      if (constraint.perimeter) {
        if (r1 !== 0) {
          // Only 90 degrees steps possible here so no trig needed
          let cos = 0
          let sin = 0

          if (r1 === 90) {
            sin = 1
          } else if (r1 === 180) {
            cos = -1
          } else if (r1 === 270) {
            sin = -1
          }
          result = util.rotatePoint(result, cos, sin, cx)
        }

        result = this.view.getPerimeterPoint(terminalState, result, false)

      } else {
        r2 += r1

        if (this.model.isNode(terminalState.cell)) {
          const flipH = terminalState.style.flipH === true
          const flipV = terminalState.style.flipV === true

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
        const rad = util.toRad(r2)
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        result = util.rotatePoint(result, cos, sin, cx)
      }
    }

    if (round && result != null) {
      result.x = Math.round(result.x)
      result.y = Math.round(result.y)
    }

    return result
  }

  // #endregion

  // #region :::::::::::: Sizing

  autoSizeCell(cell: Cell, recurse: boolean) {
    if (recurse) {
      cell.eachChild(child => this.autoSizeCell(child, recurse))
    }

    if (this.model.isNode(cell) && this.graph.isAutoSizeCell(cell)) {
      this.updateCellSize(cell)
    }
  }

  updateCellSize(cell: Cell, ignoreChildren: boolean = false) {
    this.model.batchUpdate(() => {
      this.cellSizeUpdated(cell, ignoreChildren)
      this.graph.trigger(Graph.events.updateCellSize, { cell, ignoreChildren })
    })
    return cell
  }

  cellSizeUpdated(cell: Cell, ignoreChildren: boolean) {
    if (cell != null) {
      this.model.batchUpdate(() => {
        const size = this.getPreferredSizeForCell(cell)
        let geo = this.model.getGeometry(cell)
        if (size != null && geo != null) {
          const collapsed = this.graph.isCellCollapsed(cell)
          geo = geo.clone()

          if (this.graph.isSwimlane(cell)) {
            const state = this.view.getState(cell)
            const style = (state != null) ? state.style : this.getCellStyle(cell)
            const cellStyle = this.model.getStyle(cell) || {}

            if (style.horizontal !== false) {
              cellStyle.startSize = size.height + 8

              if (collapsed) {
                geo.bounds.height = size.height + 8
              }

              geo.bounds.width = size.width

            } else {
              cellStyle.startSize = size.width + 8

              if (collapsed) {
                geo.bounds.width = size.width + 8
              }

              geo.bounds.height = size.height
            }

            this.model.setStyle(cell, cellStyle)

          } else {
            geo.bounds.width = size.width
            geo.bounds.height = size.height
          }

          if (!ignoreChildren && !collapsed) {
            const bounds = this.view.getBounds(this.model.getChildren(cell))
            if (bounds != null) {
              const tr = this.view.translate
              const scale = this.view.scale

              const width = (bounds.x + bounds.width) / scale - geo.bounds.x - tr.x
              const height = (bounds.y + bounds.height) / scale - geo.bounds.y - tr.y

              geo.bounds.width = Math.max(geo.bounds.width, width)
              geo.bounds.height = Math.max(geo.bounds.height, height)
            }
          }

          this.cellsResized([cell], [geo.bounds], false)
        }
      })
    }
  }

  protected getPreferredSizeForCell(cell: Cell) {
    let result = null

    if (cell != null && !this.model.isEdge(cell)) {
      const state = this.view.getState(cell) || this.view.createState(cell)
      const style = state.style

      const fontSize = style.fontSize || constants.DEFAULT_FONTSIZE
      let dx = 0
      let dy = 0

      // Adds dimension of image if shape is a label
      if (this.graph.getImage(state) != null || style.image != null) {
        if (style.shape === Shapes.label) {
          if (style.verticalAlign === 'middle') {
            dx += style.imageWidth || Label.prototype.imageSize
          }

          if (style.align !== 'center') {
            dy += style.imageHeight || Label.prototype.imageSize
          }
        }
      }

      // Adds spacings
      dx += 2 * (style.spacing || 0)
      dx += style.spacingLeft || 0
      dx += style.spacingRight || 0

      dy += 2 * (style.spacing || 0)
      dy += style.spacingTop || 0
      dy += style.spacingBottom || 0

      // Add spacing for collapse/expand icon
      // LATER: Check alignment and use constants
      // for image spacing
      const image = this.graph.getFoldingImage(state)

      if (image != null) {
        dx += image.width + 8
      }

      // Adds space for label
      let value = this.renderer.getLabelValue(state)
      if (value != null && value.length > 0) {
        if (!this.graph.isHtmlLabel(state.cell)) {
          value = util.escape(value)
        }

        value = value.replace(/\n/g, '<br>')

        const size = util.getSizeForString(value, fontSize, style.fontFamily)
        let width = size.width + dx
        let height = size.height + dy

        if (style.horizontal === false) {
          const tmp = height

          height = width
          width = tmp
        }

        if (this.graph.gridEnabled) {
          width = this.graph.snap(width + this.graph.gridSize / 2)
          height = this.graph.snap(height + this.graph.gridSize / 2)
        }

        result = new Rectangle(0, 0, width, height)
      } else {
        const gs2 = 4 * this.graph.gridSize
        result = new Rectangle(0, 0, gs2, gs2)
      }
    }

    return result
  }

  resizeCells(cells: Cell[], bounds: Rectangle[], recurse: boolean) {
    this.model.batchUpdate(() => {
      this.cellsResized(cells, bounds, recurse)
      this.graph.trigger(Graph.events.resizeCells, { cells, bounds })
    })
    return cells
  }

  protected cellsResized(
    cells: Cell[],
    bounds: Rectangle[],
    recurse: boolean = false,
  ) {
    if (cells != null && bounds != null && cells.length === bounds.length) {
      this.model.batchUpdate(() => {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          this.cellResized(cells[i], bounds[i], false, recurse)
          if (this.graph.isExtendParent(cells[i])) {
            this.extendParent(cells[i])
          }
          this.constrainChild(cells[i])
        }

        if (this.graph.resetEdgesOnResize) {
          this.resetEdges(cells)
        }

        this.graph.trigger(Graph.events.cellsResized, { cells, bounds })
      })
    }
  }

  /**
   * Resizes the parents recursively so that they contain the complete area
   * of the resized child cell.
   *
   * Parameters:
   *
   * cell - <Cell> whose bounds should be changed.
   * bounds - <Rects> that represent the new bounds.
   * ignoreRelative - Boolean that indicates if relative cells should be ignored.
   * recurse - Optional boolean that specifies if the children should be resized.
   */
  cellResized(
    cell: Cell,
    bounds: Rectangle,
    ignoreRelative: boolean,
    recurse: boolean,
  ) {
    let geo = this.model.getGeometry(cell)
    if (
      geo != null &&
      (
        geo.bounds.x !== bounds.x ||
        geo.bounds.y !== bounds.y ||
        geo.bounds.width !== bounds.width ||
        geo.bounds.height !== bounds.height
      )
    ) {
      geo = geo.clone()

      if (!ignoreRelative && geo.relative) {
        const offset = geo.offset

        if (offset != null) {
          offset.x += bounds.x - geo.bounds.x
          offset.y += bounds.y - geo.bounds.y
        }
      } else {
        geo.bounds.x = bounds.x
        geo.bounds.y = bounds.y
      }

      geo.bounds.width = bounds.width
      geo.bounds.height = bounds.height

      if (
        !geo.relative && this.model.isNode(cell) &&
        !this.graph.isAllowNegativeCoordinates()
      ) {
        geo.bounds.x = Math.max(0, geo.bounds.x)
        geo.bounds.y = Math.max(0, geo.bounds.y)
      }

      this.model.batchUpdate(() => {
        if (recurse) {
          this.graph.resizeChildCells(cell, geo!)
        }

        this.model.setGeometry(cell, geo!)
        this.graph.constrainChildCells(cell)
      })
    }
  }

  /**
   * Scales the points, position and size of the given cell according to the
   * given vertical and horizontal scaling factors.
   *
   * Parameters:
   *
   * cell - <Cell> whose geometry should be scaled.
   * dx - Horizontal scaling factor.
   * dy - Vertical scaling factor.
   * recurse - Boolean indicating if the child cells should be scaled.
   */
  scaleCell(cell: Cell, dx: number, dy: number, recurse: boolean) {
    let geo = this.model.getGeometry(cell)

    if (geo != null) {
      const state = this.view.getState(cell)
      const style = (state != null) ? state.style : this.getCellStyle(cell)

      geo = geo.clone()

      // Stores values for restoring based on style
      const x = geo.bounds.x
      const y = geo.bounds.y
      const w = geo.bounds.width
      const h = geo.bounds.height

      geo.scale(dx, dy, style.aspect)

      if (style.resizeWidth === true) {
        geo.bounds.width = w * dx
      } else if (style.resizeWidth === false) {
        geo.bounds.width = w
      }

      if (style.resizeHeight === true) {
        geo.bounds.height = h * dy
      } else if (style.resizeHeight === false) {
        geo.bounds.height = h
      }

      if (!this.graph.isCellMovable(cell)) {
        geo.bounds.x = x
        geo.bounds.y = y
      }

      if (!this.graph.isCellResizable(cell)) {
        geo.bounds.width = w
        geo.bounds.height = h
      }

      if (this.model.isNode(cell)) {
        this.cellResized(cell, geo.bounds, true, recurse)
      } else {
        this.model.setGeometry(cell, geo)
      }
    }
  }

  extendParent(cell: Cell) {
    if (cell != null) {
      const parent = this.model.getParent(cell)
      let pgeo = this.graph.getCellGeometry(parent!)

      if (parent != null && pgeo != null && !this.graph.isCellCollapsed(parent)) {
        const geo = this.graph.getCellGeometry(cell)

        if (
          geo != null &&
          !geo.relative &&
          (
            pgeo.bounds.width < geo.bounds.x + geo.bounds.width ||
            pgeo.bounds.height < geo.bounds.y + geo.bounds.height
          )
        ) {
          pgeo = pgeo.clone()
          pgeo.bounds.width = Math.max(pgeo.bounds.width, geo.bounds.x + geo.bounds.width)
          pgeo.bounds.height = Math.max(pgeo.bounds.height, geo.bounds.y + geo.bounds.height)

          this.cellsResized([parent], [pgeo.bounds], false)
        }
      }
    }
  }

  constrainChild(cell: Cell, sizeFirst: boolean = true) {
    if (cell != null) {
      let geo = this.graph.getCellGeometry(cell)

      if (geo != null && (this.graph.isConstrainRelativeChildren() || !geo.relative)) {
        const parent = this.model.getParent(cell)!
        // const pgeo = this.getCellGeometry(parent)
        let max = this.graph.getMaximumGraphBounds()

        // Finds parent offset
        if (max != null) {
          const off = this.graph.getBoundingBoxFromGeometry([parent], false)

          if (off != null) {
            max = Rectangle.clone(max)

            max.x -= off.x
            max.y -= off.y
          }
        }

        if (this.graph.isConstrainChild(cell)) {
          let tmp = this.getCellContainmentArea(cell)

          if (tmp != null) {
            const overlap = this.graph.getOverlap(cell)

            if (overlap > 0) {
              tmp = Rectangle.clone(tmp)

              tmp.x -= tmp.width * overlap
              tmp.y -= tmp.height * overlap
              tmp.width += 2 * tmp.width * overlap
              tmp.height += 2 * tmp.height * overlap
            }

            // Find the intersection between max and tmp
            if (max == null) {
              max = tmp
            } else {
              max = Rectangle.clone(max)
              max.intersect(tmp)
            }
          }
        }

        if (max != null) {
          const cells = [cell]

          if (!this.graph.isCellCollapsed(cell)) {
            const desc = this.model.getDescendants(cell)

            for (let i = 0; i < desc.length; i += 1) {
              if (this.graph.isCellVisible(desc[i])) {
                cells.push(desc[i])
              }
            }
          }

          const bbox = this.graph.getBoundingBoxFromGeometry(cells, false)

          if (bbox != null) {
            geo = geo.clone()

            // Cumulative horizontal movement
            let dx = 0

            if (geo.bounds.width > max.width) {
              dx = geo.bounds.width - max.width
              geo.bounds.width -= dx
            }

            if (bbox.x + bbox.width > max.x + max.width) {
              dx -= bbox.x + bbox.width - max.x - max.width - dx
            }

            // Cumulative vertical movement
            let dy = 0

            if (geo.bounds.height > max.height) {
              dy = geo.bounds.height - max.height
              geo.bounds.height -= dy
            }

            if (bbox.y + bbox.height > max.y + max.height) {
              dy -= bbox.y + bbox.height - max.y - max.height - dy
            }

            if (bbox.x < max.x) {
              dx -= bbox.x - max.x
            }

            if (bbox.y < max.y) {
              dy -= bbox.y - max.y
            }

            if (dx !== 0 || dy !== 0) {
              if (geo.relative) {
                // Relative geometries are moved via absolute offset
                if (geo.offset == null) {
                  geo.offset = new Point()
                }

                geo.offset.x += dx
                geo.offset.y += dy
              } else {
                geo.bounds.x += dx
                geo.bounds.y += dy
              }
            }

            this.model.setGeometry(cell, geo)
          }
        }
      }
    }
  }

  getCellContainmentArea(cell: Cell) {
    if (cell != null && !this.model.isEdge(cell)) {
      const parent = this.model.getParent(cell)

      if (parent != null && parent !== this.graph.getDefaultParent()) {
        const g = this.model.getGeometry(parent)

        if (g != null) {
          let x = 0
          let y = 0
          let w = g.bounds.width
          let h = g.bounds.height

          if (this.graph.isSwimlane(parent)) {
            const size = this.graph.getStartSize(parent)

            const state = this.view.getState(parent)
            const style = (state != null) ? state.style : this.getCellStyle(parent)
            const dir = style.direction || 'east'
            const flipH = style.flipH === true
            const flipV = style.flipV === true

            if (dir === 'south' || dir === 'north') {
              const tmp = size.width
              size.width = size.height
              size.height = tmp
            }

            if (
              (dir === 'east' && !flipV) ||
              (dir === 'north' && !flipH) ||
              (dir === 'west' && flipV) ||
              (dir === 'south' && flipH)
            ) {
              x = size.width
              y = size.height
            }

            w -= size.width
            h -= size.height
          }

          return new Rectangle(x, y, w, h)
        }
      }
    }

    return null
  }

  // #endregion

  // #region :::::::::::: Moving

  /**
   * Moves or clones the specified cells and moves the cells or clones by the
   * given amount, adding them to the optional target cell.
   *
   * @param cells Array of `Cell`s to be moved, cloned or added to the target.
   * @param dx Specifies the x-coordinate of the vector. Default is `0`.
   * @param dy Specifies the y-coordinate of the vector. Default is `0`.
   * @param clone Indicating if the cells should be cloned. Default is `false`.
   * @param target The new parent of the cells.
   * @param e Mouseevent that triggered the invocation.
   * @param cache Optional mapping for existing clones.
   */
  moveCells(
    cells: Cell[],
    dx: number = 0,
    dy: number = 0,
    clone: boolean = false,
    target?: Cell | null,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    if (cells != null && (dx !== 0 || dy !== 0 || clone || target != null)) {
      // Removes descendants with ancestors in cells to avoid multiple moving
      cells = this.model.getTopmostCells(cells) // tslint:disable-line

      this.model.batchUpdate(() => {
        // Faster cell lookups to remove relative edge labels with selected
        // terminals to avoid explicit and implicit move at same time
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(cell => (dict.set(cell, true)))

        const isSelected = (cell: Cell | null) => {
          let node = cell
          while (node != null) {
            if (dict.get(node)) {
              return true
            }

            node = this.model.getParent(node)!
          }

          return false
        }

        // Removes relative edge labels with selected terminals
        const checked = []

        for (let i = 0; i < cells.length; i += 1) {
          const geo = this.graph.getCellGeometry(cells[i])
          const parent = this.model.getParent(cells[i])!

          if (
            (geo == null || !geo.relative) ||
            !this.model.isEdge(parent) ||
            (
              !isSelected(this.model.getTerminal(parent, true)) &&
              !isSelected(this.model.getTerminal(parent, false))
            )
          ) {
            checked.push(cells[i])
          }
        }

        // tslint:disable-next-line
        cells = checked

        if (clone) {
          // tslint:disable-next-line
          cells = this.cloneCells(cells, this.graph.isCloneInvalidEdges(), cache)!

          if (target == null) {
            // tslint:disable-next-line
            target = this.graph.getDefaultParent()!
          }
        }

        const previous = this.graph.isAllowNegativeCoordinates()

        if (target != null) {
          this.graph.setAllowNegativeCoordinates(true)
        }

        this.cellsMoved(
          cells, dx, dy,
          !clone && this.graph.isDisconnectOnMove() && this.graph.isAllowDanglingEdges(),
          target == null,
          this.graph.isExtendParentsOnMove() && target == null,
        )

        this.graph.setAllowNegativeCoordinates(previous)

        if (target != null) {
          const index = this.model.getChildCount(target)
          this.cellsAdded(cells, target, index, null, null, true)
        }

        // Dispatches a move event
        // this.fireEvent(new DomEventObject(DomEvent.MOVE_CELLS, 'cells', cells,
        //   'dx', dx, 'dy', dy, 'clone', clone, 'target', target, 'event', evt))
      })
    }

    return cells
  }

  /**
   * Moves the specified cells by the given vector, disconnecting the cells
   * using disconnectGraph is disconnect is true. This method fires
   * <DomEvent.CELLS_MOVED> while the transaction is in progress.
   */
  protected cellsMoved(
    cells: Cell[],
    dx: number,
    dy: number,
    disconnect: boolean,
    constrain: boolean,
    extend: boolean = false,
  ) {
    if (cells != null && (dx !== 0 || dy !== 0)) {
      this.model.beginUpdate()
      try {
        if (disconnect) {
          this.disconnectGraph(cells)
        }

        for (let i = 0; i < cells.length; i += 1) {
          this.translateCell(cells[i], dx, dy)

          if (extend && this.graph.isExtendParent(cells[i])) {
            this.extendParent(cells[i])
          } else if (constrain) {
            this.constrainChild(cells[i])
          }
        }

        if (this.graph.resetEdgesOnMove) {
          this.resetEdges(cells)
        }

        // this.fireEvent(new DomEventObject(DomEvent.CELLS_MOVED,
        //   'cells', cells, 'dx', dx, 'dy', dy, 'disconnect', disconnect))
      } finally {
        this.model.endUpdate()
      }
    }
  }

  /**
   * Translates the geometry of the given cell and stores the new,
   * translated geometry in the model as an atomic change.
   */
  translateCell(cell: Cell, dx: number, dy: number) {
    let geo = this.model.getGeometry(cell)
    if (geo != null) {
      geo = geo.clone()
      geo.translate(+dx, +dy)

      if (!geo.relative && this.model.isNode(cell) && !this.graph.isAllowNegativeCoordinates()) {
        geo.bounds.x = Math.max(0, geo.bounds.x)
        geo.bounds.y = Math.max(0, geo.bounds.y)
      }

      if (geo.relative && !this.model.isEdge(cell)) {
        const parent = this.model.getParent(cell)!
        let angle = 0

        if (this.model.isNode(parent)) {
          const state = this.view.getState(parent)
          const style = (state != null) ? state.style : this.getCellStyle(parent)

          angle = style.rotation || 0
        }

        if (angle !== 0) {
          const rad = util.toRad(-angle)
          const cos = Math.cos(rad)
          const sin = Math.sin(rad)
          const pt = util.rotatePoint(new Point(dx, dy), cos, sin, new Point(0, 0))
          dx = pt.x // tslint:disable-line
          dy = pt.y // tslint:disable-line
        }

        if (geo.offset == null) {
          geo.offset = new Point(dx, dy)
        } else {
          geo.offset.x = geo.offset.x + dx
          geo.offset.y = geo.offset.y + dy
        }
      }

      this.model.setGeometry(cell, geo)
    }
  }

  resetEdges(cells: Cell[]) {
    if (cells != null) {
      // Prepares faster cells lookup
      const dict = new WeakMap<Cell, boolean>()

      for (let i = 0; i < cells.length; i += 1) {
        dict.set(cells[i], true)
      }

      this.model.beginUpdate()
      try {
        for (let i = 0; i < cells.length; i += 1) {
          const edges = this.model.getEdges(cells[i])

          if (edges != null) {
            for (let j = 0; j < edges.length; j += 1) {
              const state = this.view.getState(edges[j])

              const source = (state != null)
                ? state.getVisibleTerminal(true)
                : this.view.getVisibleTerminal(edges[j], true)

              const target = (state != null)
                ? state.getVisibleTerminal(false)
                : this.view.getVisibleTerminal(edges[j], false)

              // Checks if one of the terminals is not in the given array
              if (!dict.get(source!) || !dict.get(target!)) {
                this.resetEdge(edges[j])
              }
            }
          }

          this.resetEdges(this.model.getChildren(cells[i]))
        }
      } finally {
        this.model.endUpdate()
      }
    }
  }

  /**
   * Resets the control points of the given edge.
   */
  resetEdge(edge: Cell) {
    let geo = this.model.getGeometry(edge)
    if (geo != null && geo.points != null && geo.points.length > 0) {
      geo = geo.clone()
      geo.points = []
      this.model.setGeometry(edge, geo)
    }
  }

  // #endregion

  // #region :::::::::::: Visibility

  toggleCells(show: boolean, cells: Cell[], includeEdges: boolean) {
    const arr = includeEdges ? this.addAllEdges(cells) : cells
    this.model.batchUpdate(() => {
      this.setCellsVisibleImpl(arr, show)
      this.graph.trigger(
        Graph.events.toggleCells,
        { show, includeEdges, cells: arr },
      )
    })

    return arr
  }

  protected setCellsVisibleImpl(cells: Cell[], show: boolean) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach(cell => this.model.setVisible(cell, show))
      })
    }
  }

  // #endregion

  // #region :::::::::::: Folding

  foldCells(
    collapse: boolean,
    recurse: boolean,
    cells: Cell[],
    checkFoldable: boolean,
  ) {
    this.graph.stopEditing(false)
    this.model.batchUpdate(() => {
      this.cellsFolded(cells, collapse, recurse, checkFoldable)
      this.graph.trigger(Graph.events.foldCells, { collapse, recurse, cells })
    })
    return cells
  }

  protected cellsFolded(
    cells: Cell[],
    collapse: boolean,
    recurse: boolean,
    checkFoldable: boolean = false,
  ) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach((cell) => {
          if (
            (!checkFoldable || this.graph.isFoldable(cell, collapse)) &&
            collapse !== this.graph.isCellCollapsed(cell)
          ) {
            this.model.setCollapsed(cell, collapse)
            this.swapBounds(cell, collapse)

            if (this.graph.isExtendParent(cell)) {
              this.extendParent(cell)
            }

            if (recurse) {
              const children = this.model.getChildren(cell)
              this.cellsFolded(children, collapse, recurse)
            }

            this.constrainChild(cell)
          }
        })
        this.graph.trigger(Graph.events.cellsFolded, { cells, collapse, recurse })
      })
    }
  }

  protected swapBounds(cell: Cell, willCollapse: boolean) {
    if (cell != null) {
      let geo = this.model.getGeometry(cell)
      if (geo != null) {
        geo = geo.clone()
        this.updateAlternateBounds(cell, geo, willCollapse)
        geo.swap()
        this.model.setGeometry(cell, geo)
      }
    }
  }

  /**
   * Updates or sets the alternate bounds in the given geometry for the given
   * cell depending on whether the cell is going to be collapsed. If no
   * alternate bounds are defined in the geometry and
   * <collapseToPreferredSize> is true, then the preferred size is used for
   * the alternate bounds. The top, left corner is always kept at the same
   * location.
   */
  protected updateAlternateBounds(
    cell: Cell,
    geo: Geometry,
    willCollapse: boolean,
  ) {
    if (cell != null && geo != null) {
      const state = this.view.getState(cell)
      const style = (state != null) ? state.style : this.getCellStyle(cell)

      if (geo.alternateBounds == null) {
        let bounds = geo.bounds

        if (this.graph.collapseToPreferredSize) {
          const tmp = this.getPreferredSizeForCell(cell)
          if (tmp != null) {
            bounds = tmp
            const startSize = style.startSize || 0
            if (startSize > 0) {
              bounds.height = Math.max(bounds.height, startSize)
            }
          }
        }

        geo.alternateBounds = new Rectangle(0, 0, bounds.width, bounds.height)
      }

      if (geo.alternateBounds != null) {
        geo.alternateBounds.x = geo.bounds.x
        geo.alternateBounds.y = geo.bounds.y

        const alpha = util.toRad(style.rotation || 0)

        if (alpha !== 0) {
          const dx = geo.alternateBounds.getCenterX() - geo.bounds.getCenterX()
          const dy = geo.alternateBounds.getCenterY() - geo.bounds.getCenterY()

          const cos = Math.cos(alpha)
          const sin = Math.sin(alpha)

          const dx2 = cos * dx - sin * dy
          const dy2 = sin * dx + cos * dy

          geo.alternateBounds.x += dx2 - dx
          geo.alternateBounds.y += dy2 - dy
        }
      }
    }
  }

  // #endregion

  // #region :::::::::::: Overlay

  addOverlay(cell: Cell, overlay: Overlay) {
    if (cell.overlays == null) {
      cell.overlays = []
    }

    cell.overlays.push(overlay)

    const state = this.view.getState(cell)
    if (state != null) {
      // Immediately updates the cell display if the state exists
      this.renderer.redraw(state)
    }

    this.graph.trigger(Graph.events.addOverlay, { cell, overlay })

    return overlay
  }

  removeOverlay(cell: Cell, overlay?: Overlay | null) {
    if (overlay == null) {
      return this.removeOverlays(cell)
    }

    const idx = cell.overlays != null ? cell.overlays.indexOf(overlay) : -1
    if (idx >= 0 && cell.overlays != null) {
      cell.overlays.splice(idx, 1)
      if (cell.overlays.length === 0) {
        delete cell.overlays
      }

      const state = this.view.getState(cell)
      if (state != null) {
        this.renderer.redraw(state)
      }

      this.graph.trigger(Graph.events.removeOverlay, { cell, overlay })

      return overlay
    }

    return null
  }

  removeOverlays(cell: Cell) {
    const overlays = cell.overlays
    if (overlays != null) {
      delete cell.overlays
      const state = this.view.getState(cell)
      if (state != null) {
        this.renderer.redraw(state)
      }

      this.graph.trigger(Graph.events.removeOverlays, { cell, overlays })
    }

    return overlays
  }

  addWarningOverlay(
    cell: Cell,
    warning: string | null,
    img: Image,
    selectOnClick: boolean,
  ) {
    const overlay = new Overlay(
      img,
      `<font color=red>${warning}</font>`,
    )

    // Adds a handler for single mouseclicks to select the cell
    if (selectOnClick) {
      // TODO:
      // overlay.addListener('click', () => {
      //   if (this.isEnabled()) {
      //     this.setSelectionCell(cell)
      //   }
      // })
    }

    return this.addOverlay(cell, overlay)
  }

  // #endregion

  // #region :::::::::::: Style

  getCellStyle(cell: Cell | null) {
    if (cell != null) {
      const defaultStyle = this.model.isEdge(cell)
        ? this.graph.styleSheet.getDefaultEdgeStyle()
        : this.graph.styleSheet.getDefaultNodeStyle()

      const style = this.model.getStyle(cell) || {}
      return {
        ...defaultStyle,
        ...style,
      }
    }

    return {}
  }

  setCellStyle(style: CellStyle, cells: Cell[]) {
    if (cells != null) {
      this.model.batchUpdate(() => {
        cells.forEach(cell => this.model.setStyle(cell, style))
      })
    }
  }

  toggleCellsStyle(
    key: string,
    defaultValue: boolean = false,
    cells: Cell[],
  ) {
    let value = null
    if (cells != null && cells.length > 0) {
      const state = this.view.getState(cells[0])
      const style = state != null ? state.style : this.getCellStyle(cells[0])
      if (style != null) {
        const cur = (style as any)[key]
        if (cur == null) {
          value = defaultValue
        } else {
          value = cur ? false : true
        }
        this.setCellsStyle(key, value, cells)
      }
    }

    return value
  }

  setCellsStyle(
    key: string,
    value?: string | number | boolean | null,
    cells?: Cell[],
  ) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach((cell) => {
          if (cell != null) {
            const raw = this.model.getStyle(cell)
            const style = raw != null ? { ...raw } : {}
            if (value == null) {
              delete (style as any)[key]
            } else {
              (style as any)[key] = value
            }
            this.model.setStyle(cell, style)
          }
        })
      })
    }
  }

  setCellStyleFlags(
    key: string,
    flag: number,
    value: boolean | null,
    cells: Cell[],
  ) {
    if (cells != null && cells.length > 0) {
      if (value == null) {
        const state = this.view.getState(cells[0])
        const style = state ? state.style : this.getCellStyle(cells[0])
        const current = parseInt((style as any)[key], 10) || 0
        value = !((current & flag) === flag) // tslint:disable-line
      }

      this.setCellsStyle(key, value ? flag : null, cells)
    }
  }

  // #endregion

  // #region :::::::::::: Align

  alignCells(
    align: Align | VAlign,
    cells: Cell[],
    param?: number,
  ) {
    if (cells != null && cells.length > 1) {
      // Finds the required coordinate for the alignment
      if (param == null) {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          const state = this.view.getState(cells[i])
          if (state != null && !this.model.isEdge(cells[i])) {
            if (param == null) {
              if (align === 'center') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = state.bounds.x + state.bounds.width / 2
                break
              } else if (align === 'right') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = state.bounds.x + state.bounds.width
              } else if (align === 'top') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = state.bounds.y
              } else if (align === 'middle') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = state.bounds.y + state.bounds.height / 2
                break
              } else if (align === 'bottom') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = state.bounds.y + state.bounds.height
              } else {
                // tslint:disable-next-line:no-parameter-reassignment
                param = state.bounds.x
              }
            } else {
              if (align === 'right') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = Math.max(param, state.bounds.x + state.bounds.width)
              } else if (align === 'top') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = Math.min(param, state.bounds.y)
              } else if (align === 'bottom') {
                // tslint:disable-next-line:no-parameter-reassignment
                param = Math.max(param, state.bounds.y + state.bounds.height)
              } else {
                // tslint:disable-next-line:no-parameter-reassignment
                param = Math.min(param, state.bounds.x)
              }
            }
          }
        }
      }

      // Aligns the cells to the coordinate
      if (param != null) {
        const s = this.view.scale
        this.model.beginUpdate()
        try {
          for (let i = 0, ii = cells.length; i < ii; i += 1) {
            const state = this.view.getState(cells[i])

            if (state != null) {
              let geo = this.graph.getCellGeometry(cells[i])

              if (geo != null && !this.model.isEdge(cells[i])) {
                geo = geo.clone()

                if (align === 'center') {
                  geo.bounds.x += (param - state.bounds.x - state.bounds.width / 2) / s
                } else if (align === 'right') {
                  geo.bounds.x += (param - state.bounds.x - state.bounds.width) / s
                } else if (align === 'top') {
                  geo.bounds.y += (param - state.bounds.y) / s
                } else if (align === 'middle') {
                  geo.bounds.y += (param - state.bounds.y - state.bounds.height / 2) / s
                } else if (align === 'bottom') {
                  geo.bounds.y += (param - state.bounds.y - state.bounds.height) / s
                } else {
                  geo.bounds.x += (param - state.bounds.x) / s
                }

                this.graph.resizeCell(cells[i], geo.bounds)
              }
            }
          }

          this.graph.trigger(Graph.events.alignCells, { align, cells })
        } finally {
          this.model.endUpdate()
        }
      }
    }

    return cells
  }

  //#endregion

  // #region :::::::::::: Flip

  flipEdge(edge: Cell) {
    if (edge != null && this.graph.alternateEdgeStyle != null) {
      this.model.batchUpdate(() => {
        const style = this.model.getStyle(edge)
        if (style == null) {
          this.model.setStyle(edge, this.graph.alternateEdgeStyle)
        } else {
          this.model.setStyle(edge, {})
        }

        // Removes all control points
        this.resetEdge(edge)
        this.graph.trigger(Graph.events.flipEdge, { edge })
      })
    }

    return edge
  }

  //#endregion

  // #region :::::::::::: Order

  orderCells(cells: Cell[], toBack: boolean) {
    this.model.batchUpdate(() => {
      this.graph.trigger(Graph.events.orderCells, { cells, toBack })
      this.cellsOrdered(cells, toBack)
    })
    return cells
  }

  protected cellsOrdered(cells: Cell[], toBack: boolean) {
    if (cells != null) {
      this.model.batchUpdate(() => {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          const parent = this.model.getParent(cells[i])!

          if (toBack) {
            this.model.add(parent, cells[i], i)
          } else {
            this.model.add(
              parent, cells[i],
              this.model.getChildCount(parent) - 1,
            )
          }
        }
        this.graph.trigger(Graph.events.cellsOrdered, { cells, toBack })
      })
    }
  }

  //#endregion

  // #region :::::::::::: Drilldown

  enterGroup(cell: Cell) {
    if (cell != null && this.graph.isValidRoot(cell)) {
      this.view.setCurrentRoot(cell)
      this.graph.clearSelection()
    }
  }

  exitGroup() {
    const root = this.model.getRoot()
    const current = this.graph.getCurrentRoot()

    if (current != null) {
      let next = this.model.getParent(current)!

      // Finds the next valid root in the hierarchy
      while (next !== root && !this.graph.isValidRoot(next) &&
        this.model.getParent(next) !== root) {
        next = this.model.getParent(next)!
      }

      // Clears the current root if the new root is
      // the model's root or one of the layers.
      if (next === root || this.model.getParent(next) === root) {
        this.view.setCurrentRoot(null)
      } else {
        this.view.setCurrentRoot(next)
      }

      const state = this.view.getState(current)

      // Selects the previous root in the graph
      if (state != null) {
        this.graph.setSelectedCell(current)
      }
    }
  }

  home() {
    const current = this.graph.getCurrentRoot()
    if (current != null) {
      this.view.setCurrentRoot(null)
      const state = this.view.getState(current)
      if (state != null) {
        this.graph.setSelectedCell(current)
      }
    }
  }

  //#endregion

  // #region :::::::::::: Retrieval

  getDefaultParent(): Cell {
    let parent = this.graph.getCurrentRoot()
    if (parent == null) {
      parent = this.graph.defaultParent
      if (parent == null) {
        const root = this.model.getRoot()
        parent = this.model.getChildAt(root, 0)
      }
    }

    return parent!
  }

  getSwimlane(cell: Cell | null) {
    let result = cell
    while (result != null && !this.graph.isSwimlane(result)) {
      result = this.model.getParent(result)
    }
    return result
  }

  getSwimlaneAt(x: number, y: number, parent: Cell): Cell | null {
    const count = this.model.getChildCount(parent)
    for (let i = 0; i < count; i += 1) {
      const child = this.model.getChildAt(parent, i)!
      const result = this.getSwimlaneAt(x, y, child)

      if (result != null) {
        return result
      }

      if (this.graph.isSwimlane(child)) {
        const state = this.view.getState(child)
        if (this.intersects(state, x, y)) {
          return child
        }
      }
    }

    return null
  }

  getCellAt(
    x: number,
    y: number,
    parent?: Cell | null,
    includeNodes: boolean = true,
    includeEdges: boolean = true,
    ignoreFn?: (state: State, x?: number, y?: number) => boolean,
  ): Cell | null {
    if (parent == null) {
      // tslint:disable-next-line
      parent = this.graph.getCurrentRoot() || this.model.getRoot()
    }

    if (parent != null) {
      const childCount = this.model.getChildCount(parent)
      for (let i = childCount - 1; i >= 0; i -= 1) {
        const cell = this.model.getChildAt(parent, i)!
        const result = this.getCellAt(x, y, cell, includeNodes, includeEdges, ignoreFn)!
        if (result != null) {
          return result
        }

        if (
          this.graph.isCellVisible(cell) && (
            includeEdges && this.model.isEdge(cell) ||
            includeNodes && this.model.isNode(cell)
          )
        ) {
          const state = this.view.getState(cell)
          if (
            state != null &&
            (ignoreFn == null || !ignoreFn(state, x, y)) &&
            this.intersects(state, x, y)
          ) {
            return cell
          }
        }
      }
    }

    return null
  }

  /**
   * Returns the bottom-most cell that intersects the given point (x, y)
   */
  protected intersects(state: State | null, x: number, y: number) {
    if (state != null) {
      const points = state.absolutePoints
      if (points != null) {
        const t2 = this.graph.tolerance * this.graph.tolerance
        let pt = points[0]!
        for (let i = 1; i < points.length; i += 1) {
          const next = points[i]!
          const dist = util.ptSegmentDist(pt.x, pt.y, next.x, next.y, x, y)
          if (dist <= t2) {
            return true
          }

          pt = next
        }
      } else {
        const alpha = util.toRad(state.style.rotation || 0)
        if (alpha !== 0) {
          const cos = Math.cos(-alpha)
          const sin = Math.sin(-alpha)
          const cx = state.bounds.getOrigin()
          const pt = util.rotatePoint(new Point(x, y), cos, sin, cx)
          if (state.bounds.containsPoint(pt)) {
            return true
          }
        }

        if (state.bounds.containsPoint(new Point(x, y))) {
          return true
        }
      }
    }

    return false
  }

  hitsSwimlaneContent(swimlane: Cell | null, x: number, y: number) {
    const state = this.view.getState(swimlane)
    const size = this.graph.getStartSize(swimlane)

    if (state != null) {
      const scale = this.view.scale
      const dx = x - state.bounds.x // tslint:disable-line
      const dy = y - state.bounds.y // tslint:disable-line

      if (size.width > 0 && dx > 0 && dx > size.width * scale) {
        return true
      }

      if (size.height > 0 && dy > 0 && dy > size.height * scale) {
        return true
      }
    }

    return false
  }

  getEdges(
    node: Cell,
    parent?: Cell | null,
    incoming: boolean = true,
    outgoing: boolean = true,
    includeLoops: boolean = true,
    recurse: boolean = false,
  ) {
    const result: Cell[] = []
    const edges: Cell[] = []
    const isCollapsed = this.graph.isCellCollapsed(node)

    node.eachChild((child) => {
      if (isCollapsed || !this.graph.isCellVisible(child)) {
        edges.push(...this.model.getEdges(child, incoming, outgoing))
      }
    })

    edges.push(...this.model.getEdges(node, incoming, outgoing))

    edges.forEach((edge) => {
      const [source, target] = this.getVisibleTerminals(edge)

      if (
        (includeLoops && source === target) ||
        (
          (source !== target) &&
          (
            (
              incoming &&
              target === node &&
              (parent == null || this.isValidAncestor(source!, parent, recurse))) ||
            (
              outgoing &&
              source === node &&
              (parent == null || this.isValidAncestor(target!, parent, recurse))
            )
          )
        )
      ) {
        result.push(edge)
      }
    })

    return result
  }

  protected getVisibleTerminals(edge: Cell) {
    const state = this.view.getState(edge)

    const source = state != null
      ? state.getVisibleTerminal(true)
      : this.view.getVisibleTerminal(edge, true)

    const target = state != null
      ? state.getVisibleTerminal(false)
      : this.view.getVisibleTerminal(edge, false)

    return [source, target]
  }

  protected isValidAncestor(cell: Cell, parent: Cell, recurse?: boolean) {
    return recurse
      ? this.model.isAncestor(parent, cell)
      : this.model.getParent(cell) === parent
  }

  getOpposites(
    edges: Cell[],
    terminal: Cell,
    includeSources: boolean = true,
    includeTargets: boolean = true,
  ) {
    const terminals: Cell[] = []
    const map = new WeakMap<Cell, boolean>()
    const add = (opposite: Cell) => {
      if (!map.get(opposite)) {
        map.set(opposite, true)
        terminals.push(opposite)
      }
    }

    edges && edges.forEach((edge) => {
      const [source, target] = this.getVisibleTerminals(edge)

      if (
        source === terminal &&
        target != null &&
        target !== terminal &&
        includeTargets
      ) {
        add(target)
      } else if (
        target === terminal &&
        source != null &&
        source !== terminal &&
        includeSources
      ) {
        add(source)
      }
    })

    return terminals
  }

  getEdgesBetween(source: Cell, target: Cell, directed: boolean = false) {
    const edges = this.getEdges(source)
    const result: Cell[] = []

    edges && edges.forEach((edge) => {
      const [s, t] = this.getVisibleTerminals(edge)
      if (
        (s === source && t === target) ||
        (!directed && s === target && t === source)
      ) {
        result.push(edge)
      }
    })

    return result
  }

  getCellsInRegion(
    x: number,
    y: number,
    width: number,
    height: number,
    parent: Cell,
    result: Cell[] = [],
  ) {
    if (width > 0 || height > 0) {
      const rect = new Rectangle(x, y, width, height)

      parent && parent.eachChild((cell) => {
        const state = this.view.getState(cell)
        if (state != null && this.graph.isCellVisible(cell)) {
          const rot = state.style.rotation || 0
          const bounds = rot === 0
            ? state.bounds
            : util.getBoundingBox(state.bounds, rot)

          if (
            (
              this.model.isEdge(cell) ||
              this.model.isNode(cell)
            ) &&
            rect.containsRect(bounds)
          ) {
            result.push(cell)
          } else {
            this.getCellsInRegion(x, y, width, height, cell, result)
          }
        }
      })
    }

    return result
  }

  getCellsBeyond(
    x0: number,
    y0: number,
    parent: Cell,
    rightHalfpane: boolean = false,
    bottomHalfpane: boolean = false,
  ) {
    const result: Cell[] = []

    if (rightHalfpane || bottomHalfpane) {
      parent && parent.eachChild((child) => {
        const state = this.view.getState(child)
        if (this.graph.isCellVisible(child) && state != null) {
          if (
            (!rightHalfpane || state.bounds.x >= x0) &&
            (!bottomHalfpane || state.bounds.y >= y0)
          ) {
            result.push(child)
          }
        }
      })
    }

    return result
  }

  findTreeRoots(
    parent: Cell | null,
    isolate: boolean = false,
    invert: boolean = false,
  ) {
    const roots: Cell[] = []

    let best = null
    let maxDiff = 0

    parent && parent.eachChild((cell) => {
      if (this.model.isNode(cell) && this.graph.isCellVisible(cell)) {
        const conns = this.graph.getConnections(cell, isolate ? parent : null)
        let fanOut = 0
        let fanIn = 0

        conns.forEach((conn) => {
          const src = this.view.getVisibleTerminal(conn, true)
          if (src === cell) {
            fanOut += 1
          } else {
            fanIn += 1
          }
        })

        if (
          (invert && fanOut === 0 && fanIn > 0) ||
          (!invert && fanIn === 0 && fanOut > 0)
        ) {
          roots.push(cell)
        }

        const diff = (invert) ? fanIn - fanOut : fanOut - fanIn

        if (diff > maxDiff) {
          maxDiff = diff
          best = cell
        }
      }
    })

    if (roots.length === 0 && best != null) {
      roots.push(best)
    }

    return roots
  }

  traverse(
    node: Cell,
    directed: boolean = true,
    func: (node: Cell, edge: Cell | null) => boolean,
    edge?: Cell,
    visited: WeakMap<Cell, boolean> = new WeakMap<Cell, boolean>(),
    inverse: boolean = false,
  ) {
    if (func != null && node != null) {
      if (!visited.get(node)) {
        visited.set(node, true)

        const result = func(node, edge || null)
        if (result == null || result) {
          node.eachEdge((edge) => {
            const isSource = this.model.getTerminal(edge, true) === node
            if (!directed || (!inverse === isSource)) {
              const next = this.model.getTerminal(edge, !isSource)!
              this.traverse(next, directed, func, edge, visited, inverse)
            }
          })
        }
      }
    }
  }

  // #endregion
}
