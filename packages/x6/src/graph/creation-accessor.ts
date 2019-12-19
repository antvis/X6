import { Cell } from '../core/cell'
import { afterCreate, hook } from './decorator'
import { Data } from './creation-manager'
import { BaseGraph } from './base-graph'

export class CreationAccessor extends BaseGraph {
  render(data: Data) {
    this.creationManager.render(data)
    return this
  }

  @afterCreate()
  createNode(options: Cell.CreateNodeOptions = {}): Cell {
    return Cell.createNode(options)
  }

  @afterCreate()
  createEdge(options: Cell.CreateEdgeOptions = {}): Cell {
    return Cell.createEdge(options)
  }

  addNode(options: CreationManager.AddNodeOptions): Cell
  addNode(node: Cell, parent?: Cell, index?: number): Cell
  addNode(
    node?: Cell | CreationManager.AddNodeOptions,
    parent?: Cell,
    index?: number,
  ): Cell {
    if (node instanceof Cell) {
      return this.addNodes([node], parent, index)[0]
    }

    const options = node != null ? node : {}
    const { parent: p, index: i, ...others } = options
    const cell = this.createNode(others)
    return this.addNodes([cell], p, i)[0]
  }

  addNodes(nodes: Cell[], parent?: Cell, index?: number): Cell[] {
    return this.addCells(nodes, parent, index)
  }

  addEdge(options: CreationManager.AddEdgeOptions): Cell
  addEdge(
    edge: Cell,
    parent?: Cell,
    source?: Cell,
    target?: Cell,
    index?: number,
  ): Cell
  addEdge(
    edge?: Cell | CreationManager.AddEdgeOptions,
    parent?: Cell,
    source?: Cell,
    target?: Cell,
    index?: number,
  ) {
    if (edge instanceof Cell) {
      return this.addCell(edge, parent, index, source, target)
    }
    const options = edge != null ? edge : {}
    const cell = this.createEdge(options)

    this.addCell(
      cell,
      options.parent,
      options.index,
      options.source,
      options.target,
    )

    if (this.resetEdgesOnConnect && options.points != null) {
      options.points.forEach(p => cell.geometry!.addPoint(p))
    }

    return cell
  }

  /**
   * Adds the cell to the parent and connects it to the given source and
   * target terminals.
   *
   * @param cell - `Cell` to be inserted into the given parent.
   * @param parent - `Cell` that represents the new parent. If no parent is
   * given then the default parent is used.
   * @param index - Optional index to insert the cells at.
   * @param source - Optional `Cell` that represents the source terminal.
   * @param target - Optional `Cell` that represents the target terminal.
   */
  addCell(
    cell: Cell,
    parent?: Cell,
    index?: number,
    source?: Cell,
    target?: Cell,
  ) {
    return this.addCells([cell], parent, index, source, target)[0]
  }

  /**
   * Adds the cells to the parent at the given index, connecting each cell to
   * the optional source and target terminal.
   *
   * @param cells - Array of `Cell`s to be inserted.
   * @param parent - `Cell` that represents the new parent. If no parent is
   * given then the default parent is used.
   * @param index - Optional index to insert the cells at.
   * @param source - Optional source `Cell` for all inserted cells.
   * @param target - Optional target `Cell` for all inserted cells.
   */
  addCells(
    cells: Cell[],
    parent: Cell = this.getDefaultParent()!,
    index: number = this.model.getChildCount(parent),
    source?: Cell,
    target?: Cell,
  ) {
    return this.creationManager.addCells(cells, parent, index, source, target)
  }

  duplicateCells(
    cells: Cell[] = this.getSelectedCells(),
    append: boolean = true,
  ) {
    return this.creationManager.duplicateCells(cells, append)
  }

  turnCells(cells: Cell[] = this.getSelectedCells()) {
    return this.creationManager.turnCells(cells)
  }

  @hook()
  isCellDeletable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsDeletable() && style.deletable !== false
  }

  getDeletableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellDeletable(cell))
  }

  deleteCells(
    cells: Cell[] = this.getDeletableCells(this.getSelectedCells()),
    includeEdges: boolean = true,
    selectParentAfterDelete: boolean = true,
  ) {
    return this.creationManager.deleteCells(
      cells,
      includeEdges,
      selectParentAfterDelete,
    )
  }

  /**
   * Removes the given cells from the graph including all connected
   * edges if `includeEdges` is `true`.
   */
  removeCells(
    cells: Cell[] = this.getDeletableCells(this.getSelectedCells()),
    includeEdges: boolean = true,
  ) {
    return this.creationManager.removeCells(cells, includeEdges)
  }

  /**
   * Returns the cells which may be exported in the given array of cells.
   */
  getCloneableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellCloneable(cell))
  }

  @hook()
  isCellCloneable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsCloneable() && style.cloneable !== false
  }

  /**
   * Returns the clone for the given cell.
   *
   * @param cell `Cell` to be cloned.
   * @param allowInvalidEdges Optional boolean that specifies if invalid
   * edges should be cloned.  Default is `true`.
   * @param mapping Optional mapping for existing clones.
   * @param keepPosition Optional boolean indicating if the position
   * of the cells should be updated to reflect the lost parent cell.
   * Default is `false`.
   */
  cloneCell(
    cell: Cell,
    allowInvalidEdges: boolean = true,
    mapping: WeakMap<Cell, Cell> = new WeakMap<Cell, Cell>(),
    keepPosition: boolean = false,
  ) {
    return this.cloneCells([cell], allowInvalidEdges, mapping, keepPosition)[0]
  }

  /**
   * Returns the clones for the given cells. If the terminal of an edge is
   * not in the given array, then the respective end is assigned a terminal
   * point and the terminal is removed.
   *
   * @param cells - Array of `Cell`s to be cloned.
   * @param allowInvalidEdges - Optional boolean that specifies if
   * invalid edges should be cloned. Default is `true`.
   * @param mapping - Optional mapping for existing clones.
   * @param keepPosition - Optional boolean indicating if the position
   * of the cells should be updated to reflect the lost parent cell.
   * Default is `false`.
   */
  cloneCells(
    cells: Cell[],
    allowInvalidEdges: boolean = true,
    mapping: WeakMap<Cell, Cell> = new WeakMap<Cell, Cell>(),
    keepPosition: boolean = false,
  ) {
    return this.creationManager.cloneCells(
      cells,
      allowInvalidEdges,
      mapping,
      keepPosition,
    )
  }

  /**
   * Splits the given edge by adding the newEdge between the previous source
   * and the given cell and reconnecting the source of the given edge to the
   * given cell.
   *
   * @param edge The edge to be splitted.
   * @param cells The cells to insert into the edge.
   * @param newEdge The edge to be inserted.
   * @param dx The vector to move the cells.
   * @param dy The vector to move the cells.
   */
  splitEdge(
    edge: Cell,
    cells: Cell[],
    newEdge: Cell | null,
    dx: number = 0,
    dy: number = 0,
  ) {
    return this.creationManager.splitEdge(edge, cells, newEdge, dx, dy)
  }
}

export namespace CreationManager {
  export interface AddNodeOptions extends Cell.CreateNodeOptions {
    parent?: Cell
    index?: number
  }

  export interface AddEdgeOptions extends Cell.CreateEdgeOptions {
    parent?: Cell
    index?: number
    source?: Cell
    target?: Cell
  }
}
