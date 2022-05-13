import {
  Basecoat,
  Model,
  Collection,
  Cell,
  Node,
  Edge,
  Renderer as ViewRenderer,
} from '@antv/x6-core'
import { NumberExt, Dom, KeyValue } from '@antv/x6-common'
import { Point, Rectangle } from '@antv/x6-geometry'
import * as Registry from '../registry'
import { Base } from './base'
import { GraphView } from './view'
import { EventArgs } from './events'
import { CSSManager as Css } from './css'
import { Options as GraphOptions } from './options'
import { DefsManager as Defs } from './defs'
import { GridManager as Grid } from './grid'
import { CoordManager as Coord } from './coord'
import { TransformManager as Transform } from './transform'
import { BackgroundManager as Background } from './background'

export class Graph extends Basecoat<EventArgs> {
  public readonly options: GraphOptions.Definition
  public readonly css: Css
  public readonly view: GraphView
  public readonly defs: Defs
  public readonly coord: Coord
  public readonly transform: Transform
  public readonly grid: Grid
  public readonly background: Background

  public readonly renderer: ViewRenderer

  protected get [Symbol.toStringTag]() {
    return Graph.toStringTag
  }

  constructor(options: Partial<GraphOptions.Manual>) {
    super()

    this.options = GraphOptions.get(options)
    this.css = new Css(this)
    this.view = new GraphView(this)
    this.defs = new Defs(this)
    this.coord = new Coord(this)
    this.transform = new Transform(this)
    this.grid = new Grid(this)
    this.background = new Background(this)

    this.renderer = new ViewRenderer(this, {
      container: this.view.stage,
    })
  }

  get model() {
    return this.renderer.model
  }

  // #region model

  isNode(cell: Cell): cell is Node {
    return cell.isNode()
  }

  isEdge(cell: Cell): cell is Edge {
    return cell.isEdge()
  }

  resetCells(cells: Cell[], options: Collection.SetOptions = {}) {
    this.model.resetCells(cells, options)
    return this
  }

  clearCells(options: Cell.SetOptions = {}) {
    this.model.clear(options)
    return this
  }

  toJSON(options: Model.ToJSONOptions = {}) {
    return this.model.toJSON(options)
  }

  parseJSON(data: Model.FromJSONData) {
    return this.model.parseJSON(data)
  }

  fromJSON(data: Model.FromJSONData, options: Model.FromJSONOptions = {}) {
    this.model.fromJSON(data, options)
    return this
  }

  getCellById(id: string) {
    return this.model.getCell(id)
  }

  addNode(metadata: Node.Metadata, options?: Model.AddOptions): Node
  addNode(node: Node, options?: Model.AddOptions): Node
  addNode(node: Node | Node.Metadata, options: Model.AddOptions = {}): Node {
    return this.model.addNode(node, options)
  }

  addNodes(nodes: (Node | Node.Metadata)[], options: Model.AddOptions = {}) {
    return this.addCell(
      nodes.map((node) => (Node.isNode(node) ? node : this.createNode(node))),
      options,
    )
  }

  createNode(metadata: Node.Metadata) {
    return this.model.createNode(metadata)
  }

  removeNode(nodeId: string, options?: Collection.RemoveOptions): Node | null
  removeNode(node: Node, options?: Collection.RemoveOptions): Node | null
  removeNode(node: Node | string, options: Collection.RemoveOptions = {}) {
    return this.model.removeCell(node as Node, options) as Node
  }

  addEdge(metadata: Edge.Metadata, options?: Model.AddOptions): Edge
  addEdge(edge: Edge, options?: Model.AddOptions): Edge
  addEdge(edge: Edge | Edge.Metadata, options: Model.AddOptions = {}): Edge {
    return this.model.addEdge(edge, options)
  }

  addEdges(edges: (Edge | Edge.Metadata)[], options: Model.AddOptions = {}) {
    return this.addCell(
      edges.map((edge) => (Edge.isEdge(edge) ? edge : this.createEdge(edge))),
      options,
    )
  }

