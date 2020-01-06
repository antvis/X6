import { Point } from '../geometry'
import { Events } from '../entity'
import { ArrayExt, NumberExt } from '../util'
import { Cell } from './cell'
import { Style } from '../types'
import { Geometry } from './geometry'
import {
  IChange,
  RootChange,
  DataChange,
  ChildChange,
  StyleChange,
  TerminalChange,
  CollapseChange,
  VisibleChange,
  GeometryChange,
  UndoableEdit,
} from '../change'

export class Model extends Events<Model.EventArgs> {
  private root: Cell
  private cells: { [id: string]: Cell }
  private currentEdit: UndoableEdit
  private maintainEdgeParent = true

  constructor(root?: Cell) {
    super()
    this.currentEdit = this.createUndoableEdit()
    if (root != null) {
      this.setRoot(root)
    } else {
      this.clear()
    }
  }

  // #region cell id

  public cellIdPrefix = 'cell-'
  public cellIdPostfix = ''
  public autoCreateCellId = true
  private nextCellId = 0

  private createCellId(cell: Cell) {
    const id = this.nextCellId
    this.nextCellId += 1
    return `${this.cellIdPrefix}${id}${this.cellIdPostfix}`
  }

  // #endregion

  // #region root

  clear() {
    this.setRoot(this.createRoot())
  }

  createRoot() {
    const root = new Cell()
    root.insertChild(this.createLayer())
    return root
  }

  isRoot(cell?: Cell | null) {
    return cell != null && this.root === cell
  }

  getRoot(cell?: Cell | null) {
    let root: Cell = this.root
    let curr = cell

    while (curr != null) {
      root = curr
      curr = this.getParent(curr) as any
    }

    return root
  }

  setRoot(root?: Cell | null) {
    this.execute(new RootChange(this, root))
  }

  doRootChange(newRoot: Cell) {
    const oldRoot = this.root
    this.root = newRoot
    this.cells = {}
    this.nextCellId = 0
    this.cellAdded(newRoot)
    return oldRoot
  }

  // #endregion

  // #region layer

  createLayer(): Cell {
    return new Cell()
  }

  isLayer(cell?: Cell | null): boolean {
    const parent = this.getParent(cell)
    return parent != null ? this.isRoot(parent) : false
  }

  getLayers(): Cell[] {
    return this.getRoot().children || []
  }

  eachLayer(
    iterator: (layer: Cell, index: number, layers: Cell[]) => void,
    context?: any,
  ) {
    ArrayExt.forEach(this.getLayers(), iterator, context)
  }

  // #endregion

  getCell(id: string | number) {
    return this.cells != null ? this.cells[id] : null
  }

  isNode(cell: Cell | null) {
    return cell != null ? cell.isNode() : false
  }

  isEdge(cell: Cell | null) {
    return cell != null ? cell.isEdge() : false
  }

  getDefaultParent() {
    return this.getRoot().getChildAt(0)
  }

  isOrphan(cell?: Cell | null): boolean {
    return cell != null ? cell.isOrphan() : true
  }

  isAncestor(ancestor: Cell, descendant?: Cell | null): boolean {
    return ancestor.isAncestor(descendant)
  }

  contains(cell: Cell | null): boolean
  contains(ancestor: Cell, descendant?: Cell | null): boolean {
    if (descendant === undefined) {
      descendant = ancestor // tslint:disable-line:no-parameter-reassignment
      ancestor = this.root // tslint:disable-line:no-parameter-reassignment
    }

    return this.isAncestor(ancestor, descendant)
  }

  getAncestors(descendant?: Cell | null): Cell[] {
    return descendant != null ? descendant.getAncestors() : []
  }

  getDescendants(ancestor: Cell | null): Cell[] {
    return ancestor != null ? ancestor.getDescendants() : []
  }

  filterDescendants(
    filter: (cell: Cell) => boolean,
    parent: Cell = this.getRoot(),
  ) {
    const result: Cell[] = []

    // Checks if the filter returns true for the cell
    // and adds it to the result array
    if (filter == null || filter(parent)) {
      result.push(parent)
    }

    parent.eachChild(child => {
      result.push(...this.filterDescendants(filter, child))
    })

    return result
  }

