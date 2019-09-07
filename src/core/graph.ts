import * as util from '../util'
import * as images from '../assets/images'
import { Cell } from './cell'
import { View } from './view'
import { Model } from './model'
import { State } from './state'
import { Feature } from './feature'
import { Geometry } from './geometry'
import { Renderer } from './renderer'
import { StyleSheet, EdgeStyle } from '../stylesheet'
import { Align, VAlign, CellStyle, Dialect } from '../types'
import { constants, detector, DomEvent, CustomMouseEvent, Disablable } from '../common'
import {
  Rectangle,
  Point,
  Constraint,
  Image,
  Overlay,
  Shapes,
  PageSize,
  Multiplicity,
} from '../struct'
import {
  CellEditor,
  IMouseHandler,
  TooltipHandler,
  PopupMenuHandler,
  PanningHandler,
  SelectionHandler,
  GraphHandler,
  ConnectionHandler,
  NodeHandler,
  EdgeHandler,
  RubberbandHandler,
} from '../handler'
import {
  ChangeManager,
  EventLoop,
  HandlerManager,
  Selection,
  SelectionManager,
  ValidationManager,
  ViewportManager,
  CellManager,
} from '../manager'

export class Graph extends Disablable {
  public readonly container: HTMLElement
  public readonly model: Model
  public readonly view: View
  public readonly styleSheet: StyleSheet
  public readonly renderer: Renderer

  public readonly cellEditor: CellEditor
  public readonly changeManager: ChangeManager
  public readonly eventloop: EventLoop
  public readonly selection: Selection
  public readonly selectionManager: SelectionManager
  public readonly handlerManager: HandlerManager
  public readonly validator: ValidationManager
  public readonly viewport: ViewportManager
  public readonly cellManager: CellManager

  tooltipHandler: TooltipHandler
  popupMenuHandler: PopupMenuHandler
  selectionHandler: SelectionHandler
  connectionHandler: ConnectionHandler
  panningHandler: PanningHandler
  panningManager: any
  graphHandler: GraphHandler
  rubberbandHandler: RubberbandHandler

  prefixCls: string
  dialect: Dialect

  /**
   * An array of `Multiplicity` describing the allowed
   * connections in a graph.
   */
  multiplicities: Multiplicity[] = []

  /**
   * Specifies the default parent to be used to insert new cells.
   */
  defaultParent: Cell | null

  /**
   * Specifies the alternate edge style to be used if the main control point
   * on an edge is being doubleclicked.
   *
   * Default is `null`.
   */
  alternateEdgeStyle: CellStyle

  /**
   * Specifies if native double click events should be detected.
   *
   * Default is `true`.
   */
  nativeDblClickEnabled: boolean = true

  /**
   * Specifies if double taps on touch-based devices should be handled as a
   * double click.
   *
   * Default is `true`.
   */
  doubleTapEnabled: boolean = true

  /**
   * Specifies the timeout for double taps and non-native double clicks.
   *
   * Default is `500` ms.
   */
  doubleTapTimeout: number = 500

  /**
   * Specifies the tolerance for double taps and double clicks in quirks mode.
   *
   * Default is `25` pixels.
   */
  doubleTapTolerance: number = 25

  /**
   * Specifies if tap and hold should be used for starting connections on
   * touch-based devices.
   *
   * Default is `true`.
   */
  tapAndHoldEnabled: boolean = true

  /**
   * Specifies the time for a tap and hold.
   *
   * Default is `500` ms.
   */
  tapAndHoldDelay: number = 500

  /**
   * Specifies if the background page should be visible.
   *
   * Default is `false`.
   */
  pageVisible: boolean = false

  /**
   * Specifies if a dashed line should be drawn between multiple pages.
   *
   * Default is `false`.
   */
  pageBreaksVisible: boolean = false

  /**
   * Specifies the color for page breaks.
   *
   * Default is `'gray'`.
   */
  pageBreakColor = 'gray'

  /**
   * Specifies the page breaks should be dashed. Default is true.
   */
  pageBreakDashed: boolean = true

  /**
   * Specifies the minimum distance for page breaks to be visible.
   *
   * Default is `20` (in pixels).
   */
  minPageBreakDist: number = 20

  /**
   * Specifies if the graph size should be rounded to the next page
   * number in `sizeDidChange`.
   *
   * This is only used if the graph container has scrollbars.
   *
   * Default is `false`.
   */
  preferPageSize: boolean = false

  /**
   * Specifies the page format for the background page.
   */
  pageFormat: Rectangle = PageSize.A4_PORTRAIT

  /**
   * Specifies the scale of the background page.
   *
   * Default is `1.5`.
   *
   * Not yet implemented.
   */
  pageScale = 1.5

  /**
   * Specifies if the graph should automatically scroll if the mouse goes near
   * the container edge while dragging. This is only taken into account if the
   * container has scrollbars.
   *
   * Default is `true`.
   *
   * If you need this to work without scrollbars then set `ignoreScrollbars` to
   * true. Please consult the `ignoreScrollbars` for details. In general, with
   * no scrollbars, the use of `allowAutoPanning` is recommended.
   */
  autoScroll: boolean = true

  /**
   * Specifies if the graph should automatically scroll regardless of the
   * scrollbars. This will scroll the container using positive values for
   * scroll positions. To avoid possible conflicts with panning, set
   * `translateToScrollPosition` to true.
   */
  ignoreScrollbars: boolean = false

  /**
   * Specifies if the graph should automatically convert the current scroll
   * position to a translate in the graph view when a mouseUp event is received.
   * This can be used to avoid conflicts when using `autoScroll` and
   * `ignoreScrollbars` with no scrollbars in the container.
   */
  translateToScrollPosition: boolean = false

  /**
   * Specifies if autoscrolling should be carried out via mxPanningManager even
   * if the container has scrollbars. This disables <scrollPointToVisible> and
   * uses <mxPanningManager> instead. If this is true then <autoExtend> is
   * disabled. It should only be used with a scroll buffer or when scollbars
   * are visible and scrollable in all directions. Default is false.
   */
  timerAutoScroll: boolean = false

  /**
   * Specifies if panning via <panGraph> should be allowed to implement autoscroll
   * if no scrollbars are available in <scrollPointToVisible>. To enable panning
   * inside the container, near the edge, set <mxPanningManager.border> to a
   * positive value. Default is false.
   */
  allowAutoPanning: boolean = false

  /**
   * Specifies if the size of the graph should be automatically extended if the
   * mouse goes near the container edge while dragging. This is only taken into
   * account if the container has scrollbars. Default is true. See <autoScroll>.
   */
  autoExtend: boolean = true

  /**
   * `Rectangle` that specifies the area in which all cells in the diagram
   * should be placed. Use a width or height of 0 if you only want to give
   * a upper, left corner.
   */
  maximumGraphBounds: Rectangle | null

  /**
   * `Rectangle` that specifies the minimum size of the graph.
   *
   * This is ignored if the graph container has no scrollbars.
   *
   * Default is `null`.
   */
  minimumGraphSize: Rectangle | null

  /**
   * <Rect> that specifies the minimum size of the <container> if
   * <resizeContainer> is true.
   */
  minimumContainerSize: Rectangle | null

  /**
   * <Rect> that specifies the maximum size of the container if
   * <resizeContainer> is true.
   */
  maximumContainerSize: Rectangle | null

  /**
   * Specifies if edges should appear in the foreground regardless of
   * their order in the model. If `keepEdgesInForeground` and
   * `keepEdgesInBackground` are both true then the normal order is applied.
   *
   * Default is `false`.
   */
  keepEdgesInForeground: boolean = false

  /**
   * Specifies if edges should appear in the background regardless of
   * their order in the model. If `keepEdgesInForeground` and
   * `keepEdgesInBackground` are both true then the normal order is applied.
   *
   * Default is `false`.
   */
  keepEdgesInBackground: boolean = false

  /**
   * Specifies if the scale and translate should be reset if
   * the root changes in the model.
   *
   * Default is `true`.
   */
  resetViewOnRootChange: boolean = true

  /**
   * Specifies if edge control points should be reset after the resize of a
   * connected cell.
   *
   * Default is `false`.
   */
  resetEdgesOnResize: boolean = false

  /**
   * Specifies if edge control points should be reset after the move of a
   * connected cell.
   *
   * Default is `false`.
   */
  resetEdgesOnMove: boolean = false

  /**
   * Specifies if edge control points should be reset after the the edge
   * has been reconnected.
   *
   * Default is `true`.
   */
  resetEdgesOnConnect: boolean = true

  defaultLoopStyle = EdgeStyle.loop

  /**
   * The attribute used to find the color for the indicator if the indicator
   * color is set to 'swimlane'.
   */
  swimlaneIndicatorColorAttribute: string = 'fill'

  /**
   * Specifies the minimum scale to be applied in `fit`.
   *
   * Default is `0.1`. Set to `null` to allow any value.
   */
  minFitScale: number = 0.1

  /**
   * Specifies the maximum scale to be applied in `fit`.
   *
   * Default is `8`. Set to `null` to allow any value.
   */
  maxFitScale: number = 8

  options: Graph.Options

  constructor(container: HTMLElement, options: Graph.Options = {}) {
    super()

    this.options = Feature.get(options)
    this.container = container
    this.model = options.model || this.createModel()
    this.styleSheet = options.styleSheet || this.createStyleSheet()
    this.view = this.createView()
    this.renderer = this.createRenderer()
    this.selection = this.createSelection()

    // The order of the following initializations should not be modified.
    this.cellEditor = new CellEditor(this)
    this.changeManager = new ChangeManager(this)
    this.eventloop = new EventLoop(this)
    this.handlerManager = new HandlerManager(this)
    this.cellManager = new CellManager(this)
    this.selectionManager = new SelectionManager(this)
    this.validator = new ValidationManager(this)
    this.viewport = new ViewportManager(this)

    Feature.init(this)

    if (container != null) {
      this.init(container)
    }

    this.view.revalidate()
  }

  protected init(container: HTMLElement) {
    this.view.init()
    this.viewport.sizeDidChange()

    if (detector.IS_IE) {
      DomEvent.addListener(container, 'selectstart', (e: MouseEvent) => {
        return (
          this.isEditing() ||
          (!this.eventloop.isMouseDown && !DomEvent.isShiftDown(e))
        )
      })
    }
  }

  getModel() {
    return this.model
  }

  getView() {
    return this.view
  }

  getStylesheet() {
    return this.styleSheet
  }

  protected createModel() {
    return (
      util.call(this.options.createModel, this, this) ||
      new Model()
    )
  }

  protected createView() {
    return (
      util.call(this.options.createView, this, this) ||
      new View(this)
    )
  }

  protected createStyleSheet() {
    return (
      util.call(this.options.createStyleSheet, this, this) ||
      new StyleSheet()
    )
  }

  protected createRenderer() {
    return (
      util.call(this.options.createRenderer, this, this) ||
      new Renderer()
    )
  }

  protected createSelection() {
    return (
      util.call(this.options.createSelection, this, this) ||
      new Selection(this)
    )
  }