  removeEdge(edgeId: string, options?: Collection.RemoveOptions): Edge | null
  removeEdge(edge: Edge, options?: Collection.RemoveOptions): Edge | null
  removeEdge(edge: Edge | string, options: Collection.RemoveOptions = {}) {
    return this.model.removeCell(edge as Edge, options) as Edge
  }

  createEdge(metadata: Edge.Metadata) {
    return this.model.createEdge(metadata)
  }

  addCell(cell: Cell | Cell[], options: Model.AddOptions = {}) {
    this.model.addCell(cell, options)
    return this
  }

  removeCell(cellId: string, options?: Collection.RemoveOptions): Cell | null
  removeCell(cell: Cell, options?: Collection.RemoveOptions): Cell | null
  removeCell(cell: Cell | string, options: Collection.RemoveOptions = {}) {
    return this.model.removeCell(cell as Cell, options)
  }

  removeCells(cells: (Cell | string)[], options: Cell.RemoveOptions = {}) {
    return this.model.removeCells(cells, options)
  }

  removeConnectedEdges(cell: Cell | string, options: Cell.RemoveOptions = {}) {
    return this.model.removeConnectedEdges(cell, options)
  }

  disconnectConnectedEdges(cell: Cell | string, options: Edge.SetOptions = {}) {
    this.model.disconnectConnectedEdges(cell, options)
    return this
  }

  hasCell(cellId: string): boolean
  hasCell(cell: Cell): boolean
  hasCell(cell: string | Cell): boolean {
    return this.model.has(cell as Cell)
  }

  getCells() {
    return this.model.getCells()
  }

  getCellCount() {
    return this.model.total()
  }

  /**
   * Returns all the nodes in the graph.
   */
  getNodes() {
    return this.model.getNodes()
  }

  /**
   * Returns all the edges in the graph.
   */
  getEdges() {
    return this.model.getEdges()
  }

  /**
   * Returns all outgoing edges for the node.
   */
  getOutgoingEdges(cell: Cell | string) {
    return this.model.getOutgoingEdges(cell)
  }

  /**
   * Returns all incoming edges for the node.
   */
  getIncomingEdges(cell: Cell | string) {
    return this.model.getIncomingEdges(cell)
  }

  /**
   * Returns edges connected with cell.
   */
  getConnectedEdges(
    cell: Cell | string,
    options: Model.GetConnectedEdgesOptions = {},
  ) {
    return this.model.getConnectedEdges(cell, options)
  }

  /**
   * Returns an array of all the roots of the graph.
   */
  getRootNodes() {
    return this.model.getRoots()
  }

  /**
   * Returns an array of all the leafs of the graph.
   */
  getLeafNodes() {
    return this.model.getLeafs()
  }

  /**
   * Returns `true` if the node is a root node, i.e.
   * there is no  edges coming to the node.
   */
  isRootNode(cell: Cell | string) {
    return this.model.isRoot(cell)
  }

  /**
   * Returns `true` if the node is a leaf node, i.e.
   * there is no edges going out from the node.
   */
  isLeafNode(cell: Cell | string) {
    return this.model.isLeaf(cell)
  }

  /**
   * Returns all the neighbors of node in the graph. Neighbors are all
   * the nodes connected to node via either incoming or outgoing edge.
   */
  getNeighbors(cell: Cell, options: Model.GetNeighborsOptions = {}) {
    return this.model.getNeighbors(cell, options)
  }

  /**
   * Returns `true` if `cell2` is a neighbor of `cell1`.
   */
  isNeighbor(
    cell1: Cell,
    cell2: Cell,
    options: Model.GetNeighborsOptions = {},
  ) {
    return this.model.isNeighbor(cell1, cell2, options)
  }

  getSuccessors(cell: Cell, options: Model.GetPredecessorsOptions = {}) {
    return this.model.getSuccessors(cell, options)
  }

