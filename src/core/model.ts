import * as util from '../util'
import { Events } from '../common'
import { Point } from '../struct'
import { Cell } from './cell'
import { CellPath } from './cell-path'
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

export class Model extends Events {
  private root: Cell
  private cells: { [id: string]: Cell }
  private currentEdit: UndoableEdit
  private maintainEdgeParent = true
  private ignoreRelativeEdgeParent = true

  constructor(root?: Cell) {
    super()
    this.currentEdit = this.createUndoableEdit()
    if (root != null) {
      this.setRoot(root)
    } else {
      this.clear()
    }
  }

  isNode(cell: Cell) {
    return cell != null ? cell.isNode() : false
  }

  isEdge(cell: Cell) {
    return cell != null ? cell.isEdge() : false
  }

  isConnectable(cell: Cell) {
    return cell != null ? cell.isConnectable() : false
  }

  getDefaultParent() {
    return this.getRoot().getChildAt(0)
  }

  isOrphan(cell: Cell): boolean {
    return cell != null ? cell.isOrphan() : true
  }

  isAncestor(ancestor: Cell, descendant: Cell): boolean {
    return ancestor.isAncestor(descendant)
  }

  contains(cell: Cell): boolean
  contains(ancestor: Cell, descendant?: Cell): boolean {
    if (descendant == null) {
      descendant = ancestor // tslint:disable-line:no-parameter-reassignment
      ancestor = this.root  // tslint:disable-line:no-parameter-reassignment
    }

    return this.isAncestor(ancestor, descendant)
  }

  getAncestors(descendant: Cell): Cell[] {
    return descendant != null ? descendant.getAncestors() : []
  }

  getDescendants(ancestor: Cell): Cell[] {
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

    parent.eachChild((child) => {
      result.push(...this.filterDescendants(filter, child))
    })

    return result
  }

  getChildCells(
    parent: Cell,
    includeNodes: boolean = false,
    includeEdges: boolean = false,
  ) {
    const result: Cell[] = []
    parent.eachChild((child) => {
      if (
        (!includeEdges && !includeNodes) ||
        (includeEdges && this.isEdge(child)) ||
        (includeNodes && this.isNode(child))
      ) {
        result.push(child)
      }
    })
    return result
  }

  // #region cell id

  public cellIdPrefix: string = 'cell-'
  public cellIdPostfix: string = ''
  public autoCreateCellId: boolean = true
  private nextCellId: number = 0
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

  isRoot(cell: Cell) {
    return (cell != null && this.root === cell)
  }

  createRoot() {
    const root = new Cell()
    root.insertChild(this.createLayer())
    return root
  }

  getRoot(cell?: Cell) {
    let root: Cell = this.root
    let curr = cell

    while (curr != null) {
      root = curr
      curr = this.getParent(curr) as any
    }

    return root
  }

  setRoot(root: Cell | null) {
    this.execute(new RootChange(this, root))
  }

  doRootChange(newRoot: Cell) {
    const prev = this.root
    this.root = newRoot
    this.cells = {}
    this.nextCellId = 0
    this.cellAdded(newRoot)
    return prev
  }

  // #endregion

  // #region layer

  createLayer(): Cell {
    return new Cell()
  }

  isLayer(cell: Cell): boolean {
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
    util.forEach(this.getLayers(), iterator, context)
  }

  // #endregion

  getCell(id: string) {
    return this.cells != null ? this.cells[id] : null
  }

  getParent(cell: Cell) {
    return cell != null ? cell.getParent() : null
  }

  getChildren(
    parent: Cell,
    isNode: boolean = false,
    isEdge: boolean = false,
  ) {
    const result: Cell[] = []
    const children = parent != null ? parent.getChildren() : null
    if (children && children.length) {
      children.forEach((child) => {
        if (
          (!isEdge && !isNode) ||
          (isEdge && this.isEdge(child)) ||
          (isNode && this.isNode(child))
        ) {
          result.push(child)
        }
      })
    }

    return result
  }

  getChildNodes(parent: Cell) {
    return this.getChildren(parent, true, false)
  }

  getChildEdges(parent: Cell) {
    return this.getChildren(parent, false, true)
  }

  getChildCount(cell: Cell | null) {
    return cell != null ? cell.getChildCount() : 0
  }

  getChildAt(cell: Cell, index: number) {
    return cell != null ? cell.getChildAt(index) : null
  }

  eachChild(
    cell: Cell,
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
    return util.filter(cells, filter, thisArg)
  }