  getParent(cell?: Cell | null) {
    return cell != null ? cell.getParent() : null
  }

  getChildren(
    parent: Cell | null,
    includeNodes: boolean = false,
    includeEdges: boolean = false,
  ) {
    const result: Cell[] = []
    const children = parent != null ? parent.getChildren() : null
    if (children && children.length) {
      children.forEach(child => {
        if (
          (!includeEdges && !includeNodes) ||
          (includeEdges && this.isEdge(child)) ||
          (includeNodes && this.isNode(child))
        ) {
          result.push(child)
        }
      })
    }

    return result
  }

  getChildNodes(parent: Cell | null) {
    return this.getChildren(parent, true, false)
  }

  getChildEdges(parent: Cell | null) {
    return this.getChildren(parent, false, true)
  }

  getChildCount(cell: Cell | null) {
    return cell != null ? cell.getChildCount() : 0
  }

  getChildAt(cell: Cell | null, index: number) {
    return cell != null ? cell.getChildAt(index) : null
  }

  eachChild(
    cell: Cell | null,
    iterator: (child: Cell, index: number, children: Cell[]) => void,
    thisArg?: any,
  ) {
    if (cell != null) {
      cell.eachChild(iterator, thisArg)
    }
  }

  filterCells(
    cells: Cell[],
    filter: (cell: Cell, index: number, arr: Cell[]) => boolean,
    thisArg?: any,
  ): Cell[] {
    return ArrayExt.filter(cells, filter, thisArg)
  }

  getNearestCommonAncestor(cell1: Cell | null, cell2: Cell | null) {
    return Cell.getNearestCommonAncestor(cell1, cell2)
  }

  add(parent: Cell | null, child: Cell | null, index?: number) {
    if (child !== parent && parent != null && child != null) {
      if (index == null) {
        // tslint:disable-next-line
        index = this.getChildCount(parent)
      }

      const changed = parent !== this.getParent(child)
      this.execute(new ChildChange(this, parent, child, index))

      // Maintains the edges parents by moving the edges
      // into the nearest common ancestor of its terminals
      if (this.maintainEdgeParent && changed) {
        this.updateEdgeParents(child)
      }
    }

    return child
  }

  cellAdded(cell: Cell | null) {
    if (cell != null) {
      if (cell.getId() == null && this.autoCreateCellId) {
        cell.setId(this.createCellId(cell))
      }

      if (cell.getId() != null) {
        let collision = this.getCell(cell.getId()!)
        if (collision !== cell) {
          // ensure unique id
          while (collision != null) {
            const id = this.createCellId(cell)
            cell.setId(id)
            collision = this.getCell(id)
          }

          if (this.cells == null) {
            this.cells = {}
          }

          this.cells[cell.getId()!] = cell
        }
      }

      const id = cell.getId()
      if (id != null && NumberExt.isNumeric(id)) {
        this.nextCellId = Math.max(this.nextCellId, +id)
      }

      cell.eachChild(child => this.cellAdded(child))
    }
  }

  protected updateEdgeParents(cell: Cell, ancestor: Cell = this.getRoot(cell)) {
    cell.eachChild(child => this.updateEdgeParents(child, ancestor))
    cell.eachEdge(edge => {
      // Updates edge parent if edge and child have
      // a common ancestor node (does not need to be
      // the model's root node)
      if (this.isAncestor(ancestor, edge)) {
        this.updateEdgeParent(edge, ancestor)
      }
    })
  }

  protected getNonRelativeTerminal(edge: Cell, isSource: boolean) {
    let ret = this.getTerminal(edge, isSource)
    while (
      ret != null &&
      !this.isEdge(ret) &&
      ret.geometry != null &&
      ret.geometry.relative
    ) {
      ret = this.getParent(ret)
    }
    return ret
  }

