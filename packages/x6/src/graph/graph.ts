import { Basecoat } from '../common'
import { NumberExt, Dom } from '../util'
import { Point, Rectangle } from '../geometry'
import { Cell, Node, Edge, Model } from '../model'
import { NodeView } from '../view'
import { GraphView } from './view'
import { Defs } from './defs'
import { Hook } from './hook'
import { Grid } from './grid'
import { Coord } from './coord'
import { Options } from './options'
import { EventArgs } from './events'
import { Renderer } from './renderer'
import { Highlight } from './highlight'
import { Transform } from './transform'
import { Background } from './background'

export class Graph extends Basecoat<EventArgs> {
  public readonly options: Options.Definition
  public readonly model: Model
  public readonly view: GraphView
  public readonly hook: Hook
  public readonly grid: Grid
  public readonly defs: Defs
  public readonly coord: Coord
  public readonly renderer: Renderer
  public readonly highlight: Highlight
  public readonly transform: Transform
  public readonly background: Background

  /**
   * Get the native value of hooked method.
   */
  public getNativeValue: <T>() => T | null

  public get container() {
    return this.view.container
  }

  tools: any

  constructor(options: Partial<Options.Manual> & { container: HTMLElement }) {
    super()
    this.options = Options.merge(options)
    this.hook = new Hook(this)
    this.view = new GraphView(this)
    this.defs = new Defs(this)
    this.coord = new Coord(this)
    this.transform = new Transform(this)
    this.highlight = new Highlight(this)
    this.grid = new Grid(this)
    this.background = new Background(this)
    this.model = this.createModel()
    this.renderer = new Renderer(this)
    this.setup()
  }

  protected createModel() {
    const model = new Model()
    model.graph = this
    return model
  }

  protected setup() {
    this.model.on('sorted', () => this.trigger('model:sorted'))
    this.model.on('reseted', (args) => this.trigger('model:reseted', args))
    this.model.on('updated', (args) => this.trigger('model:updated', args))
  }

  getCellById(id: string) {
    return this.model.getCell(id)
  }

  addNode(metadata: Node.Metadata, options?: Model.AddOptions): Node
  addNode(node: Node, options?: Model.AddOptions): Node
  addNode(node: Node | Node.Metadata, options: Model.AddOptions = {}): Node {
    return this.model.addNode(node, options)
  }

  createNode(metadata: Node.Metadata) {
    return this.model.createNode(metadata)
  }

  addEdge(metadata: Edge.Metadata, options?: Model.AddOptions): Edge
  addEdge(edge: Edge, options?: Model.AddOptions): Edge
  addEdge(edge: Edge | Edge.Metadata, options: Model.AddOptions = {}): Edge {
    return this.model.addEdge(edge, options)
  }

  createEdge(metadata: Edge.Metadata) {
    return this.model.createEdge(metadata)
  }

  addCell(cell: Cell | Cell[], options: Model.AddOptions = {}) {
    this.model.addCell(cell, options)
    return this
  }

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
  scale(sx: number, sy?: number, ox?: number, oy?: number): this
  scale(
    sx?: number,
    sy: number = sx as number,
    ox: number = 0,
    oy: number = 0,
  ) {
    if (typeof sx === 'undefined') {
      return this.transform.getScale()
    }
    this.transform.scale(sx, sy, ox, oy)
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

  setOrigin(ox?: number, oy?: number) {
    return this.translate(ox || 0, oy || 0)
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

  getContentArea(options: Transform.GetContentAreaOptions = {}) {
    return this.transform.getContentArea(options)
  }

  getContentBBox(options: Transform.GetContentAreaOptions = {}) {
    return this.transform.getContentBBox(options)
  }

  getArea() {
    return this.transform.getArea()
  }

  getRestrictedArea(view?: NodeView) {
    return this.transform.getRestrictedArea(view)
  }

  getDefaultEdge() {
    return new Edge()
  }

  // #endregion

  // #region coord

  snapToGrid(p: Point.PointLike): Point
  snapToGrid(x: number, y: number): Point
  snapToGrid(x: number | Point.PointLike, y?: number) {
    return this.coord.snapToGrid(x, y)
  }

  /**
   * Transform the point `p` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraphPoint(p: Point.PointLike): Point
  localToGraphPoint(x: number, y: number): Point
  localToGraphPoint(x: number | Point.PointLike, y?: number) {
    return this.coord.localToGraphPoint(x, y)
  }

  localToClientPoint(p: Point.PointLike): Point
  localToClientPoint(x: number, y: number): Point
  localToClientPoint(x: number | Point.PointLike, y?: number) {
    return this.coord.localToClientPoint(x, y)
  }

  localToPagePoint(p: Point.PointLike): Point
  localToPagePoint(x: number, y: number): Point
  localToPagePoint(x: number | Point.PointLike, y?: number) {
    return this.coord.localToPagePoint(x, y)
  }

  localToGraphRect(rect: Rectangle.RectangleLike): Rectangle
  localToGraphRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  localToGraphRect(
    x: number | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    return this.coord.localToPaperRect(x, y, width, height)
  }

  localToClientRect(rect: Rectangle.RectangleLike): Rectangle
  localToClientRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  localToClientRect(
    x: number | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    return this.coord.localToClientRect(x, y, width, height)
  }

  localToPageRect(rect: Rectangle.RectangleLike): Rectangle
  localToPageRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  localToPageRect(
    x: number | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    return this.coord.localToPageRect(x, y, width, height)
  }

  graphToLocalPoint(p: Point.PointLike): Point
  graphToLocalPoint(x: number, y: number): Point
  graphToLocalPoint(x: number | Point.PointLike, y?: number) {
    return this.coord.graphToLocalPoint(x, y)
  }

  clientToLocalPoint(p: Point.PointLike): Point
  clientToLocalPoint(x: number, y: number): Point
  clientToLocalPoint(x: number | Point.PointLike, y?: number) {
    return this.coord.clientToLocalPoint(x, y)
  }

  pageToLocalPoint(p: Point.PointLike): Point
  pageToLocalPoint(x: number, y: number): Point
  pageToLocalPoint(x: number | Point.PointLike, y?: number) {
    return this.coord.pageToLocalPoint(x, y)
  }

  graphToLocalRect(rect: Rectangle.RectangleLike): Rectangle
  graphToLocalRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  graphToLocalRect(
    x: number | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    return this.coord.graphToLocalRect(x, y, width, height)
  }

  clientToLocalRect(rect: Rectangle.RectangleLike): Rectangle
  clientToLocalRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  clientToLocalRect(
    x: number | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    return this.coord.clientToLocalRect(x, y, width, height)
  }

  pageToLocalRect(rect: Rectangle.RectangleLike): Rectangle
  pageToLocalRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  pageToLocalRect(
    x: number | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    return this.coord.pageToLocalRect(x, y, width, height)
  }

  // #endregion

  // #region defs

  defineFilter(options: any) {
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

  drawBackground(options: Background.Options = {}) {
    this.background.draw(options)
    return this
  }

  clearBackground() {
    return this.drawBackground()
  }

  // #endregion

  // #region tools

  removeTools() {
    this.trigger('tools:remove')
    return this
  }

  hideTools() {
    this.trigger('tools:hide')
    return this
  }

  showTools() {
    this.trigger('tools:show')
    return this
  }

  // #endregion
}