  getNearestCommonAncestor(cell1: Cell, cell2: Cell) {
    if (cell1 != null && cell2 != null) {
      let path2 = CellPath.create(cell2)
      if (path2 != null && path2.length > 0) {
        let cell: Cell | null = cell1
        let current = CellPath.create(cell)

        // exchange
        if (path2.length < current.length) {
          cell = cell2
          const tmp = current
          current = path2
          path2 = tmp
        }

        while (cell != null) {
          const parent = this.getParent(cell)
          if (
            path2.indexOf(current + CellPath.PATH_SEPARATOR) === 0 &&
            parent != null
          ) {
            return cell
          }

          current = CellPath.getParentPath(current)
          cell = parent
        }
      }
    }

    return null
  }

  /**
   * 将 `cell` 插入到指定的 `parent` 中
   */
  add(parent: Cell, child: Cell, index?: number) {
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

  cellAdded(cell: Cell) {
    if (cell != null) {
      if (cell.getId() == null && this.autoCreateCellId) {
        cell.setId(this.createCellId(cell))
      }

      if (cell.getId() != null) {
        let collision = this.getCell(cell.getId()!)
        if (collision !== cell) {
          // 创建新 ID 直到没有检查到重复元素为止
          while (collision != null) {
            cell.setId(this.createCellId(cell))
            collision = this.getCell(cell.getId()!)
          }

          if (this.cells == null) {
            this.cells = {}
          }

          this.cells[cell.getId()!] = cell
        }
      }

      // 确保被删除元素的 ID 不会被重复使用
      if (util.isNumeric(cell.getId())) {
        this.nextCellId = Math.max(this.nextCellId, +(cell.getId()!))
      }

      // 递归处理所有子元素
      cell.eachChild(child => this.cellAdded(child))
    }
  }

  updateEdgeParents(cell: Cell, ancestor: Cell = this.getRoot(cell)) {
    cell.eachChild(child => this.updateEdgeParents(child, ancestor))
    cell.eachEdge((edge) => {
      // Updates edge parent if edge and child have
      // a common ancestor node (does not need to be
      // the model root node)
      if (this.isAncestor(ancestor, edge)) {
        this.updateEdgeParent(edge, ancestor)
      }
    })
  }

  updateEdgeParent(edge: Cell, ancestor: Cell) {
    let sourceNode = this.getTerminal(edge, true)
    let targetNode = this.getTerminal(edge, false)
    let cell = null

    // Uses the first non-relative descendants of the source node
    while (
      sourceNode != null &&
      !this.isEdge(sourceNode) &&
      sourceNode.geometry != null &&
      sourceNode.geometry.relative
    ) {
      sourceNode = this.getParent(sourceNode)
    }

    // Uses the first non-relative descendants of the target node
    while (
      targetNode != null &&
      this.ignoreRelativeEdgeParent &&
      !this.isEdge(targetNode) &&
      targetNode.geometry != null &&
      targetNode.geometry.relative
    ) {
      targetNode = this.getParent(targetNode)
    }

    if (
      this.isAncestor(ancestor, sourceNode!) &&
      this.isAncestor(ancestor, targetNode!)
    ) {
      if (sourceNode === targetNode) {
        cell = this.getParent(sourceNode!)
      } else {
        cell = this.getNearestCommonAncestor(sourceNode!, targetNode!)
      }

      if (
        cell != null &&
        (
          this.getParent(cell) !== this.root ||
          this.isAncestor(cell, edge)
        ) &&
        this.getParent(edge) !== cell
      ) {
        let geo = this.getGeometry(edge)!
        if (geo != null) {
          const origin1 = this.getOrigin(this.getParent(edge)!)
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

  getOrigin(cell: Cell) {
    let result: Point
    if (cell != null) {
      result = this.getOrigin(this.getParent(cell)!)
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

  remove(cell: Cell) {
    if (cell === this.root) {
      this.setRoot(null)
    } else if (this.getParent(cell) != null) {
      this.execute(new ChildChange(this, null, cell))
    }
    return cell
  }

  cellRemoved(cell: Cell) {
    if (cell != null && this.cells != null) {
      cell.eachChild(child => this.cellRemoved(child))
      if (cell.getId() != null) {
        delete this.cells[cell.getId()!]
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
    const par = this.contains(parent!)
    const pre = this.contains(previous!)

    if (par && !pre) {
      this.cellAdded(cell)
    } else if (pre && !par) {
      this.cellRemoved(cell)
    }

    return previous
  }

  getTerminal(edge: Cell, isSource?: boolean) {
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

  setTerminals(edge: Cell, sourceNode: Cell, targetNode: Cell) {
    this.beginUpdate()
    this.setTerminal(edge, sourceNode, true)
    this.setTerminal(edge, targetNode, false)
    this.endUpdate()
  }

  getEdgeCount(node: Cell) {
    return node != null ? node.getEdgeCount() : 0
  }

  getDirectedEdgeCount(node: Cell, outgoing: boolean, ignoredEdge?: Cell) {
    let count = 0
    this.eachEdge(node, (edge) => {
      if (
        edge !== ignoredEdge &&
        this.getTerminal(edge, outgoing) === node
      ) {
        count += 1
      }
    })

    return count
  }

  getEdgeAt(node: Cell, index: number) {
    return node != null ? node.getEdgeAt(index) : null
  }

  getConnections(node: Cell) {
    return this.getEdges(node, true, true, false)
  }

  getIncomingEdges(node: Cell) {
    return this.getEdges(node, true, false, false)
  }

  getOutgoingEdges(node: Cell) {
    return this.getEdges(node, false, true, false)
  }

  getEdges(
    node: Cell,
    incoming: boolean = true,
    outgoing: boolean = true,
    includeLoops: boolean = true,
  ) {
    const result: Cell[] = []
    this.eachEdge(node, (edge) => {
      const sourceNode = this.getTerminal(edge, true)
      const targetNode = this.getTerminal(edge, false)
      if (
        (includeLoops && sourceNode === targetNode) ||
        (
          (sourceNode !== targetNode) &&
          (
            (incoming && targetNode === node) ||
            (outgoing && sourceNode === node)
          )
        )
      ) {
        result.push(edge)
      }
    })
    return result
  }

  eachEdge(
    node: Cell,
    iterator: (edge: Cell, index: number, edges: Cell[]) => void,
    thisArg?: any,
  ) {
    if (node != null) {
      node.eachEdge(iterator, thisArg)
    }
  }

  /**
   * 获取两个节点之间的边
   *
   * @param sourceNode 起始节点
   * @param targetNode 终止节点
   * @param directed 为 `true` 时要求边一定是从起始节点到终止节点
   */
  getEdgesBetween(
    sourceNode: Cell,
    targetNode: Cell,
    directed: boolean = false,
  ) {
    const tmp1 = this.getEdgeCount(sourceNode)
    const tmp2 = this.getEdgeCount(targetNode)

    // Assumes the source has less connected edges
    let terminal = sourceNode
    let edgeCount = tmp1

    // Uses the smaller array of connected edges
    // for searching the edge
    if (tmp2 < tmp1) {
      edgeCount = tmp2
      terminal = targetNode
    }

    const result = []

    // Checks if the edge is connected to the correct
    // cell and returns the first match
    for (let i = 0; i < edgeCount; i += 1) {
      const edge = this.getEdgeAt(terminal, i)!
      const src = this.getTerminal(edge, true)
      const trg = this.getTerminal(edge, false)
      const directedMatch = (src === sourceNode) && (trg === targetNode)
      const oppositeMatch = (trg === sourceNode) && (src === targetNode)

      if (directedMatch || (!directed && oppositeMatch)) {
        result.push(edge)
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
      edges.forEach((edge) => {
        const sourceNode = this.getTerminal(edge, true)
        const targetNode = this.getTerminal(edge, false)
        if (
          // Checks if the terminal is the source of
          // the edge and if the target should be
          // stored in the result
          sourceNode === terminal &&
          targetNode != null &&
          targetNode !== terminal &&
          isTarget
        ) {
          terminals.push(targetNode)
        } else if (
          // Checks if the terminal is the taget of
          // the edge and if the source should be
          // stored in the result
          targetNode === terminal &&
          sourceNode != null &&
          sourceNode !== terminal &&
          isSource
        ) {
          terminals.push(sourceNode)
        }
      })
    }

    return terminals
  }

  /**
   * 获取一组节点中处于最顶层的节点
   */
  getTopmostCells(cells: Cell[]) {
    const dict = new WeakMap<Cell, boolean>()
    const rest: Cell[] = []

    cells.forEach(cell => dict.set(cell, true))
    cells.forEach((cell) => {
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

  getData(cell: Cell) {
    return cell != null ? cell.getData() : null
  }

  setData(cell: Cell, value: any) {
    this.execute(new DataChange(this, cell, value))
  }

  doDataChange(cell: Cell, newValue: any) {
    const previous = cell.getData()
    cell.setData(newValue)
    return previous
  }

  getGeometry(cell: Cell) {
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

  getStyle(cell: Cell) {
    return cell != null ? cell.getStyle() : null
  }

  setStyle(cell: Cell, style: string | null) {
    if (style !== this.getStyle(cell)) {
      this.execute(new StyleChange(this, cell, style))
    }
  }

  doStyleChange(cell: Cell, style: string) {
    const previous = this.getStyle(cell)
    cell.setStyle(style)
    return previous
  }

  isCollapsed(node: Cell) {
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

  isVisible(cell: Cell) {
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
    this.trigger(Model.eventNames.execute, change)
    change.execute()
    this.trigger(Model.eventNames.executed, change)

    this.beginUpdate()
    this.currentEdit.add(change)
    this.endUpdate()
  }

  beginUpdate() {
    this.updateLevel += 1
    this.trigger(Model.eventNames.beginUpdate)
    if (this.updateLevel === 1) {
      this.trigger(Model.eventNames.startEdit)
    }
  }

  endUpdate() {
    this.updateLevel -= 1
    if (this.updateLevel === 0) {
      this.trigger(Model.eventNames.endEdit)
    }

    if (!this.endingUpdate) {
      this.endingUpdate = this.updateLevel === 0
      const edit = this.currentEdit
      this.trigger(Model.eventNames.endUpdate, edit)

      try {
        if (this.endingUpdate && !this.currentEdit.isEmpty()) {
          this.trigger(Model.eventNames.beforeUndo, edit)
          this.currentEdit = this.createUndoableEdit()
          edit.notify()
          this.trigger(Model.eventNames.afterUndo, edit)
        }
      } finally {
        this.endingUpdate = false
      }
    }
  }

  batchUpdate(update: () => void) {
    this.beginUpdate()
    try {
      update()
    } finally {
      this.endUpdate()
    }
  }

  createUndoableEdit(significant: boolean = true) {
    return new UndoableEdit(this, {
      significant,
      onChange: (edit: UndoableEdit) => {
        this.trigger(Model.eventNames.change, edit.changes)
      },
    })
  }

  // #endregion

  mergeChildren(from: Cell, to: Cell, cloneAllEdges: boolean = true) {
    this.beginUpdate()
    try {
      const mapping: { [path: string]: Cell } = {}
      this.mergeChildrenImpl(from, to, cloneAllEdges, mapping)

      // Post-processes all edges in the mapping and
      // reconnects the terminals to the corresponding
      // cells in the target model
      for (const key in mapping) {
        const cell = mapping[key]
        let terminal = this.getTerminal(cell, true)

        if (terminal != null) {
          terminal = mapping[CellPath.create(terminal)]
          this.setTerminal(cell, terminal, true)
        }

        terminal = this.getTerminal(cell, false)

        if (terminal != null) {
          terminal = mapping[CellPath.create(terminal)]
          this.setTerminal(cell, terminal, false)
        }
      }
    } finally {
      this.endUpdate()
    }
  }

  private mergeChildrenImpl(
    from: Cell,
    to: Cell,
    cloneAllEdges: boolean,
    mapping: { [path: string]: Cell },
  ) {
    this.beginUpdate()
    try {
      from.eachChild((cell) => {
        const id = cell.getId()
        let target = (id != null && (!this.isEdge(cell) || !cloneAllEdges))
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

          // Do *NOT* use model.add as this will move the edge away
          // from the parent in updateEdgeParent if maintainEdgeParent
          // is enabled in the target model
          target = to.insertChild(cloned)
          this.cellAdded(target)
        }

        mapping[CellPath.create(cell)] = target!

        // 递归
        this.mergeChildrenImpl(cell, target, cloneAllEdges, mapping)
      })
    } finally {
      this.endUpdate()
    }
  }

  getParents(cells: Cell[]) {
    const parents: Cell[] = []
    if (cells != null) {
      const dict = new WeakMap<Cell, boolean>()
      cells.forEach((cell) => {
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
        clones.push(this.cloneCellImpl(cells[i], cache, includeChildren))
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
    cache: WeakMap<Cell, Cell>,
    includeChildren: boolean,
  ) {
    let clone = cache.get(cell)
    if (clone == null) {
      clone = cell.clone()
      cache.set(cell, clone)

      if (includeChildren) {
        cell.eachChild((child) => {
          const cloneChild = this.cloneCellImpl(child, cache, true)
          clone!.insertChild(cloneChild)
        })
      }
    }

    return clone
  }

  private restoreClone(clone: Cell, cell: Cell, cache: WeakMap<Cell, Cell>) {
    const sourceNode = this.getTerminal(cell, true)
    if (sourceNode != null) {
      const tmp = cache.get(sourceNode)
      if (tmp != null) {
        tmp.insertEdge(clone, true)
      }
    }

    const targetNode = this.getTerminal(cell, false)
    if (targetNode != null) {
      const tmp = cache.get(targetNode)
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
  export const eventNames = {
    change: 'change',
    execute: 'execute',
    executed: 'executed',
    beginUpdate: 'beginUpdate',
    endUpdate: 'endUpdate',
    startEdit: 'startEdit',
    endEdit: 'endEdit',
    beforeUndo: 'beforeUndo',
    afterUndo: 'afterUndo',
  }
}