  protected updateEdgeParent(edge: Cell, ancestor: Cell) {
    const source = this.getNonRelativeTerminal(edge, true)
    const target = this.getNonRelativeTerminal(edge, false)
    if (
      this.isAncestor(ancestor, source) &&
      this.isAncestor(ancestor, target)
    ) {
      const cell =
        source === target
          ? this.getParent(source)
          : this.getNearestCommonAncestor(source, target)

      if (
        cell != null &&
        (this.getParent(cell) !== this.root || this.isAncestor(cell, edge)) &&
        this.getParent(edge) !== cell
      ) {
        let geo = this.getGeometry(edge)
        if (geo != null) {
          const origin1 = this.getOrigin(this.getParent(edge))
          const origin2 = this.getOrigin(cell)

          const dx = origin2.x - origin1.x
          const dy = origin2.y - origin1.y

          geo = geo.clone()
          geo.translate(-dx, -dy)
          this.setGeometry(edge, geo)
        }

        this.add(cell, edge, this.getChildCount(cell))
      }
    }
  }

  protected getOrigin(cell: Cell | null) {
    let result: Point
    if (cell != null) {
      result = this.getOrigin(this.getParent(cell))
      if (!this.isEdge(cell)) {
        const geo = this.getGeometry(cell)
        if (geo != null) {
          result.x += geo.bounds.x
          result.y += geo.bounds.y
        }
      }
    } else {
      result = new Point()
    }

    return result
  }

  remove(cell: Cell | null) {
    if (cell != null) {
      if (cell === this.root) {
        this.setRoot(null)
      } else if (this.getParent(cell) != null) {
        this.execute(new ChildChange(this, null, cell))
      }
    }

    return cell
  }

  cellRemoved(cell: Cell | null) {
    if (cell != null && this.cells != null) {
      cell.eachChild(child => this.cellRemoved(child))
      const id = cell.getId()
      if (id != null) {
        delete this.cells[id]
      }
    }
  }

  doChildChange(cell: Cell, parent: Cell | null, index?: number) {
    const previous = this.getParent(cell)
    if (parent != null) {
      if (parent !== previous || previous.getChildIndex(cell) !== index) {
        parent.insertChild(cell, index)
      }
    } else if (previous != null) {
      previous.removeChild(cell)
    }

    // Adds or removes the cell from the model
    const par = this.contains(parent)
    const pre = this.contains(previous)

    if (par && !pre) {
      this.cellAdded(cell)
    } else if (pre && !par) {
      this.cellRemoved(cell)
    }

    return previous
  }

  getTerminal(edge: Cell | null, isSource?: boolean) {
    return edge != null ? edge.getTerminal(isSource) : null
  }

  setTerminal(edge: Cell, terminal: Cell | null, isSource: boolean = false) {
    const changed = terminal !== this.getTerminal(edge, isSource)
    this.execute(new TerminalChange(this, edge, terminal, isSource))
    if (this.maintainEdgeParent && changed) {
      this.updateEdgeParent(edge, this.getRoot())
    }
  }

  doTerminalChange(edge: Cell, terminal: Cell | null, isSource: boolean) {
    const previous = this.getTerminal(edge, isSource)
    if (terminal != null) {
      terminal.insertEdge(edge, isSource)
    } else if (previous != null) {
      previous.removeEdge(edge, isSource)
    }

    return previous
  }

  getTerminals(edge: Cell | null) {
    return [this.getTerminal(edge, true), this.getTerminal(edge, false)]
  }

  setTerminals(edge: Cell, source: Cell | null, target: Cell | null) {
    this.beginUpdate()
    this.setTerminal(edge, source, true)
    this.setTerminal(edge, target, false)
    this.endUpdate()
  }

  getEdgeCount(node: Cell | null) {
    return node != null ? node.getEdgeCount() : 0
  }

  /**
   * Get the count of incoming or outgoing edges, ignoring the given edge.
   *
   * @param node The node whose edge count should be returned.
   * @param outgoing Specifies if the number of outgoing or incoming
   * edges should be returned.
   * @param ignore The edge to be ignored.
   */
  getDirectedEdgeCount(
    node: Cell | null,
    outgoing: boolean,
    ignore?: Cell | null,
  ) {
    let count = 0
    this.eachEdge(node, edge => {
      if (edge !== ignore && this.getTerminal(edge, outgoing) === node) {
        count += 1
      }
    })

    return count
  }