  /**
   * Returns `true` if `cell2` is a successor of `cell1`.
   */
  isSuccessor(
    cell1: Cell,
    cell2: Cell,
    options: Model.GetPredecessorsOptions = {},
  ) {
    return this.model.isSuccessor(cell1, cell2, options)
  }

  getPredecessors(cell: Cell, options: Model.GetPredecessorsOptions = {}) {
    return this.model.getPredecessors(cell, options)
  }

  /**
   * Returns `true` if `cell2` is a predecessor of `cell1`.
   */
  isPredecessor(
    cell1: Cell,
    cell2: Cell,
    options: Model.GetPredecessorsOptions = {},
  ) {
    return this.model.isPredecessor(cell1, cell2, options)
  }

  getCommonAncestor(...cells: (Cell | null | undefined)[]) {
    return this.model.getCommonAncestor(...cells)
  }

  /**
   * Returns an array of cells that result from finding nodes/edges that
   * are connected to any of the cells in the cells array. This function
   * loops over cells and if the current cell is a edge, it collects its
   * source/target nodes; if it is an node, it collects its incoming and
   * outgoing edges if both the edge terminal (source/target) are in the
   * cells array.
   */
  getSubGraph(cells: Cell[], options: Model.GetSubgraphOptions = {}) {
    return this.model.getSubGraph(cells, options)
  }

  /**
   * Clones the whole subgraph (including all the connected links whose
   * source/target is in the subgraph). If `options.deep` is `true`, also
   * take into account all the embedded cells of all the subgraph cells.
   *
   * Returns a map of the form: { [original cell ID]: [clone] }.
   */
  cloneSubGraph(cells: Cell[], options: Model.GetSubgraphOptions = {}) {
    return this.model.cloneSubGraph(cells, options)
  }

  cloneCells(cells: Cell[]) {
    return this.model.cloneCells(cells)
  }

  /**
   * Returns an array of nodes whose bounding box contains point.
   * Note that there can be more then one node as nodes might overlap.
   */
  getNodesFromPoint(x: number, y: number): Node[]
  getNodesFromPoint(p: Point.PointLike): Node[]
  getNodesFromPoint(x: number | Point.PointLike, y?: number) {
    return this.model.getNodesFromPoint(x as number, y as number)
  }

  /**
   * Returns an array of nodes whose bounding box top/left coordinate
   * falls into the rectangle.
   */
  getNodesInArea(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Model.GetCellsInAreaOptions,
  ): Node[]
  getNodesInArea(
    rect: Rectangle.RectangleLike,
    options?: Model.GetCellsInAreaOptions,
  ): Node[]
  getNodesInArea(
    x: number | Rectangle.RectangleLike,
    y?: number | Model.GetCellsInAreaOptions,
    w?: number,
    h?: number,
    options?: Model.GetCellsInAreaOptions,
  ): Node[] {
    return this.model.getNodesInArea(
      x as number,
      y as number,
      w as number,
      h as number,
      options,
    )
  }

  getNodesUnderNode(
    node: Node,
    options: {
      by?: 'bbox' | Rectangle.KeyPoint
    } = {},
  ) {
    return this.model.getNodesUnderNode(node, options)
  }

  searchCell(
    cell: Cell,
    iterator: Model.SearchIterator,
    options: Model.SearchOptions = {},
  ) {
    this.model.search(cell, iterator, options)
    return this
  }

  /** *
   * Returns an array of IDs of nodes on the shortest
   * path between source and target.
   */
  getShortestPath(
    source: Cell | string,
    target: Cell | string,
    options: Model.GetShortestPathOptions = {},
  ) {
    return this.model.getShortestPath(source, target, options)
  }

  /**
   * Returns the bounding box that surrounds all cells in the graph.
   */
  getAllCellsBBox() {
    return this.model.getAllCellsBBox()
  }