  // #region :::::::::::: Cell Creation

  @afterCreate()
  createNode(options: Graph.CreateNodeOptions = {}): Cell {
    return this.cellManager.createNode(options)
  }

  @afterCreate()
  createEdge(options: Graph.CreateEdgeOptions = {}): Cell {
    return this.cellManager.createEdge(options)
  }

  addNode(options: Graph.AddNodeOptions): Cell
  addNode(node: Cell, parent?: Cell, index?: number): Cell
  addNode(
    node?: Cell | Graph.AddNodeOptions,
    parent?: Cell,
    index?: number,
  ): Cell {
    if (node instanceof Cell) {
      return this.addNodes([node], parent, index)[0]
    }

    const options = node != null ? node : {}
    const cell = this.createNode(options)
    return this.addNodes([cell], options.parent, options.index)[0]
  }

  addNodes(nodes: Cell[], parent?: Cell, index?: number): Cell[] {
    return this.addCells(nodes, parent, index)
  }

  addEdge(options: Graph.AddEdgeOptions): Cell
  addEdge(
    edge: Cell,
    parent?: Cell,
    source?: Cell,
    target?: Cell,
    index?: number,
  ): Cell
  addEdge(
    edge?: Cell | Graph.AddEdgeOptions,
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
    return this.addCell(
      cell,
      options.parent,
      options.index,
      options.sourceNode,
      options.targetNode,
    )
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
    return this.cellManager.addCells(cells, parent, index, source, target)
  }

  /**
   * Removes the given cells from the graph including all connected
   * edges if `includeEdges` is `true`.
   */
  removeCells(
    cells: Cell[] = this.getDeletableCells(this.getSelectedCells()),
    includeEdges: boolean = true,
  ) {
    return this.cellManager.removeCells(cells, includeEdges)
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
    return this.cellManager.splitEdge(edge, cells, newEdge, dx, dy)
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
    return this.cellManager.cloneCells(
      cells, allowInvalidEdges, mapping, keepPosition,
    )
  }

  // #endregion

  // #region :::::::::::: Cell Connecting

  /**
   * Connects the specified end of the given edge to the given terminal.
   *
   * @param edge - The edge will be updated.
   * @param terminal - The new terminal to be used.
   * @param isSource - Indicating if the new terminal is the source or target.
   * @param constraint - Optional `Constraint` to be used for this connection.
   */
  connectCell(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    constraint?: Constraint,
  ) {
    return this.cellManager.connectCell(edge, terminal, isSource, constraint)
  }

  /**
   * Disconnects the given edges from the terminals which are not in the
   * given array.
   */
  disconnectGraph(cells: Cell[]) {
    return this.cellManager.disconnectGraph(cells)
  }

  @hook()
  getConstraints(terminal: Cell, isSource: boolean) {
    const state = this.view.getState(terminal)
    if (
      state != null &&
      state.shape != null &&
      state.shape.stencil != null
    ) {
      return state.shape.stencil.constraints
    }

    return null
  }

  /**
   * Returns an `Constraint` that describes the given connection point.
   */
  getConnectionConstraint(
    edgeState: State,
    terminalState?: State | null,
    isSource: boolean = false,
  ) {
    return this.cellManager.getConnectionConstraint(
      edgeState, terminalState, isSource,
    )
  }

  setConnectionConstraint(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    constraint?: Constraint | null,
  ) {
    return this.cellManager.setConnectionConstraint(
      edge, terminal, isSource, constraint,
    )
  }

  // #endregion

  // #region :::::::::::: Cell Moving