  getEdgeAt(node: Cell | null, index: number) {
    return node != null ? node.getEdgeAt(index) : null
  }

  /**
   * Get all edges of the given cell without loops.
   */
  getConnections(node: Cell | null) {
    return this.getEdges(node, true, true, false)
  }

  /**
   * Get the incoming edges of the given cell without loops.
   */
  getIncomingEdges(node: Cell | null) {
    return this.getEdges(node, true, false, false)
  }

  /**
   * Get the outgoing edges of the given cell without loops.
   */
  getOutgoingEdges(node: Cell | null) {
    return this.getEdges(node, false, true, false)
  }

  getEdges(
    node: Cell | null,
    incoming: boolean = true,
    outgoing: boolean = true,
    includeLoops: boolean = true,
  ) {
    const result: Cell[] = []
    this.eachEdge(node, edge => {
      const source = this.getTerminal(edge, true)
      const target = this.getTerminal(edge, false)
      if (
        (includeLoops && source === target) ||
        (source !== target &&
          ((incoming && target === node) || (outgoing && source === node)))
      ) {
        result.push(edge)
      }
    })
    return result
  }

  eachEdge(
    node: Cell | null,
    iterator: (edge: Cell, index: number, edges: Cell[]) => void,
    thisArg?: any,
  ) {
    if (node != null) {
      node.eachEdge(iterator, thisArg)
    }
  }

  /**
   * Get all edges between the given source and target node. If `directed`
   * is `true`, then only edges from the source to the target are returned,
   * otherwise, all edges between the two cells are returned.
   *
   * @param source The source node of the edge to be returned.
   * @param target The target node of the edge to be returned.
   * @param directed Optional boolean that specifies if the direction
   * of the edge should be taken into account. Default is `false`.
   */
  getEdgesBetween(
    source: Cell | null,
    target: Cell | null,
    directed: boolean = false,
  ) {
    const tmp1 = this.getEdgeCount(source)
    const tmp2 = this.getEdgeCount(target)

    // Assumes the source has less connected edges.
    let terminal = source
    let count = tmp1

    // Uses the smaller array of connected edges for searching the edge.
    if (tmp2 < tmp1) {
      count = tmp2
      terminal = target
    }

    const result = []

    // Checks if the edge is connected to the correct cell
    // and collects the first match.
    for (let i = 0; i < count; i += 1) {
      const edge = this.getEdgeAt(terminal, i)
      if (edge != null) {
        const [s, t] = this.getTerminals(edge)
        const directedMatch = s === source && t === target
        const oppositeMatch = t === source && s === target
        if (directedMatch || (!directed && oppositeMatch)) {
          result.push(edge)
        }
      }
    }

    return result
  }

  getOpposites(
    edges: Cell[],
    terminal: Cell,
    isSource: boolean = true,
    isTarget: boolean = true,
  ) {
    const terminals: Cell[] = []
    if (edges != null) {
      edges.forEach(edge => {
        const [source, target] = this.getTerminals(edge)
        if (
          // Checks if the terminal is the source of the edge
          // and if the target should be stored in the result.
          source === terminal &&
          target != null &&
          target !== terminal &&
          isTarget
        ) {
          terminals.push(target)
        } else if (
          // Checks if the terminal is the taget of the edge
          // and if the source should be stored in the result.
          target === terminal &&
          source != null &&
          source !== terminal &&
          isSource
        ) {
          terminals.push(source)
        }
      })
    }

    return terminals
  }

  getTopmostCells(cells: Cell[]) {
    const dict = new WeakMap<Cell, boolean>()
    const rest: Cell[] = []

    cells.forEach(cell => dict.set(cell, true))
    cells.forEach(cell => {
      let topmost = true
      let parent = this.getParent(cell)

      while (parent != null) {
        if (dict.get(parent)) {
          topmost = false
          break
        }

        parent = this.getParent(parent)
      }

      if (topmost) {
        rest.push(cell)
      }
    })

    return rest
  }

  getData(cell: Cell | null) {
    return cell != null ? cell.getData() : null
  }

  setData(cell: Cell, data: any) {
    this.execute(new DataChange(this, cell, data))
  }