  /**
   * Returns the bounding box that surrounds all the given cells.
   */
  getCellsBBox(cells: Cell[], options: Cell.GetCellsBBoxOptions = {}) {
    return this.model.getCellsBBox(cells, options)
  }

  startBatch(name: string | Model.BatchName, data: KeyValue = {}) {
    this.model.startBatch(name as Model.BatchName, data)
  }

  stopBatch(name: string | Model.BatchName, data: KeyValue = {}) {
    this.model.stopBatch(name as Model.BatchName, data)
  }

  batchUpdate<T>(execute: () => T, data?: KeyValue): T
  batchUpdate<T>(
    name: string | Model.BatchName,
    execute: () => T,
    data?: KeyValue,
  ): T
  batchUpdate<T>(
    arg1: string | Model.BatchName | (() => T),
    arg2?: (() => T) | KeyValue,
    arg3?: KeyValue,
  ): T {
    const name = typeof arg1 === 'string' ? arg1 : 'update'
    const execute = typeof arg1 === 'string' ? (arg2 as () => T) : arg1
    const data = typeof arg2 === 'function' ? arg3 : arg2
    this.startBatch(name, data)
    const result = execute()
    this.stopBatch(name, data)
    return result
  }

  updateCellId(cell: Cell, newId: string) {
    return this.model.updateCellId(cell, newId)
  }

  // #endregion

  // #region transform

  /**
   * Returns the current transformation matrix of the graph.
   */
  matrix(): DOMMatrix
  /**
   * Sets new transformation with the given `matrix`
   */
  matrix(mat: DOMMatrix | Dom.MatrixLike | null): this
  matrix(mat?: DOMMatrix | Dom.MatrixLike | null) {
    if (typeof mat === 'undefined') {
      return this.transform.getMatrix()
    }
    this.transform.setMatrix(mat)
    return this
  }

  resize(width?: number, height?: number) {
    this.transform.resize(width, height)
    return this
  }

  scale(): Dom.Scale
  scale(sx: number, sy?: number, cx?: number, cy?: number): this
  scale(sx?: number, sy: number = sx as number, cx = 0, cy = 0) {
    if (typeof sx === 'undefined') {
      return this.transform.getScale()
    }
    this.transform.scale(sx, sy, cx, cy)
    return this
  }

  zoom(): number
  zoom(factor: number, options?: Transform.ZoomOptions): this
  zoom(factor?: number, options?: Transform.ZoomOptions) {
    if (typeof factor === 'undefined') {
      return this.transform.getZoom()
    }
    this.transform.zoom(factor, options)

    return this
  }

  zoomTo(
    factor: number,
    options: Omit<Transform.ZoomOptions, 'absolute'> = {},
  ) {
    this.transform.zoom(factor, { ...options, absolute: true })

    return this
  }

  zoomToRect(
    rect: Rectangle.RectangleLike,
    options: Transform.ScaleContentToFitOptions &
      Transform.ScaleContentToFitOptions = {},
  ) {
    this.transform.zoomToRect(rect, options)

    return this
  }

  zoomToFit(
    options: Transform.GetContentAreaOptions &
      Transform.ScaleContentToFitOptions = {},
  ) {
    this.transform.zoomToFit(options)

    return this
  }

  rotate(): Dom.Rotation
  rotate(angle: number, cx?: number, cy?: number): this
  rotate(angle?: number, cx?: number, cy?: number) {
    if (typeof angle === 'undefined') {
      return this.transform.getRotation()
    }

    this.transform.rotate(angle, cx, cy)
    return this
  }

  translate(): Dom.Translation
  translate(tx: number, ty: number): this
  translate(tx?: number, ty?: number) {
    if (typeof tx === 'undefined') {
      return this.transform.getTranslation()
    }

    this.transform.translate(tx, ty as number)
    return this
  }