  moveCell(
    cell: Cell,
    dx: number = 0,
    dy: number = 0,
    clone: boolean = false,
    target?: Cell | null,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    return this.moveCells([cell], dx, dy, clone, target, e, cache)
  }

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
    return this.cellManager.moveCells(cells, dx, dy, clone, target, e, cache)
  }

  /**
   * Clones and inserts the given cells into the graph.
   *
   * @param cells Array of `Cell`s to be cloned.
   * @param dx Specifies the x-coordinate of the vector. Default is `0`.
   * @param dy Specifies the y-coordinate of the vector. Default is `0`.
   * @param target The new parent of the cells.
   * @param e Mouseevent that triggered the invocation.
   * @param cache Optional mapping for existing clones.
   */
  importCells(
    cells: Cell[],
    dx: number,
    dy: number,
    target?: Cell,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    return this.moveCells(cells, dx, dy, true, target, e, cache)
  }

  /**
   * Translates the geometry of the given cell and stores the new,
   * translated geometry in the model as an atomic change.
   */
  translateCell(cell: Cell, dx: number, dy: number) {
    this.cellManager.translateCell(cell, dx, dy)
  }

  getMaximumGraphBounds() {
    return this.maximumGraphBounds
  }

  /**
   * Resets the control points of the edges that are connected to the given
   * cells if not both ends of the edge are in the given cells array.
   */
  resetOtherEdges(cells: Cell[]) {
    this.cellManager.resetOtherEdges(cells)
  }

  /**
   * Resets the control points of the given edge.
   */
  resetEdge(edge: Cell) {
    this.cellManager.resetEdge(edge)
  }

  // #endregion

  // #region :::::::::::: Cell Style

  getStyle(cell: Cell | null) {
    const state = this.view.getState(cell)
    return (state != null) ? state.style : this.getCellStyle(cell)
  }

  /**
   * Returns a key-value pair object representing the cell style for
   * the given cell.
   *
   * Note: You should try to use the cached style in the state before
   * using this method.
   */
  getCellStyle(cell: Cell | null) {
    return this.cellManager.getCellStyle(cell)
  }

  /**
   * Sets the style of the specified cells. If no cells are given, then
   * the current selected cells are changed.
   */
  setCellStyle(style: CellStyle, cells: Cell[] = this.getSelectedCells()) {
    this.cellManager.setCellStyle(style, cells)
  }

  /**
   * Toggles the boolean value for the given key in the style of the given
   * cell and returns the new value. Optional boolean default value if no
   * value is defined. If no cell is specified then the current selected
   * cell is used.
   */
  toggleCellStyle(
    key: string,
    defaultValue: boolean = false,
    cell: Cell = this.getSelectedCell(),
  ) {
    return this.toggleCellsStyle(key, defaultValue, [cell])
  }

  /**
   * Toggles the boolean value for the given key in the style of the given
   * cells and returns the new value. If no cells are specified, then the
   * current selected cells are used.
   */
  toggleCellsStyle(
    key: string,
    defaultValue: boolean = false,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    return this.cellManager.toggleCellsStyle(key, defaultValue, cells)
  }

  updateStyle(style: CellStyle, cell?: Cell): void
  updateStyle(style: CellStyle, cells?: Cell[]): void
  updateStyle(
    key: string,
    value?: string | number | boolean | null,
    cell?: Cell,
  ): void
  updateStyle(
    key: string,
    value?: string | number | boolean | null,
    cells?: Cell[],
  ): void
  updateStyle(
    key: string | CellStyle,
    value?: (string | number | boolean | null) | Cell | Cell[],
    cells?: Cell | Cell[],
  ) {
    const style: CellStyle = typeof key === 'string' ? { [key]: value } : key
    let targets = (typeof key === 'string' ? cells : value) as (Cell | Cell[])
    if (targets == null) {
      targets = this.getSelectedCells()
    }
    if (!util.isArray(targets)) {
      targets = [targets as Cell]
    }

    Object.keys(style).forEach((name) => {
      this.updateCellsStyle(
        name,
        (style as any)[name],
        targets as Cell[],
      )
    })
  }

  updateCellStyle(
    key: string,
    value?: string | number | boolean | null,
    cell: Cell = this.getSelectedCell(),
  ) {
    this.updateCellsStyle(key, value, [cell])
  }

  /**
   * Sets the key to value in the styles of the given cells. This will modify
   * the existing cell styles in-place and override any existing assignment
   * for the given key. If no cells are specified, then the selection cells
   * are changed. If no value is specified, then the respective key is
   * removed from the styles.
   */
  updateCellsStyle(
    key: string,
    value?: string | number | boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.cellManager.updateCellsStyle(key, value, cells)
  }

  /**
   * Toggles the given bit for the given key in the styles of the specified
   * cells.
   */
  toggleCellStyleFlags(
    key: string,
    flag: number,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.setCellStyleFlags(key, flag, null, cells)
  }

  /**
   * Sets or toggles the given bit for the given key in the styles of the
   * specified cells.
   */
  setCellStyleFlags(
    key: string,
    flag: number,
    value: boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.cellManager.setCellStyleFlags(key, flag, value, cells)
  }

  // #endregion

  // #region :::::::::::: Cell Visibility

  toggleCells(
    show: boolean,
    cells: Cell[] = this.getSelectedCells(),
    includeEdges: boolean = true,
  ) {
    return this.cellManager.toggleCells(show, cells, includeEdges)
  }

  // #endregion

  // #region :::::::::::: Cell Grouping

  @afterCreate()
  createGroup(cells: Cell[]) {
    const group = new Cell()
    group.asNode(true)
    group.setConnectable(false)
    return group
  }

  /**
   * Adds the cells into the given group.
   *
   * @param group The target group. If null is specified then a new group
   * is created.
   * @param border Optional integer that specifies the border between the
   * child area and the group bounds. Default is `0`.
   * @param cells Optional array of `Cell`s to be grouped. If null is
   * specified then the selection cells are used.
   */
  groupCells(
    group?: Cell,
    border: number = 0,
    cells: Cell[] = util.sortCells(this.getSelectedCells(), true),
  ) {
    return this.cellManager.groupCells(group!, border, cells)
  }

  ungroup(group: Cell) {
    return this.ungroups([group])
  }

  /**
   * Ungroups the given cells by moving the children to their parents parent
   * and removing the empty groups. Returns the children that have been
   * removed from the groups.
   *
   * @param cells Array of cells to be ungrouped. If null is specified then
   * the selection cells are used.
   */
  ungroups(cells?: Cell[]) {
    return this.cellManager.ungroupCells(cells)
  }

  /**
   * Updates the bounds of the given groups to include all children and
   * returns the passed-in cells. Call this with the groups in parent to child order,
   * top-most group first, the cells are processed in reverse order and cells
   * with no children are ignored.
   *
   * @param cells - The groups whose bounds should be updated. If this is
   * null, then the selection cells are used.
   * @param border - Optional border to be added in the group. Default is `0`.
   * @param moveGroup - Optional boolean that allows the group to be moved.
   * Default is `false`.
   * @param topBorder - Optional top border to be added in the group.
   * Default is `0`.
   * @param rightBorder - Optional top border to be added in the group.
   * Default is `0`.
   * @param bottomBorder - Optional top border to be added in the group.
   * Default is `0`.
   * @param leftBorder - Optional top border to be added in the group.
   * Default is `0`.
   */
  updateGroupBounds(
    cells: Cell[] = this.getSelectedCells(),
    border: number = 0,
    moveGroup: boolean = false,
    topBorder: number = 0,
    rightBorder: number = 0,
    bottomBorder: number = 0,
    leftBorder: number = 0,
  ) {
    return this.cellManager.updateGroupBounds(
      cells, border, moveGroup, topBorder,
      rightBorder, bottomBorder, leftBorder,
    )
  }

  /**
   * Removes the specified cells from their parents and adds them to the
   * default parent. Returns the cells that were removed from their parents.
   */
  removeCellsFromParent(cells: Cell[] = this.getSelectedCells()) {
    return this.cellManager.removeCellsFromParent(cells)
  }

  // #endregion

  // #region :::::::::::: Cell Sizing

  /**
   * Resizes the specified cell to just fit around the its label
   * and/or children.
   *
   * @param cell `Cells` to be resized.
   * @param recurse Optional boolean which specifies if all descendants
   * should be autosized. Default is `true`.
   */
  autoSizeCell(cell: Cell, recurse: boolean = true) {
    this.cellManager.autoSizeCell(cell, recurse)
  }

  /**
   * Sets the bounds of the given cell.
   */
  resizeCell(cell: Cell, bounds: Rectangle, recurse?: boolean) {
    return this.resizeCells([cell], [bounds], recurse)[0]
  }

  /**
   * Sets the bounds of the given cells.
   */
  resizeCells(
    cells: Cell[],
    bounds: Rectangle[],
    recurse: boolean = this.isRecursiveResize(),
  ) {
    return this.cellManager.resizeCells(cells, bounds, recurse)
  }

  /**
   * Resizes the child cells of the given cell for the given new geometry with
   * respect to the current geometry of the cell.
   */
  resizeChildCells(cell: Cell, newGeo: Geometry) {
    const geo = this.model.getGeometry(cell)!
    const dx = newGeo.bounds.width / geo.bounds.width
    const dy = newGeo.bounds.height / geo.bounds.height
    cell.eachChild(child => this.scaleCell(child, dx, dy, true))
  }

  /**
   * Scales the points, position and size of the given cell according to the
   * given vertical and horizontal scaling factors.
   *
   * @param cell - The cell to be scaled.
   * @param sx - Horizontal scaling factor.
   * @param sy - Vertical scaling factor.
   * @param recurse - Boolean indicating if the child cells should be scaled.
   */
  scaleCell(cell: Cell, sx: number, sy: number, recurse: boolean) {
    this.cellManager.scaleCell(cell, sx, sy, recurse)
  }

  /**
   * Returns the bounding box for the given array of `Cell`s.
   */
  getBoundingBox(cells: Cell[]) {
    return this.cellManager.getBoundingBox(cells)
  }

  // #endregion

  // #region :::::::::::: Cell Overlay

  /**
   * Returns the array of `Overlay` for the given cell
   * or null if no overlays are defined.
   */
  getOverlays(cell: Cell | null) {
    return cell != null ? cell.getOverlays() : null
  }

  /**
   * Adds an `Overlay` for the specified cell.
   */
  addOverlay(cell: Cell, overlay: Overlay) {
    return this.cellManager.addOverlay(cell, overlay)
  }

  /**
   * Removes and returns the given `Overlay` from the given cell.
   * If no overlay is given, then all overlays are removed.
   */
  removeOverlay(cell: Cell, overlay?: Overlay | null) {
    return this.cellManager.removeOverlay(cell, overlay)
  }

  removeOverlays(cell: Cell) {
    return this.cellManager.removeOverlays(cell)
  }

  /**
   * Removes all `Overlays` in the graph for the given cell and all its
   * descendants. If no cell is specified then all overlays are removed
   * from the graph.
   */
  clearOverlays(cell: Cell = this.model.getRoot()) {
    this.removeOverlays(cell)
    cell.eachChild(child => this.clearOverlays(child))
  }

  warningImage: Image = images.warning

  /**
   * Creates an overlay for the given cell using the `warning` string and
   * image `warningImage`, then returns the new `Overlay`. The `warning`
   * string is displayed as a tooltip in a red font and may contain HTML
   * markup. If the `warning` string is null or a zero length string, then
   * all overlays are removed from the cell.
   */
  addWarningOverlay(
    cell: Cell,
    warning?: string | null,
    img: Image = this.warningImage,
    selectOnClick: boolean = false,
  ) {
    if (warning != null && warning.length > 0) {
      return this.cellManager.addWarningOverlay(
        cell, warning, img, selectOnClick,
      )
    }

    this.removeOverlays(cell)
    return null
  }

  // #endregion

  // #region :::::::::::: Cell Editing

  startEditing(e?: MouseEvent) {
    this.startEditingAtCell(null, e)
  }

  startEditingAtCell(
    cell: Cell | null = this.getSelectedCell(),
    e?: MouseEvent,
  ) {
    if (e == null || !DomEvent.isMultiTouchEvent(e)) {
      if (cell != null && this.isCellEditable(cell)) {
        this.trigger(Graph.events.startEditing, { cell, e })
        this.cellEditor.startEditing(cell, e)
        this.trigger(Graph.events.editingStarted, { cell, e })
      }
    }
  }

  /**
   * Returns the initial value for in-place editing.
   */
  @hook()
  getEditingValue(cell: Cell, e?: Event) {
    return this.convertDataToString(cell)
  }

  stopEditing(cancel: boolean = false) {
    this.cellEditor.stopEditing(cancel)
    this.trigger(Graph.events.editingStopped, { cancel })
  }

  updateLabel(cell: Cell, label: string, e?: Event) {
    this.model.batchUpdate(() => {
      const old = cell.data
      const data = this.putLabel(cell, label)
      this.dataChanged(cell, data, this.isAutoSizeCell(cell))
      this.trigger(Graph.events.labelChanged, { cell, data, old, e })
    })
    return cell
  }

  protected dataChanged(cell: Cell, data: any, autoSize: boolean) {
    this.model.batchUpdate(() => {
      this.model.setData(cell, data)
      if (autoSize) {
        this.cellManager.cellSizeUpdated(cell, false)
      }
    })
  }

  // #endregion

  // #region :::::::::::: Cell Align

  /**
   * Aligns the given cells vertically or horizontally according to the
   * given alignment using the optional parameter as the coordinate.
   */
  alignCells(
    align: Align | VAlign,
    cells: Cell[] = this.getSelectedCells(),
    param?: number,
  ) {
    return this.cellManager.alignCells(align, cells, param)
  }

  /**
   * Toggles the style of the given edge between null (or empty) and
   * `alternateEdgeStyle`.
   */
  flipEdge(edge: Cell) {
    return this.cellManager.flipEdge(edge)
  }

  // #endregion

  // #region :::::::::::: Cell Order

  /**
   * Specifies if the cell size should be changed to the preferred size when
   * a cell is first collapsed.
   *
   * Default is `true`.
   */
  collapseToPreferredSize: boolean = true

  foldCells(
    collapse: boolean,
    recurse: boolean = false,
    cells: Cell[] = this.getFoldableCells(this.getSelectedCells(), collapse),
    checkFoldable: boolean = false,
  ) {
    return this.cellManager.foldCells(collapse, recurse, cells, checkFoldable)
  }

  /**
   * Moves the given cells to the front or back.
   */
  orderCells(
    toBack: boolean = false,
    cells: Cell[] = util.sortCells(this.getSelectedCells(), true),
  ) {
    return this.cellManager.orderCells(toBack, cells)
  }

  // #endregion

  // #region :::::::::::: Drilldown

  /**
   * Returns true if the given cell is a valid root.
   */
  @hook()
  isValidRoot(cell: Cell | null) {
    return (cell != null)
  }

  /**
   * Returns true if the given cell is a "port", that is, when connecting
   * to it, the cell returned by `getTerminalForPort` should be used as the
   * terminal and the port should be referenced by the ID in either the
   * `'sourcePort'` or the or the `'targetPort'`.
   */
  @hook()
  isPort(cell: Cell) {
    return false
  }

  /**
   * Returns the terminal to be used for a given port.
   */
  @hook()
  getTerminalForPort(cell: Cell, isSource: boolean) {
    return this.model.getParent(cell)
  }

  /**
   * Returns the offset to be used for the cells inside the given cell.
   */
  @hook()
  getChildOffsetForCell(cell: Cell): Point | null {
    return null
  }

  /**
   * Uses the given cell as the root of the displayed cell hierarchy.
   */
  enterGroup(cell: Cell = this.getSelectedCell()) {
    this.cellManager.enterGroup(cell)
  }

  /**
   * Changes the current root to the next valid root.
   */
  exitGroup() {
    this.cellManager.exitGroup()
  }

  /**
   * Uses the root of the model as the root of the displayed
   * cell hierarchy and selects the previous root.
   */
  home() {
    this.cellManager.home()
  }

  /**
   * Returns the translation to be used if the given cell is the root cell as
   * an <Point>. This implementation returns null.
   *
   * Example:
   *
   * To keep the children at their absolute position while stepping into groups,
   * this function can be overridden as follows.
   *
   * (code)
   * var offset = new Point(0, 0);
   *
   * while (cell != null)
   * {
   *   var geo = this.model.getGeometry(cell);
   *
   *   if (geo != null)
   *   {
   *     offset.x -= geo.x;
   *     offset.y -= geo.y;
   *   }
   *
   *   cell = this.model.getParent(cell);
   * }
   *
   * return offset;
   * (end)
   *
   * Parameters:
   *
   * cell - <Cell> that represents the root.
   */
  @hook()
  getTranslateForRoot(cell: Cell | null): Point | null {
    return null
  }

  // #endregion

  // #region :::::::::::: Retrieval

  getCurrentRoot() {
    return this.view.currentRoot
  }

  getDefaultParent(): Cell {
    return this.cellManager.getDefaultParent()
  }

  setDefaultParent(cell: Cell | null) {
    this.defaultParent = cell
  }

  /**
   * Returns the nearest ancestor of the given cell which is a
   * swimlane, or the given cell, if it is itself a swimlane.
   */
  getSwimlane(cell: Cell | null): Cell | null {
    return this.cellManager.getSwimlane(cell)
  }

  /**
   * Returns the bottom-most swimlane that intersects the given
   * point in the cell hierarchy that starts at the given parent.
   */
  getSwimlaneAt(
    x: number,
    y: number,
    parent: Cell = this.getDefaultParent(),
  ): Cell | null {
    return this.cellManager.getSwimlaneAt(x, y, parent)
  }

  /**
   * Returns the bottom-most cell that intersects the given point in
   * the cell hierarchy starting at the given parent.
   *
   * @param x X-coordinate of the location to be checked.
   * @param y Y-coordinate of the location to be checked.
   * @param parent The root of the recursion. Default is current root of the
   * view or the root of the model.
   * @param includeNodes Optional boolean indicating if nodes should be
   * returned. Default is `true`.
   * @param includeEdges Optional boolean indicating if edges should be
   * returned. Default is `true`.
   * @param ignoreFn Optional function that returns true if cell should be
   * ignored.
   */
  getCellAt(
    x: number,
    y: number,
    parent?: Cell | null,
    includeNodes: boolean = true,
    includeEdges: boolean = true,
    ignoreFn?: (state: State, x?: number, y?: number) => boolean,
  ): Cell | null {
    return this.cellManager.getCellAt(
      x,
      y,
      parent,
      includeNodes,
      includeEdges,
      ignoreFn,
    )
  }

  /**
   * Returns the visible child nodes of the given parent.
   */
  getChildNodes(parent: Cell) {
    return this.getChildCells(parent, true, false)
  }

  /**
   * Returns the visible child edges of the given parent.
   */
  getChildEdges(parent: Cell) {
    return this.getChildCells(parent, false, true)
  }

  /**
   * Returns the visible child nodes or edges of the given parent.
   */
  getChildCells(
    parent: Cell = this.getDefaultParent(),
    includeNodes: boolean = false,
    includeEdges: boolean = false,
  ) {
    const cells = this.model.getChildCells(parent, includeNodes, includeEdges)
    return cells.filter(cell => this.isCellVisible(cell))
  }

  /**
   * Returns all visible edges connected to the given cell without loops.
   */
  getConnections(node: Cell, parent?: Cell | null) {
    return this.getEdges(node, parent, true, true, false)
  }

  /**
   * Returns the visible incoming edges for the given cell. If the optional
   * parent argument is specified, then only child edges of the given parent
   * are returned.
   */
  getIncomingEdges(node: Cell, parent?: Cell | null) {
    return this.getEdges(node, parent, true, false, false)
  }

  /**
   * Returns the visible outgoing edges for the given cell. If the optional
   * parent argument is specified, then only child edges of the given parent
   * are returned.
   */
  getOutgoingEdges(node: Cell, parent?: Cell | null) {
    return this.getEdges(node, parent, false, true, false)
  }

  /**
   * Returns the incoming and/or outgoing edges for the given cell.
   *
   * If the optional parent argument is specified, then only edges are returned
   * where the opposite terminal is in the given parent cell. If at least one
   * of incoming or outgoing is true, then loops are ignored, if both are false,
   * then all edges connected to the given cell are returned including loops.
   *
   * Parameters:
   *
   * @param node `Cell` whose edges should be returned.
   * @param parent Optional parent of the opposite end for an edge to be
   * returned.
   * @param incoming Specifies if incoming edges should be included in the
   * result. Default is `true`.
   * @param outgoing Specifies if outgoing edges should be included in the
   * result. Default is `true`.
   * @param includeLoops - Specifies if loops should be included in the
   * result. Default is `true`.
   * @param recurse - Specifies if the parent specified only need be
   * an ancestral parent, true, or the direct parent, false.
   */
  getEdges(
    node: Cell,
    parent?: Cell | null,
    incoming: boolean = true,
    outgoing: boolean = true,
    includeLoops: boolean = true,
    recurse: boolean = false,
  ) {
    return this.cellManager.getEdges(
      node,
      parent,
      incoming,
      outgoing,
      includeLoops,
      recurse,
    )
  }

  /**
   * Returns all distinct visible opposite cells for the specified terminal
   * on the given edges.
   *
   * @param edges Array of `Cell`s that contains the edges whose opposite
   * terminals should be returned.
   * @param terminal - Specifies the end whose opposite should be returned.
   * @param includeSources - Optional boolean that specifies if source
   * terminals should be included in the result. Default is `true`.
   * @param includeTargets - Optional boolean that specifies if target
   * terminals should be included in the result. Default is `true`.
   */
  getOppositeNodes(
    edges: Cell[],
    terminal: Cell,
    includeSources: boolean = true,
    includeTargets: boolean = true,
  ) {
    return this.cellManager.getOppositeNodes(
      edges,
      terminal,
      includeSources,
      includeTargets,
    )
  }

  /**
   * Returns the edges between the given source and target. This takes into
   * account collapsed and invisible cells and returns the connected edges
   * as displayed on the screen.
   */
  getEdgesBetween(source: Cell, target: Cell, directed: boolean = false) {
    return this.cellManager.getEdgesBetween(source, target, directed)
  }

  /**
   * Returns the child nodes and edges of the given parent that are contained
   * in the given rectangle.
   *
   * @param x X-coordinate of the rectangle.
   * @param y Y-coordinate of the rectangle.
   * @param w Width of the rectangle.
   * @param h Height of the rectangle.
   * @param parent `Cell` that should be used as the root of the recursion.
   * Default is current root of the view or the root of the model.
   * @param result Optional array to store the result in.
   */
  getCellsInRegion(
    x: number,
    y: number,
    w: number,
    h: number,
    parent: Cell = this.getCurrentRoot() || this.model.getRoot(),
    result: Cell[] = [],
  ) {
    return this.cellManager.getCellsInRegion(x, x, w, h, parent, result)
  }

  /**
   * Returns the children of the given parent that are contained in the
   * canvas from the given point (x0, y0) rightwards or downwards
   * depending on rightHalfpane and bottomHalfpane.
   *
   * @param x X-coordinate of the origin.
   * @param y Y-coordinate of the origin.
   * @param parent Optional `Cell` whose children should be checked.
   * @param isRight - Boolean indicating if the cells in the right
   * canvas from the origin should be returned.
   * @param isBottom - Boolean indicating if the cells in the bottom
   * canvas from the origin should be returned.
   */
  getCellsBeyond(
    x: number,
    y: number,
    parent: Cell = this.getDefaultParent(),
    isRight: boolean = false,
    isBottom: boolean = false,
  ) {
    return this.cellManager.getCellsBeyond(x, y, parent, isRight, isBottom)
  }

  /**
   * Returns all children in the given parent which do not have incoming
   * edges. If the result is empty then the with the greatest difference
   * between incoming and outgoing edges is returned.
   *
   * @param parent `Cell` whose children should be checked.
   * @param isolate Optional boolean that specifies if edges should be ignored
   * if the opposite end is not a child of the given parent cell.
   * Default is `false`.
   * @param invert - Optional boolean that specifies if outgoing or incoming
   * edges should be counted for a tree root. If `false` then outgoing edges
   * will be counted.
   * Default is `false`.
   */
  findTreeRoots(
    parent: Cell | null,
    isolate: boolean = false,
    invert: boolean = false,
  ) {
    return this.cellManager.findTreeRoots(parent, isolate, invert)
  }

  /**
   * Traverses the (directed) graph invoking the given function for each
   * visited node and edge. The function is invoked with the current node
   * and the incoming edge as a parameter. This implementation makes sure
   * each node is only visited once. The function may return false if the
   * traversal should stop at the given node.
   *
   * @param node The node where the traversal starts.
   * @param directed Optional boolean indicating if edges should only be
   * traversed from source to target. Default is `true`.
   * @param func - Visitor function that takes the current node and the
   * incoming edge as arguments. The traversal stops if the function
   * returns `false`.
   * @param edge - Optional `Cell` that represents the incoming edge. This is
   * `null` for the first step of the traversal.
   * @param visited - Optional `WeakMap<Cell, boolean>` for the visited cells.
   * @param inverse - Optional boolean to traverse in inverse direction.
   * Default is `false`. This is ignored if directed is `false`.
   */
  traverse(
    node: Cell,
    directed: boolean = true,
    func: (node: Cell, edge: Cell | null) => any,
    edge?: Cell,
    visited: WeakMap<Cell, boolean> = new WeakMap<Cell, boolean>(),
    inverse: boolean = false,
  ) {
    this.cellManager.traverse(node, directed, func, edge, visited, inverse)
  }

  // #endregion

  // #region :::::::::::: Validation

  @hook()
  validateEdge(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return null
  }

  @hook()
  validateCell(cell: Cell, context: any) {
    return null
  }

  /**
   * Validates the graph by validating each descendant of the given cell or
   * the root of the model.
   */
  validateGraph(
    cell: Cell = this.model.getRoot(),
    context: any = {},
  ): string | null {
    return this.validator.validateGraph(cell, context)
  }

  isEdgeValid(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return this.validator.getEdgeValidationError(
      edge, source, target,
    ) == null
  }

  validationWarn(message: string) {
    console.warn(message)
  }

  // #endregion

  // #region :::::::::::: Selection

  isCellSelected(cell: Cell | null) {
    return this.selection.isSelected(cell)
  }

  isSelectionEmpty() {
    return this.selection.isEmpty()
  }

  clearSelection() {
    return this.selection.clear()
  }

  getSelecedCellCount() {
    return this.selection.cells.length
  }

  getSelectedCell() {
    return this.selection.cells[0]
  }

  getSelectedCells() {
    return this.selection.cells.slice()
  }

  /**
   * Replace selection cells with the given cell
   */
  setSelectedCell(cell: Cell | null) {
    this.selection.setCell(cell)
  }

  /**
   * Replace selection cells with the given cells
   */
  setSelectedCells(cells: Cell[]) {
    this.selection.setCells(cells)
  }

  /**
   * Adds the given cell to the selection.
   */
  selectCell(cell: Cell | null) {
    this.selection.addCell(cell)
  }

  /**
   * Adds the given cells to the selection.
   */
  selectCells(cells: Cell[]) {
    this.selection.addCells(cells)
  }

  /**
   * Removes the given cell from the selection.
   */
  unSelectCell(cell: Cell | null) {
    this.selection.removeCell(cell)
  }

  /**
   * Removes the given cells from the selection.
   */
  unSelectCells(cells: Cell[]) {
    this.selection.removeCells(cells)
  }

  /**
   * Removes selected cells that are not in the model from the selection.
   */
  updateSelection() {
    this.selectionManager.updateSelection()
  }

  /**
   * Selects and returns the cells inside the given rectangle for the
   * specified event.
   */
  selectCellsInRegion(rect: Rectangle, e: MouseEvent) {
    return this.selectionManager.selectCellsInRegion(rect, e)
  }

  selectNextCell() {
    this.selectionManager.selectCell(true)
  }

  selectPreviousCell() {
    this.selectionManager.selectCell()
  }

  selectParentCell() {
    this.selectionManager.selectCell(false, true)
  }

  selectChildCell() {
    this.selectionManager.selectCell(false, false, true)
  }

  /**
   * Selects all children of the given parent or the children of the
   * default parent if no parent is specified.
   *
   * @param parent Optional parent `Cell` whose children should be selected.
   * @param includeDescendants  Optional boolean specifying whether all
   * descendants should be selected.
   */
  selectAll(
    parent: Cell = this.getDefaultParent()!,
    includeDescendants: boolean = false,
  ) {
    this.selectionManager.selectAll(parent, includeDescendants)
  }

  /**
   * Select all nodes inside the given parent or the default parent.
   */
  selectNodes(parent: Cell) {
    this.selectionManager.selectCells(true, false, parent)
  }

  /**
   * Select all edges inside the given parent or the default parent.
   */
  selectEdges(parent: Cell) {
    this.selectionManager.selectCells(false, true, parent)
  }

  // #endregion

  // #region :::::::::::: Eventloop

  /**
   * Adds a listener to the graph event dispatch loop. The listener
   * must implement the mouseDown, mouseMove and mouseUp
   */
  addMouseListener(handler: IMouseHandler) {
    this.eventloop.addMouseListener(handler)
  }

  removeMouseListener(handler: IMouseHandler) {
    this.eventloop.removeMouseListener(handler)
  }

  getPointForEvent(e: MouseEvent, addOffset: boolean = true) {
    return this.eventloop.getPointForEvent(e, addOffset)
  }

  /**
   * Dispatches the given event to the graph event dispatch loop.
   */
  fireMouseEvent(eventName: string, e: CustomMouseEvent, sender: any = this) {
    this.eventloop.fireMouseEvent(eventName, e, sender)
  }

  fireGestureEvent(e: MouseEvent, cell?: Cell) {
    this.eventloop.fireGestureEvent(e, cell)
  }

  /**
     * Returns true if the given event is a clone event.
     */
  @hook()
  isCloneEvent(e: MouseEvent) {
    return DomEvent.isControlDown(e)
  }

  /**
   * Returns true if the given event is a toggle event.
   */
  @hook()
  isToggleEvent(e: MouseEvent) {
    return detector.IS_MAC ? DomEvent.isMetaDown(e) : DomEvent.isControlDown(e)
  }

  /**
   * Returns true if the given mouse event should be aligned to the grid.
   */
  @hook()
  isGridEnabledForEvent(e: MouseEvent) {
    return e != null && !DomEvent.isAltDown(e)
  }

  /**
   * Returns true if the given mouse event should be constrained.
   */
  @hook()
  isConstrainedEvent(e: MouseEvent) {
    return DomEvent.isShiftDown(e)
  }

  /**
   * Returns true if the given mouse event should not allow any connections
   * to be made.
   */
  @hook()
  isIgnoreTerminalEvent(e: MouseEvent) {
    return false
  }

  /**
   * Click-through behaviour on selected cells. If this returns true the
   * cell behind the selected cell will be selected.
   */
  @hook()
  isTransparentClickEvent(e: MouseEvent) {
    return false
  }

  // #endregion

  // #region :::::::::::: Graph Viewport

  /**
   * Returns the bounds of the visible graph.
   */
  getGraphBounds() {
    return this.view.getGraphBounds()
  }

  /**
   * Returns the scaled, translated bounds for the given cell.
   *
   * @param cell The `Cell` whose bounds should be returned.
   * @param includeEdges Optional boolean that specifies if the bounds of
   * the connected edges should be included. Default is `false`.
   * @param includeDescendants Optional boolean that specifies if the bounds
   * of all descendants should be included. Default is `false`.
   */
  getCellBounds(
    cell: Cell,
    includeEdges: boolean = false,
    includeDescendants: boolean = false,
  ) {
    return this.viewport.getCellBounds(
      cell,
      includeEdges,
      includeDescendants,
    )
  }

  /**
   * Returns the bounding box for the geometries of the nodes in the
   * given array of cells.
   */
  getBoundingBoxFromGeometry(cells: Cell[], includeEdges: boolean = false) {
    return this.viewport.getBoundingBoxFromGeometry(cells, includeEdges)
  }

  /**
   * Clears all cell states or the states for the hierarchy starting at the
   * given cell and validates the graph.
   */
  refresh(cell: Cell) {
    this.view.clear(cell, cell == null)
    this.view.validate()
    this.viewport.sizeDidChange()
    this.trigger(Graph.events.refresh)
  }

  /**
   * Snaps the given numeric value to the grid.
   */
  snap(value: number) {
    if (this.gridEnabled) {
      return Math.round(value / this.gridSize) * this.gridSize
    }
    return value
  }

  /**
   * Specifies if scrollbars should be used for translate if any scrollbars
   * are available. If scrollbars are enabled in CSS, but no scrollbars
   * appear because the graph is smaller than the container size, then no
   * panning occurs if this is true.
   *
   * Default is `true`.
   */
  useScrollbarsForTranslate: boolean = true

  tx: number = 0
  ty: number = 0

  translate(x: number, y: number, relative: boolean = false) {
    const tx = relative ? this.tx + x : x
    const ty = relative ? this.ty + y : y
    this.viewport.translate(tx, ty)
  }

  translateTo(x: number, y: number) {
    this.translate(x, y, false)
  }

  translateBy(x: number, y: number) {
    this.translate(x, y, true)
  }

  /**
   * Specifies if the viewport should automatically contain the selection
   * cells after a zoom operation.
   *
   * Default is `false`.
   */
  keepSelectionVisibleOnZoom: boolean = false

  /**
   * Specifies if the zoom operations should go into the center of the actual
   * diagram rather than going from top, left.
   *
   * Default is `true`.
   */
  centerZoom: boolean = true

  /**
   * Specifies the factor used for `zoomIn` and `zoomOut`.
   *
   * Default is `1.2`
   */
  zoomFactor: number = 1.2

  zoomIn() {
    this.zoom(this.zoomFactor)
  }

  zoomOut() {
    this.zoom(1 / this.zoomFactor)
  }

  /**
   * Resets the zoom and panning in the view.
   */
  zoomActual() {
    if (this.view.scale === 1) {
      this.view.setTranslate(0, 0)
    } else {
      this.view.translate.x = 0
      this.view.translate.y = 0

      this.view.setScale(1)
    }
  }

  zoomTo(scale: number, center?: boolean) {
    this.zoom(scale / this.view.scale, center)
  }

  /**
   * Zooms the graph using the given factor. Center is an optional boolean
   * argument that keeps the graph scrolled to the center.
   */
  zoom(factor: number, center: boolean = this.centerZoom) {
    this.viewport.zoom(factor, center)
  }

  /**
   * Centers the graph in the container.
   *
   * @param horizontal Optional boolean that specifies if the graph should be
   * centered horizontally. Default is `true`.
   * @param vertical Optional boolean that specifies if the graph should be
   * centered vertically. Default is `true`.
   * @param cx Optional float that specifies the horizontal center.
   * Default is `0.5`.
   * @param cy Optional float that specifies the vertical center.
   * Default is `0.5`.
   */
  center(
    horizontal: boolean = true,
    vertical: boolean = true,
    cx: number = 0.5,
    cy: number = 0.5,
  ) {
    this.viewport.center(horizontal, vertical, cx, cy)
  }

  /**
   * Scales the graph such that the complete diagram fits into container.
   *
   * @param border Optional number that specifies the border.
   * @param keepOrigin Optional boolean that specifies if the translate
   * should be changed. Default is `false`.
   * @param margin Optional margin in pixels. Default is `0`.
   * @param enabled Optional boolean that specifies if the scale should
   * be set or just returned. Default is `true`.
   * @param ignoreWidth Optional boolean that specifies if the width should
   * be ignored. Default is `false`.
   * @param ignoreHeight Optional boolean that specifies if the height should
   * be ignored. Default is `false`.
   * @param maxHeight Optional maximum height.
   */
  fit(
    border: number = this.getBorder(),
    keepOrigin: boolean = false,
    margin: number = 0,
    enabled: boolean = true,
    ignoreWidth: boolean = false,
    ignoreHeight: boolean = false,
    maxHeight?: number,
  ) {
    return this.viewport.fit(
      border, keepOrigin, margin, enabled,
      ignoreWidth, ignoreHeight, maxHeight,
    )
  }

  /**
   * Zooms the graph to the specified rectangle. If the rectangle does not have
   * same aspect ratio as the display container, it is increased in the smaller
   * relative dimension only until the aspect match. The original rectangle is
   * centralised within this expanded one.
   *
   * Note that the input rectangle must be un-scaled and un-translated.
   */
  zoomToRect(rect: Rectangle) {
    this.viewport.zoomToRect(rect)
  }

  /**
   * Pans the graph so that it shows the given cell. Optionally the cell may
   * be centered in the container.
   */
  scrollCellToVisible(cell: Cell, center: boolean = false) {
    this.viewport.scrollCellToVisible(cell, center)
  }

  /**
   * Pans the graph so that it shows the given rectangle.
   */
  scrollRectToVisible(rect: Rectangle) {
    return this.viewport.scrollRectToVisible(rect)
  }

  /**
   * Scrolls the graph to the given point, extending
   * the graph container if specified.
   */
  scrollPointToVisible(
    x: number,
    y: number,
    extend: boolean = false,
    border: number = 20,
  ) {
    this.viewport.scrollPointToVisible(x, y, extend, border)
  }

  // #endregion

  // #region :::::::::::: Soft Links

  batchUpdate(update: () => void) {
    this.model.batchUpdate(update)
  }

  /**
   * Returns the `Geometry` for the given cell.
   */
  getCellGeometry(cell: Cell) {
    return this.model.getGeometry(cell)
  }

  /**
   * Returns true if the given cell is visible in this graph.
   */
  isCellVisible(cell: Cell | null) {
    return cell != null ? this.model.isVisible(cell) : false
  }

  /**
   * Returns `true` if the given cell is collapsed in this graph.
   */
  isCellCollapsed(cell: Cell) {
    return this.model.isCollapsed(cell)
  }

  // #endregion

  // #region :::::::::::: Graph Appearance

  backgroundImage: Image

  getBackgroundImage() {
    return this.backgroundImage
  }

  setBackgroundImage(image: Image) {
    this.backgroundImage = image
  }

  /**
   * Specifies if folding (collapse and expand via an image icon in the graph
   * should be enabled).
   *
   * Default is `true`.
   */
  foldingEnabled: boolean = true
  collapsedImage: Image = images.collapsed
  expandedImage: Image = images.expanded

  getFoldingImage(state: State) {
    if (
      state != null &&
      this.foldingEnabled &&
      !this.getModel().isEdge(state.cell)
    ) {
      const collapsed = this.isCellCollapsed(state.cell)
      if (this.isFoldable(state.cell, !collapsed)) {
        return (collapsed) ? this.collapsedImage : this.expandedImage
      }
    }

    return null
  }

  /**
   * Returns the textual representation for the given cell.
   */
  @hook()
  convertDataToString(cell: Cell): string {
    const data = this.model.getData(cell)
    if (data != null) {
      if (util.isHTMLNode(data)) {
        return data.nodeName
      }

      if (typeof (data.toString) === 'function') {
        return data.toString()
      }
    }

    return ''
  }

  /**
   * Specifies if labels should be visible.
   *
   * Default is `true`.
   */
  labelsVisible: boolean = true

  /**
   * Returns a string or DOM node that represents the label for the given cell.
   */
  @hook()
  getLabel(cell: Cell) {
    let result = ''

    if (this.labelsVisible && cell != null) {
      const style = this.getStyle(cell)
      if (!style.noLabel) {
        result = this.convertDataToString(cell)
      }
    }

    return result
  }

  putLabel(cell: Cell, label: string) {
    const data = cell.getData()
    return typeof data === 'object' ? { ...data } : label
  }

  /**
   * Returns true if the label must be rendered as HTML markup.
   */
  isHtmlLabel(cell: Cell) {
    return this.isHtmlLabels()
  }

  htmlLabels: boolean = false

  isHtmlLabels() {
    return this.htmlLabels
  }

  setHtmlLabels(value: boolean) {
    this.htmlLabels = value
  }

  /**
   * This enables wrapping for HTML labels.
   *
   * Returns true if no white-space CSS style directive should be used for
   * displaying the given cells label.
   *
   * This is used as a workaround for IE ignoring the white-space directive
   * of child elements if the directive appears in a parent element. It
   * should be overridden to return true if a white-space directive is used
   * in the HTML markup that represents the given cells label.
   */
  isWrapping(cell: Cell) {
    const style = this.getStyle(cell)
    return style != null ? style.whiteSpace === 'wrap' : false
  }

  /**
   * Returns true if the overflow portion of labels should be hidden. If this
   * returns true then node labels will be clipped to the size of the vertices.
   */
  isLabelClipped(cell: Cell) {
    const style = this.getStyle(cell)
    return (style != null) ? style.overflow === 'hidden' : false
  }

  /**
   * Returns the string or DOM node to be used as the tooltip
   * for the given cell.
   */
  @hook()
  getTooltip(cell: Cell) {
    return this.convertDataToString(cell)
  }

  /**
   * Returns the string to be used as the link for the given cell.
   */
  @hook()
  getLink(cell: Cell) {
    return null
  }

  /**
   * Returns the cursor value to be used for the CSS of the shape for the
   * given cell.
   */
  @hook()
  getCursor(cell: Cell | null) {
    return null
  }

  /**
   * Border to be added to the bottom and right side when the
   * container is being resized after the graph has been changed.
   *
   * Default is `0`.
   */
  border: number = 0

  getBorder() {
    return this.border
  }

  setBorder(value: number) {
    this.border = value
  }

  /**
   * Returns true if the given cell is a swimlane in the graph. A
   * swimlane is a container cell with some specific behaviour.
   */
  isSwimlane(cell: Cell | null) {
    if (cell != null) {
      if (this.model.getParent(cell) !== this.model.getRoot()) {
        const style = this.getStyle(cell)
        if (style != null && !this.model.isEdge(cell)) {
          return (style.shape === Shapes.swimlane)
        }
      }
    }
    return false
  }

  /**
   * Returns the start size of the given swimlane, that is, the width
   * or height of the part that contains the title, depending on the
   * horizontal style. The return value is an `Rectangle` with either
   * width or height set as appropriate.
   */
  getStartSize(swimlane: Cell | null) {
    const result = new Rectangle()
    const style = this.getStyle(swimlane)
    if (style != null) {
      const size = style.startSize || constants.DEFAULT_STARTSIZE
      if (style.horizontal !== false) {
        result.height = size
      } else {
        result.width = size
      }
    }

    return result
  }

  // #endregion

  // #region :::::::::::: Graph Behaviour

  enableGuide() {
    this.graphHandler.guideEnabled = true
  }

  disableGuide() {
    this.graphHandler.guideEnabled = false
  }

  enableRubberband() {
    this.rubberbandHandler.enable()
  }

  disableRubberband() {
    this.rubberbandHandler.disable()
  }

  hideTooltip() {
    if (this.tooltipHandler) {
      this.tooltipHandler.hide()
    }
  }

  enableTooltip() {
    this.tooltipHandler.enable()
  }

  disableTooltips() {
    this.tooltipHandler.disable()
  }

  setConnectable(connectable: boolean) {
    if (connectable) {
      this.connectionHandler.enable()
    } else {
      this.connectionHandler.disable()
    }
  }

  enableConnection() {
    this.connectionHandler.enable()
  }

  disableConnection() {
    this.connectionHandler.disable()
  }

  isConnectable() {
    return this.connectionHandler.isEnabled()
  }

  enablePanning() {
    this.panningHandler.enablePanning()
  }

  disablePanning() {
    this.panningHandler.disablePanning()
  }

  enablePinch() {
    this.panningHandler.enablePinch()
  }

  disablePinch() {
    this.panningHandler.disablePinch()
  }

  /**
   * Specifies if the container should be resized to the graph size when
   * the graph size has changed.
   *
   * Default is `false`.
   */
  resizeContainer: boolean = false

  /**
   * Specifies if the container should be resized to the graph size when
   * the graph size has changed.
   */
  isResizeContainer() {
    return this.resizeContainer
  }

  setResizeContainer(value: boolean) {
    this.resizeContainer = value
  }

  /**
   * Specifies if handle escape key press.
   *
   * Default is `true`.
   */
  escapeEnabled: boolean = true

  isEscapeEnabled() {
    return this.escapeEnabled
  }

  setEscapeEnabled(value: boolean) {
    this.escapeEnabled = value
  }

  /**
   * If true, when editing is to be stopped by way of selection changing,
   * data in diagram changing or other means stopCellEditing is invoked, and
   * changes are saved.
   *
   * Default is `true`.
   */
  invokesStopCellEditing: boolean = true

  isInvokesStopCellEditing() {
    return this.invokesStopCellEditing
  }

  setInvokesStopCellEditing(value: boolean) {
    this.invokesStopCellEditing = value
  }

  /**
   * If true, pressing the enter key without pressing control or shift will
   * stop editing and accept the new value.
   *
   * Note: You can always use F2 and escape to stop editing.
   *
   * Default is `false`.
   */
  stopEditingOnEnter: boolean = false

  isEnterStopsCellEditing() {
    return this.stopEditingOnEnter
  }

  setEnterStopsCellEditing(value: boolean) {
    this.stopEditingOnEnter = value
  }

  /**
   * Returns true if the given cell may not be moved, sized, bended,
   * disconnected, edited or selected.
   */
  @hook()
  isCellLocked(cell: Cell | null) {
    const geometry = this.model.getGeometry(cell)
    return (
      this.isCellsLocked() || (geometry != null &&
        this.model.isNode(cell) && geometry.relative)
    )
  }

  cellsLocked: boolean = false

  /**
   * Returns true if the given cell may not be moved, sized, bended,
   * disconnected, edited or selected.
   *
   * Default is `false`.
   */
  isCellsLocked() {
    return this.cellsLocked
  }

  /**
   * Sets if any cell may be moved, sized, bended, disconnected, edited or
   * selected.
   */
  setCellsLocked(value: boolean) {
    this.cellsLocked = value
  }

  /**
   * Returns the cells which may be exported in the given array of cells.
   */
  getCloneableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellCloneable(cell))
  }

  /**
   * Returns true if the given cell is cloneable.
   */
  isCellCloneable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsCloneable() && style.cloneable !== false
  }

  cellsCloneable: boolean = true

  /**
   * Returns true if the graph allows cloning of cells by using control-drag.
   *
   * Default is `true`.
   */
  isCellsCloneable() {
    return this.cellsCloneable
  }

  /**
   * Specifies if the graph should allow cloning of cells by holding
   * down the control key while cells are being moved.
   */
  setCellsCloneable(value: boolean) {
    this.cellsCloneable = value
  }

  /**
   * Returns the cells which may be exported in the given array of cells.
   */
  getExportableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.canExportCell(cell))
  }

  exportEnabled: boolean = true

  /**
   * Returns true if the given cell may be exported to the clipboard.
   *
   * Default is `true`.
   */
  canExportCell(cell: Cell) {
    return this.exportEnabled
  }

  /**
   * Returns the cells which may be imported in the given array of cells.
   */
  getImportableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.canImportCell(cell))
  }

  importEnabled: boolean = true

  /**
   * Returns true if the given cell may be imported from the clipboard.
   *
   * Default is `true`.
   */
  canImportCell(cell: Cell) {
    return this.importEnabled
  }

  cellsSelectable: boolean = true

  isCellSelectable(cell: Cell) {
    return this.isCellsSelectable()
  }

  isCellsSelectable() {
    return this.cellsSelectable
  }

  setCellsSelectable(value: boolean) {
    this.cellsSelectable = value
  }

  getDeletableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellDeletable(cell))
  }

  isCellDeletable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsDeletable() && style.deletable === true
  }

  cellsDeletable: boolean = true

  isCellsDeletable() {
    return this.cellsDeletable
  }

  setCellsDeletable(value: boolean) {
    this.cellsDeletable = value
  }

  isCellRotatable(cell: Cell) {
    const style = this.getStyle(cell)
    return style.rotatable !== false
  }

  getMovableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellMovable(cell))
  }

  isLabelMovable(cell: Cell | null) {
    return (
      !this.isCellLocked(cell) &&
      (
        (this.model.isEdge(cell) && this.edgeLabelsMovable) ||
        (this.model.isNode(cell) && this.nodeLabelsMovable)
      )
    )
  }

  isCellMovable(cell: Cell | null) {
    const style = this.getStyle(cell)
    return (
      this.isCellsMovable() &&
      !this.isCellLocked(cell) &&
      style.movable !== false
    )
  }

  cellsMovable: boolean = true

  isCellsMovable() {
    return this.cellsMovable
  }

  setCellsMovable(value: boolean) {
    this.cellsMovable = value
  }

  /**
   * Specifies if the grid is enabled.
   */
  gridEnabled: boolean = false

  enableGrid() {
    this.gridEnabled = true
  }

  disableGrid() {
    this.gridEnabled = false
  }

  /**
   * Specifies the grid size.
   *
   * Default is `10`.
   */
  gridSize: number

  getGridSize() {
    return this.gridSize
  }

  setGridSize(size: number) {
    this.gridSize = size
  }

  isGridEnabled() {
    return this.gridEnabled
  }

  /**
   * Specifies if ports are enabled.
   *
   * Default is `true`.
   */
  portsEnabled: boolean = true

  isPortsEnabled() {
    return this.portsEnabled
  }

  setPortsEnabled(value: boolean) {
    this.portsEnabled = value
  }

  /**
   * Tolerance for a move to be handled as a single click.
   *
   * Default is `4` pixels.
   */
  tolerance = 4

  getTolerance() {
    return this.tolerance
  }

  setTolerance(value: number) {
    this.tolerance = value
  }

  /**
   * Specifies if the label of node movable.
   *
   * Default is `false`.
   */
  nodeLabelsMovable: boolean = false

  isNodeLabelsMovable() {
    return this.nodeLabelsMovable
  }

  setNodeLabelsMovable(value: boolean) {
    this.nodeLabelsMovable = value
  }

  /**
   * Specifies if the label of edge movable.
   *
   * Default is `true`.
   */
  edgeLabelsMovable: boolean = true

  isEdgeLabelsMovable() {
    return this.edgeLabelsMovable
  }

  setEdgeLabelsMovable(value: boolean) {
    this.edgeLabelsMovable = value
  }

  /**
   * Specifies if nesting of swimlanes is allowed.
   *
   * Default is `true`.
   */
  swimlaneNesting: boolean = true

  isSwimlaneNesting() {
    return this.swimlaneNesting
  }

  /**
   * Specifies if swimlanes can be nested by drag and drop.
   */
  setSwimlaneNesting(value: boolean) {
    this.swimlaneNesting = value
  }

  /**
   * Specifies if swimlanes should be selectable via the content if the
   * mouse is released.
   *
   * Default is `true`.
   */
  swimlaneSelectionEnabled: boolean = true

  isSwimlaneSelectionEnabled() {
    return this.swimlaneSelectionEnabled
  }

  /**
   * Specifies if swimlanes should be selected if the mouse is
   * released over their content area.
   */
  setSwimlaneSelectionEnabled(value: boolean) {
    this.swimlaneSelectionEnabled = value
  }

  /**
   * Specifies if multiple edges in the same direction between the
   * same pair of nodes are allowed.
   *
   * Default is `true`.
   */
  multigraph: boolean = true

  isMultigraph() {
    return this.multigraph
  }

  /**
   * Specifies if the graph should allow multiple connections between the
   * same pair of nodes.
   */
  setMultigraph(value: boolean) {
    this.multigraph = value
  }

  /**
   * Specifies if loops (aka self-references) are allowed.
   *
   * Default is `false`.
   */
  allowLoops: boolean = false

  isAllowLoops() {
    return this.allowLoops
  }

  setAllowLoops(value: boolean) {
    this.allowLoops = value
  }

  /**
   * Specifies if edges with disconnected terminals are allowed in the graph.
   *
   * Default is `true`.
   */
  allowDanglingEdges: boolean = true

  /**
   * Specifies if dangling edges are allowed, that is, if edges are allowed
   * that do not have a source and/or target terminal defined.
   */
  setAllowDanglingEdges(value: boolean) {
    this.allowDanglingEdges = value
  }

  isAllowDanglingEdges() {
    return this.allowDanglingEdges
  }

  /**
   * Specifies if edges are connectable.
   *
   * Default is `false`.
   */
  connectableEdges: boolean = false

  setConnectableEdges(value: boolean) {
    this.connectableEdges = value
  }

  isConnectableEdges() {
    return this.connectableEdges
  }

  /**
   * Specifies if edges that are cloned should be validated and only
   * inserted if they are valid.
   *
   * Default is `false`.
   */
  cloneInvalidEdges: boolean = false

  /**
   * Specifies if edges should be inserted when cloned but not valid.
   * If false such edges will be silently ignored.
   */
  setCloneInvalidEdges(value: boolean) {
    this.cloneInvalidEdges = value
  }

  isCloneInvalidEdges() {
    return this.cloneInvalidEdges
  }

  /**
   * Specifies if edges should be disconnected from their terminals
   * when they are moved.
   *
   * Default is `true`.
   */
  disconnectOnMove: boolean = true

  isDisconnectOnMove() {
    return this.disconnectOnMove
  }

  setDisconnectOnMove(value: boolean) {
    this.disconnectOnMove = value
  }

  dropEnabled: boolean = false

  isDropEnabled() {
    return this.dropEnabled
  }

  /**
   * Specifies if the graph should allow dropping of cells onto or into other
   * cells.
   */
  setDropEnabled(value: boolean) {
    this.dropEnabled = value
  }

  /**
   * Specifies if dropping onto edges should be splited.
   *
   * Default is `true`.
   */
  splitEnabled: boolean = true

  isSplitEnabled() {
    return this.splitEnabled
  }

  /**
   * Specifies if dropping onto edges should be enabled.
   */
  setSplitEnabled(value: boolean) {
    this.splitEnabled = value
  }

  /**
   * Returns true if the given cell is resizable.
   */
  isCellResizable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsResizable() &&
      !this.isCellLocked(cell) &&
      style.resizable !== false
    )
  }

  /**
   * Specifies if the graph should allow resizing of cells.
   *
   * Default is `true`.
   */
  cellsResizable = true

  isCellsResizable() {
    return this.cellsResizable
  }

  /**
   * Specifies if the graph should allow resizing of cells.
   */
  setCellsResizable(value: boolean) {
    this.cellsResizable = value
  }

  /**
   * Returns true if the given terminal point is movable.
   */
  isTerminalPointMovable(cell: Cell, isSource: boolean) {
    return true
  }

  /**
   * Returns true if the given cell is bendable.
   */
  isCellBendable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsBendable() &&
      !this.isCellLocked(cell) &&
      style.bendable !== false
    )
  }

  cellsBendable: boolean = true

  isCellsBendable() {
    return this.cellsBendable
  }

  /**
   * Specifies if the graph should allow bending of edges.
   */
  setCellsBendable(value: boolean) {
    this.cellsBendable = value
  }

  /**
   * Returns true if the given cell is editable.
   */
  isCellEditable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsEditable() &&
      !this.isCellLocked(cell) &&
      style.editable !== false
  }

  cellsEditable: boolean = true

  isCellsEditable() {
    return this.cellsEditable
  }

  /**
   * Specifies if the graph should allow in-place editing for cell labels.
   */
  setCellsEditable(value: boolean) {
    this.cellsEditable = value
  }

  /**
   * Returns true if the given cell is disconnectable from the source or
   * target terminal.
   */
  isCellDisconnectable(cell: Cell, terminal: Cell, isSource: boolean) {
    return this.isCellsDisconnectable() && !this.isCellLocked(cell)
  }

  /**
   * Specifies if cells is disconnectable.
   *
   * Default is `true`.
   */
  cellsDisconnectable: boolean = true

  isCellsDisconnectable() {
    return this.cellsDisconnectable
  }

  setCellsDisconnectable(value: boolean) {
    this.cellsDisconnectable = value
  }

  /**
   * Returns true if the given cell is connectable in this graph.
   */
  @hook()
  isCellConnectable(cell: Cell | null) {
    return this.model.isConnectable(cell)
  }

  /**
   * Returns true if the given cell is a valid source for new connections.
   */
  @hook()
  isValidSource(cell: Cell | null) {
    return (
      (cell == null && this.allowDanglingEdges) ||
      (
        cell != null && (
          !this.model.isEdge(cell) || this.connectableEdges) &&
        this.isCellConnectable(cell)
      )
    )
  }

  /**
   * Returns true if the given cell is a valid target for new connections.
   */
  @hook()
  isValidTarget(cell: Cell | null) {
    return this.isValidSource(cell)
  }

  /**
   * Returns true if the given target cell is a valid target for source.
   */
  isValidConnection(source: Cell | null, target: Cell | null) {
    return this.isValidSource(source) && this.isValidTarget(target)
  }

  /**
   * Returns true if the given cell is currently being edited.
   */
  isEditing(cell?: Cell) {
    if (this.cellEditor != null) {
      const editingCell = this.cellEditor.getEditingCell()
      return (cell == null) ? editingCell != null : cell === editingCell
    }

    return false
  }

  /**
   * Returns true if the size of the given cell should automatically be
   * updated after a change of the label.
   */
  isAutoSizeCell(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isAutoSizeCells() || style.autosize === true
  }

  /**
  * Specifies if autoSize style should be applied when cells are added.
  *
  * Default is `false`.
  */
  autoSizeOnAdded: boolean = false

  /**
   * Specifies if the graph should automatically update the cell
   * size after an edit.
   *
   * Default is `false`.
   */
  autoSizeOnEdited: boolean = false

  isAutoSizeCells() {
    return this.autoSizeOnEdited
  }

  /**
   * Specifies if cell sizes should be automatically updated
   * after a label change.
   */
  setAutoSizeCells(value: boolean) {
    this.autoSizeOnEdited = value
  }

  /**
   * Returns true if the parent of the given cell should be extended
   * if the child has been resized so that it overlaps the parent.
   */
  @hook()
  isExtendParent(cell: Cell) {
    return !this.model.isEdge(cell) && this.isExtendParents()
  }

  /**
   * Specifies if a parent should contain the child bounds after
   * a resize of the child.
   *
   * Default is `true`.
   */
  extendParents: boolean = true

  isExtendParents() {
    return this.extendParents
  }

  setExtendParents(value: boolean) {
    this.extendParents = value
  }

  extendParentsOnAdd: boolean = true

  isExtendParentsOnAdd() {
    return this.extendParentsOnAdd
  }

  setExtendParentsOnAdd(value: boolean) {
    this.extendParentsOnAdd = value
  }

  extendParentsOnMove: boolean = false

  isExtendParentsOnMove() {
    return this.extendParentsOnMove
  }

  setExtendParentsOnMove(value: boolean) {
    this.extendParentsOnMove = value
  }

  recursiveResize: boolean = false

  isRecursiveResize() {
    return this.recursiveResize
  }

  setRecursiveResize(value: boolean) {
    this.recursiveResize = value
  }

  /**
   * Returns true if the given cell should be kept inside the
   * bounds of its parent.
   */
  isConstrainChild(cell: Cell) {
    return this.isConstrainChildren() &&
      !this.model.isEdge(this.model.getParent(cell)!)
  }

  /**
   * Specifies if a child should be constrained inside the parent
   * bounds after a move or resize of the child.
   *
   * Default is `true`.
   */
  constrainChildren: boolean = true

  isConstrainChildren() {
    return this.constrainChildren
  }

  setConstrainChildren(value: boolean) {
    this.constrainChildren = value
  }

  /**
   * Specifies if child cells with relative geometries should be
   * constrained inside the parent bounds.
   *
   * Default is `false`.
   */
  constrainRelativeChildren: boolean = false

  isConstrainRelativeChildren() {
    return this.constrainRelativeChildren
  }

  setConstrainRelativeChildren(value: boolean) {
    this.constrainRelativeChildren = value
  }

  /**
   * Specifies if negative coordinates for nodes are allowed.
   *
   * Default is `true`.
   */
  allowNegativeCoordinates = true

  isAllowNegativeCoordinates() {
    return this.allowNegativeCoordinates
  }

  setAllowNegativeCoordinates(value: boolean) {
    this.allowNegativeCoordinates = value
  }

  /**
   * Specifies the portion of the child which is allowed to overlap the parent.
   */
  defaultOverlap: number = 0.5

  /**
   * Returns a decimal number representing the amount of the width and height
   * of the given cell that is allowed to overlap its parent. A value of 0
   * means all children must stay inside the parent, 1 means the child is
   * allowed to be placed outside of the parent such that it touches one of
   * the parents sides.
   */
  getOverlap(cell: Cell) {
    return (this.isAllowOverlapParent(cell)) ? this.defaultOverlap : 0
  }

  /**
   * Returns true if the given cell is allowed to be placed outside of the
   * parents area.
   */
  isAllowOverlapParent(cell: Cell) {
    return false
  }

  /**
   * Returns the cells which are movable in the given array of cells.
   */
  getFoldableCells(cells: Cell[], collapse: boolean) {
    return this.model.filterCells(cells, cell => this.isFoldable(cell, collapse))
  }

  /**
   * Returns true if the given cell is foldable.
   */
  @hook()
  isFoldable(cell: Cell, nextCollapseState: boolean) {
    const style = this.getStyle(cell)
    return (this.model.getChildCount(cell) > 0 && style.foldable !== false)
  }

  /**
   * Returns true if the given cell is a valid drop target for
   * the specified cells.
   */
  isValidDropTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    return target != null && ((this.isSplitEnabled() &&
      this.isSplitTarget(target, cells, e)) || (!this.model.isEdge(target) &&
        (this.isSwimlane(target) || (this.model.getChildCount(target) > 0 &&
          !this.isCellCollapsed(target)))))
  }

  /**
   * Returns true if the given edge may be splitted into two edges
   * with the given cell as a new terminal between the two.
   */
  isSplitTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    if (
      this.model.isEdge(target) &&
      cells != null &&
      cells.length === 1 &&
      this.isCellConnectable(cells[0]) &&
      this.isEdgeValid(target, this.model.getTerminal(target, true), cells[0])
    ) {
      const src = this.model.getTerminal(target, true)!
      const trg = this.model.getTerminal(target, false)!

      return (
        !this.model.isAncestor(cells[0], src) &&
        !this.model.isAncestor(cells[0], trg)
      )
    }

    return false
  }

  /**
   * Returns the given cell if it is a drop target for the given cells or the
   * nearest ancestor that may be used as a drop target for the given cells.
   *
   * @param cells Array of `Cell`s which are to be dropped onto the target.
   * @param e Mouseevent for the drag and drop.
   * @param cell `Cell` that is under the mousepointer.
   * @param clone Optional boolean to indicate of cells will be cloned.
   */
  getDropTarget(
    cells: Cell[],
    e: MouseEvent,
    cell: Cell | null,
    clone?: boolean,
  ) {

    if (!this.isSwimlaneNesting()) {
      for (let i = 0; i < cells.length; i += 1) {
        if (this.isSwimlane(cells[i])) {
          return null
        }
      }
    }

    const p = util.clientToGraph(
      this.container,
      DomEvent.getClientX(e),
      DomEvent.getClientY(e),
    )
    p.x -= this.tx
    p.y -= this.ty
    const swimlane = this.getSwimlaneAt(p.x, p.y)

    if (cell == null) {
      // tslint:disable-next-line
      cell = swimlane!
    } else if (swimlane != null) {
      // Checks if the cell is an ancestor of the swimlane
      // under the mouse and uses the swimlane in that case
      let tmp = this.model.getParent(swimlane)

      while (tmp != null && this.isSwimlane(tmp) && tmp !== cell) {
        tmp = this.model.getParent(tmp)
      }

      if (tmp === cell) {
        // tslint:disable-next-line
        cell = swimlane
      }
    }

    while (
      cell != null &&
      !this.isValidDropTarget(cell, cells, e) &&
      !this.model.isLayer(cell)) {
      // tslint:disable-next-line
      cell = this.model.getParent(cell)!
    }

    // Checks if parent is dropped into child if not cloning
    if (clone == null || !clone) {
      let parent = cell

      while (parent != null && util.indexOf(cells, parent) < 0) {
        parent = this.model.getParent(parent)!
      }
    }

    return (!this.model.isLayer(cell) && parent == null) ? cell : null
  }

  // #endregion

  // #region :::::::::::: Dispose

  protected disposeManagers() {
    this.changeManager.dispose()
    this.eventloop.dispose()
    this.selection.dispose()
    this.selectionManager.dispose()
    this.handlerManager.dispose()
    this.validator.dispose()
    this.viewport.dispose()
    this.cellManager.dispose()
  }

  protected disposeHandlers() {
    this.tooltipHandler.dispose()
    this.panningHandler.dispose()
    this.popupMenuHandler.dispose()
    this.selectionHandler.dispose()
    this.graphHandler.dispose()
    this.connectionHandler.dispose()
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.disposeManagers()
    this.disposeHandlers()

    if (this.cellEditor != null) {
      this.cellEditor.dispose()
    }

    if (this.view != null) {
      this.view.dispose()
    }

    (this as any).container = null

    super.dispose()
  }

  // #endregion
}