  doDataChange(cell: Cell, newValue: any) {
    const previous = cell.getData()
    cell.setData(newValue)
    return previous
  }

  getGeometry(cell: Cell | null) {
    return cell != null ? cell.getGeometry() : null
  }

  setGeometry(cell: Cell, geometry: Geometry) {
    if (geometry !== this.getGeometry(cell)) {
      this.execute(new GeometryChange(this, cell, geometry))
    }
  }

  doGeometryChange(cell: Cell, geometry: Geometry) {
    const previous = this.getGeometry(cell)!
    cell.setGeometry(geometry)
    return previous
  }

  getStyle(cell: Cell | null) {
    return cell != null ? cell.getStyle() : null
  }

  setStyle(cell: Cell, style: Style) {
    if (style !== this.getStyle(cell)) {
      this.execute(new StyleChange(this, cell, style))
    }
  }

  doStyleChange(cell: Cell, style: Style) {
    const previous = this.getStyle(cell)!
    cell.setStyle(style)
    return previous
  }

  isCollapsed(node: Cell | null) {
    return node != null ? node.isCollapsed() : false
  }

  collapse(node: Cell) {
    this.setCollapsed(node, true)
  }

  expand(node: Cell) {
    this.setCollapsed(node, false)
  }

  toggleCollapse(node: Cell) {
    this.isCollapsed(node) ? this.expand(node) : this.collapse(node)
  }

  setCollapsed(node: Cell, collapsed: boolean) {
    if (collapsed !== this.isCollapsed(node)) {
      this.execute(new CollapseChange(this, node, collapsed))
    }
  }

  doCollapseChange(node: Cell, collapsed: boolean) {
    const previous = this.isCollapsed(node)
    node.setCollapsed(collapsed)
    return previous
  }

  isVisible(cell: Cell | null) {
    return cell != null ? cell.isVisible() : false
  }

  show(cell: Cell) {
    return this.setVisible(cell, true)
  }

  hide(cell: Cell) {
    return this.setVisible(cell, false)
  }

  toggleVisible(cell: Cell) {
    return this.isVisible(cell) ? this.hide(cell) : this.show(cell)
  }

  setVisible(cell: Cell, visible: boolean) {
    if (visible !== this.isVisible(cell)) {
      this.execute(new VisibleChange(this, cell, visible))
    }
  }

  doVisibleChange(cell: Cell, visible: boolean) {
    const previous = this.isVisible(cell)
    cell.setVisible(visible)
    return previous
  }

  // #region update

  private updateLevel: number = 0
  private endingUpdate: boolean = false

  execute(change: IChange) {
    this.trigger('execute', change)
    change.execute()
    this.trigger('executed', change)

    this.beginUpdate()
    this.currentEdit.add(change)
    this.endUpdate()
  }

  protected beginUpdate() {
    this.updateLevel += 1
    this.trigger('beginUpdate')
    if (this.updateLevel === 1) {
      this.trigger('startEdit')
    }
  }

  protected endUpdate() {
    this.updateLevel -= 1
    if (this.updateLevel === 0) {
      this.trigger('endEdit')
    }

    if (!this.endingUpdate) {
      this.endingUpdate = this.updateLevel === 0
      const edit = this.currentEdit
      this.trigger('endUpdate', edit)

      try {
        if (this.endingUpdate && !edit.isEmpty()) {
          this.trigger('beforeUndo', edit)
          this.currentEdit = this.createUndoableEdit()
          edit.notify()
          this.trigger('afterUndo', edit)
        }
      } finally {
        this.endingUpdate = false
      }
    }
  }

  batchUpdate<T>(update: () => T) {
    this.beginUpdate()
    let result
    try {
      result = update()
    } finally {
      this.endUpdate()
    }
    return result
  }

  createUndoableEdit(significant: boolean = true) {
    return new UndoableEdit(this, {
      significant,
      onChange: (edit: UndoableEdit) => {
        this.trigger('change', edit.changes)
      },
    })
  }

  // #endregion