  translateBy(dx: number, dy: number): this {
    const ts = this.translate()
    const tx = ts.tx + dx
    const ty = ts.ty + dy
    return this.translate(tx, ty)
  }

  getGraphArea() {
    return this.transform.getGraphArea()
  }

  getContentArea(options: Transform.GetContentAreaOptions = {}) {
    return this.transform.getContentArea(options)
  }

  getContentBBox(options: Transform.GetContentAreaOptions = {}) {
    return this.transform.getContentBBox(options)
  }

  fitToContent(
    gridWidth?: number,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: Transform.FitToContentOptions,
  ): Rectangle
  fitToContent(options?: Transform.FitToContentFullOptions): Rectangle
  fitToContent(
    gridWidth?: number | Transform.FitToContentFullOptions,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: Transform.FitToContentOptions,
  ) {
    return this.transform.fitToContent(gridWidth, gridHeight, padding, options)
  }

  scaleContentToFit(options: Transform.ScaleContentToFitOptions = {}) {
    this.transform.scaleContentToFit(options)
    return this
  }

  centerCell(cell: Cell) {
    this.transform.centerCell(cell)
    return this
  }

  positionPoint(
    point: Point.PointLike,
    x: number | string,
    y: number | string,
  ) {
    this.transform.positionPoint(point, x, y)
    return this
  }

  // #endregion

  // #region coord

  snapToGrid(p: Point.PointLike): Point
  snapToGrid(x: number, y: number): Point
  snapToGrid(x: number | Point.PointLike, y?: number) {
    return this.coord.snapToGrid(x, y)
  }

  pageToLocal(rect: Rectangle.RectangleLike): Rectangle
  pageToLocal(x: number, y: number, width: number, height: number): Rectangle
  pageToLocal(p: Point.PointLike): Point
  pageToLocal(x: number, y: number): Point
  pageToLocal(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.pageToLocalRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.pageToLocalRect(x, y, width, height)
    }