function hook(hookName?: string) {
  return (
    target: Graph,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) => {
    const raw = descriptor.value
    const name = hookName || methodName

    descriptor.value = function (this: Graph, ...args: any[]) {
      const hook = (this.options as any)[name]
      if (hook != null) {
        const ret = util.apply(hook, this, args)
        if (ret != null) {
          return ret
        }
      }

      return raw.call(this, ...args)
    }
  }
}

function afterCreate(aopName?: string) {
  return (
    target: Graph,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) => {
    const raw = descriptor.value
    const name = aopName || `on${util.ucFirst(methodName)}`

    descriptor.value = function (this: Graph, ...args: any[]) {
      const instance = raw.call(this, ...args)
      const aop = (this.options as any)[name]
      if (aop != null) {
        args.unshift(instance)
        return util.apply(aop, this, args)
      }

      return instance
    }
  }
}

export namespace Graph {
  export interface Hooks {
    createModel?: (this: Graph, graph: Graph) => Model
    createView?: (this: Graph, graph: Graph) => View
    createRenderer?: (this: Graph, graph: Graph) => Renderer
    createStyleSheet?: (this: Graph, graph: Graph) => StyleSheet
    createSelection?: (this: Graph, graph: Graph) => Selection

    createTooltipHandler?: (this: Graph, graph: Graph) => TooltipHandler
    createConnectionHandler?: (this: Graph, graph: Graph) => ConnectionHandler
    createSelectionHandler?: (this: Graph, graph: Graph) => SelectionHandler
    createGraphHandler?: (this: Graph, graph: Graph) => GraphHandler
    createPanningHandler?: (this: Graph, graph: Graph) => PanningHandler
    createPopupMenuHandler?: (this: Graph, graph: Graph) => PopupMenuHandler
    createNodeHandler?: (this: Graph, graph: Graph, state: State) => NodeHandler
    createEdgeHandler?: (this: Graph, graph: Graph, state: State) => EdgeHandler
    createElbowEdgeHandler?: (this: Graph, graph: Graph, state: State) => EdgeHandler
    createEdgeSegmentHandler?: (this: Graph, graph: Graph, state: State) => EdgeHandler
    createRubberbandHandler?: (this: Graph, graph: Graph) => RubberbandHandler