  mergeChildren(from: Cell, to: Cell, cloneAllEdges: boolean = true) {
    this.batchUpdate(() => {
      const mapping: { [path: string]: Cell } = {}
      this.mergeChildrenImpl(from, to, cloneAllEdges, mapping)

      // Post-processes all edges in the mapping and reconnects the
      // terminals to the corresponding cells in the target model.
      for (const key in mapping) {
        const cell = mapping[key]
        let terminal = this.getTerminal(cell, true)
        if (terminal != null) {
          terminal = mapping[Cell.getCellPath(terminal)]
          this.setTerminal(cell, terminal, true)
        }

        terminal = this.getTerminal(cell, false)
        if (terminal != null) {
          terminal = mapping[Cell.getCellPath(terminal)]
          this.setTerminal(cell, terminal, false)
        }
      }
    })
  }

  private mergeChildrenImpl(
    from: Cell,
    to: Cell,
    cloneAllEdges: boolean,
    mapping: { [path: string]: Cell },
  ) {
    this.batchUpdate(() => {
      from.eachChild(cell => {
        const id = cell.getId()
        let target =
          id != null && (!this.isEdge(cell) || !cloneAllEdges)
            ? this.getCell(id)
            : null

        // Clones and adds the child if no cell exists for the id
        if (target == null) {
          const cloned = cell.clone()
          cloned.setId(id)

          // Sets the terminals from the original cell to the clone
          // because the lookup uses strings not cells in JS
          cloned.setTerminal(cell.getTerminal(true), true)
          cloned.setTerminal(cell.getTerminal(false), false)

          target = to.insertChild(cloned)
          this.cellAdded(target)
        }

        mapping[Cell.getCellPath(cell)] = target!

        this.mergeChildrenImpl(cell, target, cloneAllEdges, mapping)
      })
    })
  }

  getParents(cells: Cell[]) {
    const parents: Cell[] = []
    if (cells != null) {
      const dict = new WeakMap<Cell, boolean>()
      cells.forEach(cell => {
        const parent = this.getParent(cell)
        if (parent != null && !dict.get(parent)) {
          dict.set(parent, true)
          parents.push(parent)
        }
      })
    }

    return parents
  }

  cloneCell(cell: Cell) {
    if (cell != null) {
      return this.cloneCells([cell], true)[0]
    }

    return null
  }

  cloneCells(
    cells: Cell[],
    includeChildren: boolean,
    cache: WeakMap<Cell, Cell> = new WeakMap<Cell, Cell>(),
  ) {
    const clones = []
    for (let i = 0; i < cells.length; i += 1) {
      if (cells[i] != null) {
        clones.push(this.cloneCellImpl(cells[i], includeChildren, cache))
      } else {
        clones.push(null)
      }
    }

    for (let i = 0; i < clones.length; i += 1) {
      if (clones[i] != null) {
        this.restoreClone(clones[i]!, cells[i], cache)
      }
    }

    return clones
  }

  private cloneCellImpl(
    cell: Cell,
    includeChildren: boolean,
    cache: WeakMap<Cell, Cell>,
  ) {
    let clone = cache.get(cell)
    if (clone == null) {
      clone = cell.clone()
      cache.set(cell, clone)

      if (includeChildren) {
        cell.eachChild(child => {
          const cloneChild = this.cloneCellImpl(child, true, cache)
          clone!.insertChild(cloneChild)
        })
      }
    }

    return clone
  }

  private restoreClone(clone: Cell, cell: Cell, cache: WeakMap<Cell, Cell>) {
    const source = this.getTerminal(cell, true)
    if (source != null) {
      const tmp = cache.get(source)
      if (tmp != null) {
        tmp.insertEdge(clone, true)
      }
    }

    const target = this.getTerminal(cell, false)
    if (target != null) {
      const tmp = cache.get(target)
      if (tmp != null) {
        tmp.insertEdge(clone, false)
      }
    }

    clone.eachChild((c, i) => {
      this.restoreClone(c, this.getChildAt(cell, i)!, cache)
    })
  }
}

export namespace Model {
  export interface EventArgs {
    change: [IChange[]]
    execute: IChange
    executed: IChange
    beginUpdate?: null
    endUpdate: UndoableEdit
    startEdit?: null
    endEdit?: null
    beforeUndo: UndoableEdit
    afterUndo: UndoableEdit
  }
}
