import { Cell } from '../core/cell'
import { Geometry } from '../core/geometry'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class RollupAccessor extends BaseGraph {
  isEdge(cell: Cell) {
    return this.model.isEdge(cell)
  }

  isNode(cell: Cell) {
    return this.model.isNode(cell)
  }

  isOrphan(cell: Cell) {
    return this.model.isOrphan(cell)
  }

  isAncestor(ancestor: Cell, descendant: Cell) {
    return this.model.isAncestor(ancestor, descendant)
  }

  getAncestors(descendant: Cell): Cell[] {
    return this.model.getAncestors(descendant)
  }

  getDescendants(ancestor: Cell): Cell[] {
    return this.model.getDescendants(ancestor)
  }

  getParent(cell: Cell) {
    return this.model.getParent(cell)
  }

  getChildren(
    parent: Cell = this.getDefaultParent(),
    includeNodes: boolean = false,
    includeEdges: boolean = false,
  ) {
    return this.model.getChildren(parent, includeNodes, includeEdges)
  }

  getChildNodes(parent: Cell) {
    return this.getChildren(parent, true, false)
  }

  getChildEdges(parent: Cell) {
    return this.getChildren(parent, false, true)
  }

  @hook()
  isCellVisible(cell: Cell | null) {
    return cell != null ? this.model.isVisible(cell) : false
  }

  getVisibleChildren(
    parent: Cell = this.getDefaultParent(),
    includeNodes: boolean = false,
    includeEdges: boolean = false,
  ) {
    const cells = this.getChildren(parent, includeNodes, includeEdges)
    return cells.filter(cell => this.isCellVisible(cell))
  }

  getVisibleChildNodes(parent: Cell) {
    return this.getVisibleChildren(parent, true, false)
  }

  getVisibleChildEdges(parent: Cell) {
    return this.getVisibleChildren(parent, false, true)
  }

  getChildCount(parent: Cell) {
    return this.model.getChildCount(parent)
  }

  getChildAt(parent: Cell, index: number) {
    return this.model.getChildAt(parent, index)
  }

  getNearestCommonAncestor(cell1: Cell, cell2: Cell) {
    return this.model.getNearestCommonAncestor(cell1, cell2)
  }

  getTerminal(edge: Cell, isSource?: boolean) {
    return this.model.getTerminal(edge, isSource)
  }

  getTerminals(edge: Cell) {
    return [this.getTerminal(edge, true), this.getTerminal(edge, false)]
  }

  setTerminals(edge: Cell, source: Cell | null, target: Cell | null) {
    this.model.setTerminals(edge, source, target)
    return this
  }

  setTerminal(edge: Cell, terminal: Cell | null, isSource: boolean = false) {
    this.model.setTerminal(edge, terminal, isSource)
    return this
  }

  getEdgesBetween(source: Cell, target: Cell, directed: boolean = false) {
    return this.model.getEdgesBetween(source, target, directed)
  }

  getOpposites(
    edges: Cell[],
    terminal: Cell,
    isSource: boolean = true,
    isTarget: boolean = true,
  ) {
    return this.model.getOpposites(edges, terminal, isSource, isTarget)
  }

  getTopmostCells(cells: Cell[]) {
    return this.model.getTopmostCells(cells)
  }

  getCellData(cell: Cell) {
    return this.model.getData(cell)
  }

  setCellData(cell: Cell, data: any) {
    this.model.setData(cell, data)
    return this
  }

  getCellGeometry(cell: Cell) {
    return this.model.getGeometry(cell)
  }

  setCellGeometry(cell: Cell, geometry: Geometry) {
    return this.model.setGeometry(cell, geometry)
  }

  batchUpdate<T>(update: () => T) {
    return this.model.batchUpdate(update)
  }
}