    isCloneEvent?: (e: MouseEvent) => boolean | null
    isToggleEvent?: (e: MouseEvent) => boolean | null
    isConstrainedEvent?: (e: MouseEvent) => boolean | null
    isGridEnabledForEvent?: (e: MouseEvent) => boolean | null
    isIgnoreTerminalEvent?: (this: Graph, e: MouseEvent) => boolean | null
    isTransparentClickEvent?: (this: Graph, e: MouseEvent) => boolean | null

    isValidSource?: (this: Graph, cell: Cell | null) => boolean | null
    isValidTarget?: (this: Graph, cell: Cell | null) => boolean | null
    isCellConnectable?: (this: Graph, cell: Cell | null) => boolean | null
    isCellLocked?: (this: Graph, cell: Cell | null) => boolean | null

    isValidRoot?: (this: Graph, cell: Cell | null) => boolean | null
    isPort?: (this: Graph, cell: Cell) => boolean | null
    getTerminalForPort?: (this: Graph, cell: Cell, isSource: boolean) => Cell | null
    getChildOffsetForCell?: (this: Graph, cell: Cell) => Point | null
    getTranslateForRoot?: (this: Graph, cell: Cell | null) => Point | null

    isExtendParent?: (this: Graph, cell: Cell) => boolean | null
    isFoldable?: (this: Graph, cell: Cell, nextCollapseState: boolean) => boolean | null