    return this.coord.pageToLocalPoint(x, y)
  }

  localToPage(rect: Rectangle.RectangleLike): Rectangle
  localToPage(x: number, y: number, width: number, height: number): Rectangle
  localToPage(p: Point.PointLike): Point
  localToPage(x: number, y: number): Point
  localToPage(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.localToPageRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.localToPageRect(x, y, width, height)
    }

    return this.coord.localToPagePoint(x, y)
  }

  clientToLocal(rect: Rectangle.RectangleLike): Rectangle
  clientToLocal(x: number, y: number, width: number, height: number): Rectangle
  clientToLocal(p: Point.PointLike): Point
  clientToLocal(x: number, y: number): Point
  clientToLocal(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.clientToLocalRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.clientToLocalRect(x, y, width, height)
    }

    return this.coord.clientToLocalPoint(x, y)
  }

  localToClient(rect: Rectangle.RectangleLike): Rectangle
  localToClient(x: number, y: number, width: number, height: number): Rectangle
  localToClient(p: Point.PointLike): Point
  localToClient(x: number, y: number): Point
  localToClient(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.localToClientRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.localToClientRect(x, y, width, height)
    }

    return this.coord.localToClientPoint(x, y)
  }

  /**
   * Transform the rectangle `rect` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraph(rect: Rectangle.RectangleLike): Rectangle
  /**
   * Transform the rectangle `x`, `y`, `width`, `height` defined in the local
   * coordinate system to the graph coordinate system.
   */
  localToGraph(x: number, y: number, width: number, height: number): Rectangle
  /**
   * Transform the point `p` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraph(p: Point.PointLike): Point
  /**
   * Transform the point `x`, `y` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraph(x: number, y: number): Point
  localToGraph(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.localToGraphRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.localToGraphRect(x, y, width, height)
    }

    return this.coord.localToGraphPoint(x, y)
  }

  graphToLocal(rect: Rectangle.RectangleLike): Rectangle
  graphToLocal(x: number, y: number, width: number, height: number): Rectangle
  graphToLocal(p: Point.PointLike): Point
  graphToLocal(x: number, y: number): Point
  graphToLocal(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.graphToLocalRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.graphToLocalRect(x, y, width, height)
    }
    return this.coord.graphToLocalPoint(x, y)
  }

  clientToGraph(rect: Rectangle.RectangleLike): Rectangle
  clientToGraph(x: number, y: number, width: number, height: number): Rectangle
  clientToGraph(p: Point.PointLike): Point
  clientToGraph(x: number, y: number): Point
  clientToGraph(
    x: number | Point.PointLike | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.clientToGraphRect(x)
    }
    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.clientToGraphRect(x, y, width, height)
    }
    return this.coord.clientToGraphPoint(x, y)
  }

  // #endregion

  // #region defs

  defineFilter(options: Defs.FilterOptions) {
    return this.defs.filter(options)
  }

  defineGradient(options: Defs.GradientOptions) {
    return this.defs.gradient(options)
  }

  defineMarker(options: Defs.MarkerOptions) {
    return this.defs.marker(options)
  }

  // #endregion

  // #region grid

  getGridSize() {
    return this.grid.getGridSize()
  }

  setGridSize(gridSize: number) {
    this.grid.setGridSize(gridSize)
    return this
  }

  showGrid() {
    this.grid.show()
    return this
  }

  hideGrid() {
    this.grid.hide()
    return this
  }

  clearGrid() {
    this.grid.clear()
    return this
  }

  drawGrid(options?: Grid.DrawGridOptions) {
    this.grid.draw(options)
    return this
  }

  // #endregion

  // #region background

  updateBackground() {
    this.background.update()
    return this
  }

  drawBackground(options?: Background.Options) {
    this.background.draw(options)
    return this
  }

  clearBackground() {
    this.background.clear()
    return this
  }

  // #endregion

  // #region dispose

  @Basecoat.dispose()
  dispose() {
    this.clearCells()
    this.off()

    this.css.dispose()
    this.defs.dispose()
    this.grid.dispose()
    this.coord.dispose()
    this.transform.dispose()
    this.background.dispose()
    this.view.dispose()
    this.renderer.dispose()
  }

  // #endregion
}

export namespace Graph {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  export import View = GraphView
  export import Renderer = ViewRenderer
  export import CssManager = Css
  export import BaseManager = Base
  export import DefsManager = Defs
  export import GridManager = Grid
  export import CoordManager = Coord
  export import TransformManager = Transform
  export import BackgroundManager = Background
}

export namespace Graph {
  export interface Options extends GraphOptions.Manual {}
}

export namespace Graph {
  export const toStringTag = `X6.${Graph.name}`

  export function isGraph(instance: any): instance is Graph {
    if (instance == null) {
      return false
    }

    if (instance instanceof Graph) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const graph = instance as Graph

    if (
      (tag == null || tag === toStringTag) &&
      graph.view != null &&
      graph.model != null
    ) {
      return true
    }

    return false
  }
}

export namespace Graph {
  export function render(
    options: Partial<Options>,
    data?: Model.FromJSONData,
  ): Graph
  export function render(
    container: HTMLElement,
    data?: Model.FromJSONData,
  ): Graph
  export function render(
    options: Partial<Options> | HTMLElement,
    data?: Model.FromJSONData,
  ): Graph {
    const graph =
      options instanceof HTMLElement
        ? new Graph({ container: options })
        : new Graph(options)

    if (data != null) {
      graph.fromJSON(data)
    }

    return graph
  }
}

export namespace Graph {
  export const registerGrid = Registry.Grid.registry.register
  export const registerFilter = Registry.Filter.registry.register
  export const registerBackground = Registry.Background.registry.register
}

export namespace Graph {
  export const unregisterGrid = Registry.Grid.registry.unregister
  export const unregisterFilter = Registry.Filter.registry.unregister
  export const unregisterBackground = Registry.Background.registry.unregister
}