    validateCell?: (this: Graph, cell: Cell, context: any) => string | null
    validateEdge?: (
      this: Graph,
      edge: Cell | null,
      source: Cell | null,
      target: Cell | null,
    ) => string | null

    getLink?: (this: Graph, cell: Cell) => string | null
    getCursor?: (this: Graph, cell: Cell) => string | null
    getTooltip?: (this: Graph, cell: Cell) => string | HTMLElement | null
    getConstraints?: (
      this: Graph,
      cell: Cell,
      isSource: boolean,
    ) => Constraint[] | null

    getLabel?: (this: Graph, cell: Cell) => string | null
    putLabel?: (this: Graph, cell: Cell, label: string) => null | any
    getEditingValue?: (this: Graph, cell: Cell, e?: Event) => string | null
    convertDataToString?: (this: Graph, cell: Cell) => string | null

    // after creation
    // ----
    onCreateNode?: (this: Graph, node: Cell, options: Graph.CreateNodeOptions) => Cell
    onCreateEdge?: (this: Graph, edge: Cell, options: Graph.CreateEdgeOptions) => Cell
    onCreateGroup?: (this: Graph, group: Cell, cells: Cell[]) => Cell
  }

  export interface Options extends Hooks, Feature.Options {
    model?: Model,
    styleSheet?: StyleSheet,
  }

  export interface CreateNodeOptions {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    relative?: boolean,
    offset?: Point | Point.PointLike,

    id?: string,
    data?: any,
    style?: CellStyle,
    visible?: boolean,
    collapsed?: boolean,
    connectable?: boolean,
    overlays?: Overlay[],
    /**
     * Stores alternate values for x, y, width and height in a rectangle.
     */
    alternateBounds?: Rectangle | Rectangle.RectangleLike,
  }

  export interface AddNodeOptions extends CreateNodeOptions {
    parent?: Cell,
    index?: number,
  }

  export interface CreateEdgeOptions {
    sourcePoint?: Point | Point.PointLike,
    targetPoint?: Point | Point.PointLike,
    points?: (Point | Point.PointLike)[],
    offset?: Point | Point.PointLike,

    id?: string | null,
    data?: any,
    style?: CellStyle,
    visible?: boolean,
    overlays?: Overlay[],
  }

  export interface AddEdgeOptions extends CreateEdgeOptions {
    parent?: Cell,
    index?: number,
    sourceNode?: Cell,
    targetNode?: Cell,
  }

  export const events = {
    refresh: 'refresh',
    root: 'root',

    addCells: 'addCells',
    cellsAdded: 'cellsAdded',
    removeCells: 'removeCells',
    cellsRemoved: 'cellsRemoved',
    removeCellsFromParent: 'removeCellsFromParent',
    connectCell: 'connectCell',
    cellConnected: 'cellConnected',
    groupCells: 'groupCells',
    ungroupCells: 'ungroupCells',
    splitEdge: 'splitEdge',
    updateCellSize: 'updateCellSize',
    resizeCells: 'resizeCells',
    cellsResized: 'cellsResized',
    addOverlay: 'addOverlay',
    removeOverlay: 'removeOverlay',
    removeOverlays: 'removeOverlays',
    foldCells: 'foldCells',
    cellsFolded: 'cellsFolded',
    orderCells: 'orderCells',
    cellsOrdered: 'cellsOrdered',
    toggleCells: 'toggleCells',
    flipEdge: 'flipEdge',
    alignCells: 'alignCells',
    moveCells: 'moveCells',
    cellsMoved: 'cellsMoved',

    startEditing: 'startEditing',
    editingStarted: 'editingStarted',
    editingStopped: 'editingStopped',
    labelChanged: 'labelChanged',
    size: 'size',

    click: 'click',
    dblclick: 'dblclick',
    tapAndHold: 'tapAndHold',
    escape: 'escape',

    translate: 'translate',
    gesture: 'gesture',
    fireMouseEvent: 'fireMouseEvent',
    showContextMenu: 'showContextMenu',
    hideContextMenu: 'hideContextMenu',
    selectionChanged: 'selectionChanged',
  }
}
