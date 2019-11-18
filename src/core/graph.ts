import * as util from '../util'
import * as images from '../assets/images'
import * as routers from '../router'
import { Cell } from './cell'
import { View } from './view'
import { Model } from './model'
import { State } from './state'
import { Geometry } from './geometry'
import { Renderer } from './renderer'
import { IHooks } from './hook'
import { RoutingFunction } from './registry'
import { Align, VAlign, Style, Dialect, Size } from '../types'
import {
  SimpleOptions,
  CompositeOptions,
  GraphOptions,
  getOptions,
  applyOptions,
} from '../option'
import {
  detector,
  DomEvent,
  MouseEventEx,
  Disablable,
  Disposable,
} from '../common'
import {
  Rectangle,
  Point,
  Constraint,
  Image,
  Overlay,
  ShapeNames,
  Multiplicity,
  CellPath,
} from '../struct'
import {
  CellEditor,
  IMouseHandler,
  TooltipHandler,
  CursorHandler,
  KeyboardHandler,
  ContextMenuHandler,
  PanningHandler,
  GuideHandler,
  MovingHandler,
  SelectionHandler,
  ConnectionHandler,
  RubberbandHandler,
  NodeHandler,
  EdgeHandler,
  EdgeElbowHandler,
  EdgeSegmentHandler,
} from '../handler'
import {
  ChangeManager,
  EventLoop,
  Selection,
  SelectionManager,
  ValidationManager,
  ViewportManager,
  CellManager,
} from '../manager'

export class Graph extends Disablable implements
  IHooks,
  SimpleOptions,
  CompositeOptions {

  public readonly options: Graph.Options
  public readonly container: HTMLElement
  public readonly model: Model
  public readonly view: View
  public readonly renderer: Renderer

  public readonly cellEditor: CellEditor
  public readonly changeManager: ChangeManager
  public readonly eventloop: EventLoop
  public readonly selection: Selection
  public readonly selectionManager: SelectionManager
  public readonly validator: ValidationManager
  public readonly viewport: ViewportManager
  public readonly cellManager: CellManager

  public readonly keyboardHandler: KeyboardHandler
  public readonly tooltipHandler: TooltipHandler
  public readonly cursorHandler: CursorHandler
  public readonly contextMenuHandler: ContextMenuHandler
  public readonly guideHandler: GuideHandler
  public readonly selectionHandler: SelectionHandler
  public readonly connectionHandler: ConnectionHandler
  public readonly panningHandler: PanningHandler
  public readonly movingHandler: MovingHandler
  public readonly rubberbandHandler: RubberbandHandler
  panningManager: any

  public panDx: number = 0
  public panDy: number = 0

  /**
   * Get the native value of hooked method.
   */
  public getNativeValue: <T>() => (T | null)

  // #region :::::::::::: Properties

  prefixCls: string
  dialect: Dialect
  antialiased: boolean
  multiplicities: Multiplicity[] = []
  alternateEdgeStyle: Style
  nativeDblClickEnabled: boolean = true
  doubleTapEnabled: boolean = true
  doubleTapTimeout: number = 500
  doubleTapTolerance: number = 25
  tapAndHoldEnabled: boolean = true
  tapAndHoldDelay: number = 500

  pageBreakEnabled: boolean = false
  pageBreakColor = 'gray'
  pageBreakDashed: boolean = true
  minPageBreakDist: number = 20
  togglePageBreak() {
    this.pageBreakEnabled = !this.pageBreakEnabled
  }
  enablePageBreak() {
    this.pageBreakEnabled = true
  }
  disablePageBreak() {
    this.pageBreakEnabled = false
  }

  /**
   * Specifies if the background page should be visible.
   *
   * Default is `false`.
   */
  pageVisible: boolean = false

  preferPageSize: boolean = false
  pageFormat: Size
  pageScale: number = 1
  updatePageScale(scale: number) {
    if (this.pageScale !== scale) {
      this.pageScale = scale
      if (this.pageVisible) {
        this.sizeDidChange()
        this.view.validateBackground()
      }
    }
  }

  backgroundImage: Image
  getBackgroundImage() { return this.backgroundImage }
  setBackgroundImage(image: Image) { this.backgroundImage = image }

  autoScroll: boolean = true
  ignoreScrollbars: boolean = false
  translateToScrollPosition: boolean = false
  timerAutoScroll: boolean = false
  allowAutoPanning: boolean = false
  autoExtend: boolean = true
  maxGraphBounds: Rectangle | null
  minGraphSize: Size | null
  minContainerSize: Size | null
  maxContainerSize: Size | null
  keepEdgesInForeground: boolean = false
  keepEdgesInBackground: boolean = false
  resetViewOnRootChange: boolean = true
  resetEdgesOnResize: boolean = false
  resetEdgesOnMove: boolean = false
  resetEdgesOnConnect: boolean = true
  defaultLoopRouter: RoutingFunction = routers.loop
  swimlaneIndicatorColorAttribute: string = 'fill'
  minFitScale: number = 0.1
  maxFitScale: number = 8
  useScrollbarsForPanning: boolean = true
  keepSelectionVisibleOnZoom: boolean = false
  centerZoom: boolean = true
  scaleFactor: number = 1.5
  minScale: number = 0.01
  maxScale: number = 16
  cellsLocked: boolean = false
  isCellsLocked() {
    return this.cellsLocked
  }
  setCellsLocked(value: boolean) {
    this.cellsLocked = value
  }

  cellsCloneable: boolean = true
  isCellsCloneable() {
    return this.cellsCloneable
  }
  setCellsCloneable(value: boolean) {
    this.cellsCloneable = value
  }

  cellsSelectable: boolean = true
  isCellsSelectable() {
    return this.cellsSelectable
  }
  setCellsSelectable(value: boolean) {
    this.cellsSelectable = value
  }

  cellsDeletable: boolean = true
  isCellsDeletable() {
    return this.cellsDeletable
  }
  setCellsDeletable(value: boolean) {
    this.cellsDeletable = value
  }

  nodeLabelsMovable: boolean = false
  isNodeLabelsMovable() {
    return this.nodeLabelsMovable
  }
  setNodeLabelsMovable(value: boolean) {
    this.nodeLabelsMovable = value
  }

  edgeLabelsMovable: boolean = true
  isEdgeLabelsMovable() {
    return this.edgeLabelsMovable
  }
  setEdgeLabelsMovable(value: boolean) {
    this.edgeLabelsMovable = value
  }

  cellsMovable: boolean = true
  isCellsMovable() {
    return this.cellsMovable
  }
  setCellsMovable(value: boolean) {
    this.cellsMovable = value
  }

  cellsResizable: boolean = true
  isCellsResizable() {
    return this.cellsResizable
  }
  setCellsResizable(value: boolean) {
    this.cellsResizable = value
  }

  cellsRotatable: boolean = false
  isCellsRotatable() {
    return this.cellsRotatable
  }
  setCellsRotatable(value: boolean) {
    this.cellsRotatable = value
  }

  cellsBendable: boolean = true
  isCellsBendable() {
    return this.cellsBendable
  }
  setCellsBendable(value: boolean) {
    this.cellsBendable = value
  }

  cellsEditable: boolean = true
  isCellsEditable() {
    return this.cellsEditable
  }
  setCellsEditable(value: boolean) {
    this.cellsEditable = value
  }

  cellsDisconnectable: boolean = true
  isCellsDisconnectable() {
    return this.cellsDisconnectable
  }
  setCellsDisconnectable(value: boolean) {
    this.cellsDisconnectable = value
  }

  foldingEnabled: boolean = true
  isFoldable() {
    return this.foldingEnabled
  }
  enableFolding() {
    this.foldingEnabled = true
  }
  disableFolding() {
    this.foldingEnabled = false
  }

  collapsedImage: Image = images.collapsed
  getCollapsedImage() {
    return this.collapsedImage
  }
  setCollapsedImage(image: Image) {
    this.collapsedImage = image
  }

  expandedImage: Image = images.expanded
  getExpandedImage() {
    return this.expandedImage
  }
  setExpandedImage(image: Image) {
    this.expandedImage = image
  }

  htmlLabels: boolean = false
  isHtmlLabels() {
    return this.htmlLabels
  }
  setHtmlLabels(value: boolean) {
    this.htmlLabels = value
  }

  labelsVisible: boolean = true

  border: number = 0
  getBorder() {
    return this.border
  }
  setBorder(value: number) {
    this.border = value
  }

  autoResizeContainer: boolean = false
  shouldResizeContainer() {
    return this.autoResizeContainer
  }
  enableAutoResizeContainer() {
    this.autoResizeContainer = true
  }
  disableAutoResizeContainer() {
    this.autoResizeContainer = false
  }

  escapeEnabled: boolean = true
  isEscapeEnabled() {
    return this.escapeEnabled
  }
  enableEscape() {
    this.escapeEnabled = true
  }
  disableEscape() {
    this.escapeEnabled = false
  }

  invokesStopCellEditing: boolean = true
  isInvokesStopCellEditing() {
    return this.invokesStopCellEditing
  }
  setInvokesStopCellEditing(value: boolean) {
    this.invokesStopCellEditing = value
  }

  stopEditingOnPressEnter: boolean = false
  shouldStopEditingOnEnter() {
    return this.stopEditingOnPressEnter
  }
  setEnterStopsCellEditing(value: boolean) {
    this.stopEditingOnPressEnter = value
  }

  exportEnabled: boolean = true
  importEnabled: boolean = true

  portsEnabled: boolean = true
  isPortsEnabled() {
    return this.portsEnabled
  }
  setPortsEnabled(value: boolean) {
    this.portsEnabled = value
  }

  gridEnabled: boolean = false
  isGridEnabled() {
    return this.gridEnabled
  }
  enableGrid() {
    this.gridEnabled = true
  }
  disableGrid() {
    this.gridEnabled = false
  }
  toggleGrid() {
    this.gridEnabled = !this.gridEnabled
  }

  gridSize: number
  getGridSize() {
    return this.gridSize
  }
  setGridSize(size: number) {
    this.gridSize = size
  }

  tolerance: number = 4
  getTolerance() {
    return this.tolerance
  }
  setTolerance(value: number) {
    this.tolerance = value
  }

  swimlaneNesting: boolean = true
  isSwimlaneNesting() {
    return this.swimlaneNesting
  }
  setSwimlaneNesting(value: boolean) {
    this.swimlaneNesting = value
  }

  swimlaneSelectionEnabled: boolean = true
  isSwimlaneSelectionEnabled() {
    return this.swimlaneSelectionEnabled
  }
  setSwimlaneSelectionEnabled(value: boolean) {
    this.swimlaneSelectionEnabled = value
  }

  multigraph: boolean = true
  isMultigraph() {
    return this.multigraph
  }
  enableMultigraph() {
    this.multigraph = true
  }
  disableMultigraph() {
    this.multigraph = true
  }

  allowLoops: boolean = false
  isAllowLoops() {
    return this.allowLoops
  }
  enableLoops() {
    this.allowLoops = true
  }
  disableLoops() {
    this.allowLoops = true
  }

  allowDanglingEdges: boolean = true
  isDanglingEdgesEnabled() {
    return this.allowDanglingEdges
  }
  enableDanglingEdges() {
    this.allowDanglingEdges = true
  }
  disableDanglingEdges() {
    this.allowDanglingEdges = false
  }

  edgesConnectable: boolean = false
  setEdgesConnectable(value: boolean) {
    this.edgesConnectable = value
  }
  isEdgesConnectable() {
    return this.edgesConnectable
  }

  invalidEdgesClonable: boolean = false
  enableCloneInvalidEdges() {
    this.invalidEdgesClonable = true
  }
  disableCloneInvalidEdges() {
    this.invalidEdgesClonable = false
  }
  isInvalidEdgesClonable() {
    return this.invalidEdgesClonable
  }

  disconnectOnMove: boolean = true
  isDisconnectOnMove() {
    return this.disconnectOnMove
  }
  setDisconnectOnMove(value: boolean) {
    this.disconnectOnMove = value
  }

  connectOnDrop: boolean = false
  isConnectOnDrop() {
    return this.connectOnDrop
  }
  setConnectOnDrop(value: boolean) {
    this.connectOnDrop = value
  }

  dropEnabled: boolean = false
  isDropEnabled() {
    return this.dropEnabled
  }
  setDropEnabled(value: boolean) {
    this.dropEnabled = value
  }

  autoUpdateCursor: boolean = true
  isAutoUpdateCursor() {
    return this.autoUpdateCursor
  }
  setAutoUpdateCursor(value: boolean) {
    this.autoUpdateCursor = value
  }

  allowRemoveCellsFromParent: boolean
  isRemoveCellsFromParentAllowed() {
    return this.allowRemoveCellsFromParent
  }
  setRemoveCellsFromParentAllowed(allowed: boolean) {
    this.allowRemoveCellsFromParent = allowed
  }

  autoRemoveEmptyParent: boolean
  isAutoRemoveEmptyParent() {
    return this.autoRemoveEmptyParent
  }
  setAutoRemoveEmptyParent(value: boolean) {
    this.autoRemoveEmptyParent = value
  }

  scrollOnMove: boolean
  isScrollOnMove() {
    return this.scrollOnMove
  }
  setScrollOnMove(value: boolean) {
    this.scrollOnMove = value
  }

  splitEnabled: boolean = true
  isSplitEnabled() {
    return this.splitEnabled
  }
  setSplitEnabled(value: boolean) {
    this.splitEnabled = value
  }

  autoSizeOnAdded: boolean = false

  autoSizeOnEdited: boolean = false
  isAutoSizeCells() {
    return this.autoSizeOnEdited
  }
  setAutoSizeCells(value: boolean) {
    this.autoSizeOnEdited = value
  }

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

  constrainChildren: boolean = true
  isConstrainChildren() {
    return this.constrainChildren
  }
  setConstrainChildren(value: boolean) {
    this.constrainChildren = value
  }

  constrainRelativeChildren: boolean = false
  isConstrainRelativeChildren() {
    return this.constrainRelativeChildren
  }
  setConstrainRelativeChildren(value: boolean) {
    this.constrainRelativeChildren = value
  }

  allowNegativeCoordinates = true
  isAllowNegativeCoordinates() {
    return this.allowNegativeCoordinates
  }
  setAllowNegativeCoordinates(value: boolean) {
    this.allowNegativeCoordinates = value
  }

  defaultOverlap: number = 0.5
  maxCellCountForHandle: number

  // #endregion

  constructor(container: HTMLElement, options: Graph.Options = {}) {
    super()
    this.options = getOptions(options)
    this.container = container
    this.model = options.model || this.createModel()
    this.view = this.createView()
    this.renderer = this.createRenderer()
    this.selection = this.createSelection()

    this.cellEditor = new CellEditor(this)
    this.changeManager = new ChangeManager(this)
    this.eventloop = new EventLoop(this)
    this.cellManager = new CellManager(this)
    this.selectionManager = new SelectionManager(this)
    this.validator = new ValidationManager(this)
    this.viewport = new ViewportManager(this)

    // The order of the following initializations should not be modified.
    this.tooltipHandler = this.createTooltipHandler()
    this.cursorHandler = this.createCursorHandler()
    this.selectionHandler = this.createSelectionHandler()
    this.connectionHandler = this.createConnectionHandler()
    this.guideHandler = this.createGuideHandler()
    this.movingHandler = this.createMovingHandler()
    this.panningHandler = this.createPanningHandler()
    this.panningHandler.disablePanning()
    this.contextMenuHandler = this.createContextMenuHandler()
    this.rubberbandHandler = this.createRubberbandHandler()
    this.keyboardHandler = this.createKeyboardHandler()

    applyOptions(this)

    if (container != null) {
      this.init(container)
    }

    this.view.revalidate()
  }

  // #region :::::::::::: init

  protected init(container: HTMLElement) {
    this.view.init()
    this.sizeDidChange()

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

  @hook()
  createModel() {
    return new Model()
  }

  @hook()
  createView() {
    return new View(this)
  }

  @hook()
  createRenderer() {
    return new Renderer()
  }

  @hook()
  createSelection() {
    return new Selection(this)
  }

  @hook()
  createKeyboardHandler() {
    return new KeyboardHandler(this)
  }

  @hook()
  createTooltipHandler() {
    return new TooltipHandler(this)
  }

  @hook()
  createCursorHandler() {
    return new CursorHandler(this)
  }

  @hook()
  createGuideHandler() {
    return new GuideHandler(this)
  }

  @hook()
  createConnectionHandler() {
    return new ConnectionHandler(this)
  }

  @hook()
  createSelectionHandler() {
    return new SelectionHandler(this)
  }

  @hook()
  createMovingHandler() {
    return new MovingHandler(this)
  }

  @hook()
  createPanningHandler() {
    return new PanningHandler(this)
  }

  @hook()
  createContextMenuHandler() {
    return new ContextMenuHandler(this)
  }

  @hook()
  createRubberbandHandler() {
    return new RubberbandHandler(this)
  }

  createCellHandler(state: State | null) {
    if (state != null) {
      if (this.model.isEdge(state.cell)) {
        const sourceState = state.getVisibleTerminalState(true)
        const targetState = state.getVisibleTerminalState(false)
        const geo = this.getCellGeometry(state.cell)

        const edgeFn = this.view.getEdgeFunction(
          state, geo != null ? geo.points : null, sourceState!, targetState!,
        )
        return this.createEdgeHandler(state, edgeFn)
      }

      return this.createNodeHandler(state)
    }

    return null
  }

  @hook()
  createNodeHandler(state: State) {
    return new NodeHandler(this, state)
  }

  @hook()
  createEdgeHandler(state: State, edgeFn: RoutingFunction | null) {
    let result = null

    if (
      edgeFn === routers.loop ||
      edgeFn === routers.elbow ||
      edgeFn === routers.sideToSide ||
      edgeFn === routers.topToBottom
    ) {
      result = this.createElbowEdgeHandler(state)
    } else if (
      edgeFn === routers.segmentConnector ||
      edgeFn === routers.orthConnector
    ) {
      result = this.createEdgeSegmentHandler(state)
    } else {
      return (
        util.call(this.options.createEdgeHandler, this, this, state) ||
        new EdgeHandler(this, state)
      )
    }

    return result
  }

  @hook()
  createEdgeSegmentHandler(state: State) {
    return new EdgeSegmentHandler(this, state)
  }

  @hook()
  createElbowEdgeHandler(state: State) {
    return new EdgeElbowHandler(this, state)
  }

  // #endregion

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
      options.source,
      options.target,
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

  duplicateCells(
    cells: Cell[] = this.getSelectedCells(),
    append: boolean = true,
  ) {
    return this.cellManager.duplicateCells(cells, append)
  }

  turnCells(cells: Cell[] = this.getSelectedCells()) {
    return this.cellManager.turnCells(cells)
  }

  deleteCells(
    cells: Cell[] = this.getDeletableCells(this.getSelectedCells()),
    includeEdges: boolean = true,
    selectParentAfterDelete: boolean = true,
  ) {
    return this.cellManager.deleteCells(
      cells, includeEdges, selectParentAfterDelete,
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
    return this.maxGraphBounds
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
  setCellStyle(style: Style, cells: Cell[] = this.getSelectedCells()) {
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

  updateStyle(style: Style, cell?: Cell): void
  updateStyle(style: Style, cells?: Cell[]): void
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
    key: string | Style,
    value?: (string | number | boolean | null) | Cell | Cell[],
    cells?: Cell | Cell[],
  ) {
    const style: Style = typeof key === 'string' ? { [key]: value } : key
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
  toggleCellsStyleFlag(
    key: string,
    flag: number,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.setCellsStyleFlag(key, flag, null, cells)
  }

  /**
   * Sets or toggles the given bit for the given key in the styles of the
   * specified cells.
   */
  setCellsStyleFlag(
    key: string,
    flag: number,
    value: boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.cellManager.setCellsStyleFlag(key, flag, value, cells)
  }

  toggleCellsLocked(cells: Cell[] = this.getSelectedCells()) {
    this.cellManager.toggleCellsLocked(cells)
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
    const group = new Cell({ connectable: false })
    group.asNode(true)
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
    group: Cell | null = null,
    border: number = 0,
    cells: Cell[] = CellPath.sortCells(this.getSelectedCells(), true),
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

  @hook()
  getEditingContent(cell: Cell, e?: Event) {
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
    cells: Cell[] = CellPath.sortCells(this.getSelectedCells(), true),
  ) {
    return this.cellManager.orderCells(toBack, cells)
  }

  // #endregion

  // #region :::::::::::: Drilldown

  @hook()
  isValidRoot(cell: Cell | null) {
    return (cell != null)
  }

  @hook()
  isPort(cell: Cell) {
    return false
  }

  @hook()
  getTerminalForPort(cell: Cell, isSource: boolean) {
    return this.model.getParent(cell)
  }

  @hook()
  getChildOffset(cell: Cell): Point | null {
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

  @hook()
  getTranslateForCurrentRoot(currentRoot: Cell | null): Point | null {
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

  /**
   * Specifies the default parent to be used to insert new cells.
   */
  defaultParent: Cell | null

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
    return this.getChildren(parent, true, false)
  }

  /**
   * Returns the visible child edges of the given parent.
   */
  getChildEdges(parent: Cell) {
    return this.getChildren(parent, false, true)
  }

  /**
   * Returns the visible child nodes or edges of the given parent.
   */
  getChildren(
    parent: Cell = this.getDefaultParent(),
    includeNodes: boolean = false,
    includeEdges: boolean = false,
  ) {
    const cells = this.model.getChildren(parent, includeNodes, includeEdges)
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
    return this.cellManager.getCellsInRegion(x, y, w, h, parent, result)
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

  hasSelectedCell() {
    return this.selection.cells.length > 0
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
  selectCellsInRegion(
    rect: Rectangle | Rectangle.RectangleLike,
    e: MouseEvent,
  ) {
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
  selectNodes(parent: Cell = this.getDefaultParent()!) {
    this.selectionManager.selectCells(true, false, parent)
  }

  /**
   * Select all edges inside the given parent or the default parent.
   */
  selectEdges(parent: Cell = this.getDefaultParent()!) {
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
  fireMouseEvent(eventName: string, e: MouseEventEx, sender: any = this) {
    this.eventloop.fireMouseEvent(eventName, e, sender)
  }

  fireGestureEvent(e: MouseEvent, cell?: Cell) {
    this.eventloop.fireGestureEvent(e, cell)
  }

  @hook()
  isCloneEvent(e: MouseEvent) {
    return DomEvent.isControlDown(e)
  }

  @hook()
  isToggleEvent(e: MouseEvent) {
    return detector.IS_MAC ? DomEvent.isMetaDown(e) : DomEvent.isControlDown(e)
  }

  @hook()
  isConstrainedEvent(e: MouseEvent) {
    return DomEvent.isShiftDown(e)
  }

  @hook()
  isGridEnabledForEvent(e: MouseEvent) {
    return e != null && !DomEvent.isAltDown(e)
  }

  @hook()
  isConnectionIgnored(e: MouseEvent) {
    return false
  }

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
    this.sizeDidChange()
    this.trigger(Graph.events.refresh)
  }

  sizeDidChange() {
    this.viewport.sizeDidChange()
  }

  updatePageBreaks(visible: boolean, width: number, height: number) {
    this.viewport.updatePageBreaks(visible, width, height)
  }

  getPreferredPageSize(
    bounds: Rectangle,
    width: number,
    height: number,
  ): Size {
    return this.viewport.getPreferredPageSize(bounds, width, height)
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

  pan(x: number, y: number, relative: boolean = false) {
    const tx = relative ? this.panDx + x : x
    const ty = relative ? this.panDy + y : y
    this.viewport.pan(tx, ty)
  }

  panTo(x: number, y: number) {
    this.pan(x, y, false)
  }

  panBy(x: number, y: number) {
    this.pan(x, y, true)
  }

  zoomIn() {
    this.zoom(this.scaleFactor)
  }

  zoomOut() {
    this.zoom(1 / this.scaleFactor)
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

  // #endregion

  // #region :::::::::::: Graph Appearance

  @hook()
  isCellVisible(cell: Cell | null) {
    return cell != null ? this.model.isVisible(cell) : false
  }

  @hook()
  isCellLocked(cell: Cell | null) {
    if (this.isCellsLocked()) {
      return true
    }

    const style = this.getStyle(cell)
    if (style.locked) {
      return true
    }

    const geometry = this.model.getGeometry(cell)
    return (
      geometry != null &&
      this.model.isNode(cell) &&
      geometry.relative
    )
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

  @hook()
  isCellSelectable(cell: Cell) {
    return this.isCellsSelectable()
  }

  getDeletableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellDeletable(cell))
  }

  @hook()
  isCellDeletable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsDeletable() && style.deletable !== false
  }

  @hook()
  isCellRotatable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsRotatable() &&
      !this.isCellLocked(cell) &&
      style.rotatable !== false
    )
  }

  getMovableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellMovable(cell))
  }

  @hook()
  isLabelMovable(cell: Cell | null) {
    return (
      !this.isCellLocked(cell) &&
      (
        (this.model.isEdge(cell) && this.edgeLabelsMovable) ||
        (this.model.isNode(cell) && this.nodeLabelsMovable)
      )
    )
  }

  @hook()
  isCellMovable(cell: Cell | null) {
    const style = this.getStyle(cell)
    return (
      this.isCellsMovable() &&
      !this.isCellLocked(cell) &&
      style.movable !== false
    )
  }

  @hook()
  isCellResizable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsResizable() &&
      !this.isCellLocked(cell) &&
      style.resizable !== false
    )
  }

  @hook()
  isCellBendable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsBendable() &&
      !this.isCellLocked(cell) &&
      style.bendable !== false
    )
  }

  @hook()
  isCellEditable(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isCellsEditable() &&
      !this.isCellLocked(cell) &&
      style.editable !== false
  }

  @hook()
  isCellDisconnectable(cell: Cell, terminal: Cell, isSource: boolean) {
    return this.isCellsDisconnectable() && !this.isCellLocked(cell)
  }

  @hook()
  isCellConnectable(cell: Cell | null) {
    const style = this.getStyle(cell)
    return style.connectable !== false
  }

  @hook()
  isCellCollapsed(cell: Cell) {
    return this.model.isCollapsed(cell)
  }

  @hook()
  isCellFoldable(cell: Cell, nextCollapseState: boolean) {
    const style = this.getStyle(cell)
    return (this.model.getChildCount(cell) > 0 && style.foldable !== false)
  }

  /**
   * Returns the cells which are movable in the given array of cells.
   */
  getFoldableCells(cells: Cell[], collapse: boolean) {
    return this.model.filterCells(
      cells, cell => this.isCellFoldable(cell, collapse),
    )
  }

  getFoldingImage(state: State) {
    if (
      state != null &&
      this.foldingEnabled &&
      !this.getModel().isEdge(state.cell)
    ) {
      const collapsed = this.isCellCollapsed(state.cell)
      if (this.isCellFoldable(state.cell, !collapsed)) {
        return collapsed ? this.collapsedImage : this.expandedImage
      }
    }

    return null
  }

  @hook()
  isTerminalPointMovable(cell: Cell, isSource: boolean) {
    return true
  }

  @hook()
  isHtmlLabel(cell: Cell) {
    const style = this.getStyle(cell)
    if (style != null && style.htmlLabel != null) {
      return style.htmlLabel
    }
    return this.isHtmlLabels()
  }

  @hook()
  isWrapping(cell: Cell) {
    const style = this.getStyle(cell)
    return style != null ? style.whiteSpace === 'wrap' : false
  }

  @hook()
  isLabelClipped(cell: Cell) {
    const style = this.getStyle(cell)
    return (style != null) ? style.overflow === 'hidden' : false
  }

  @hook()
  isSwimlane(cell: Cell | null) {
    if (cell != null) {
      if (this.model.getParent(cell) !== this.model.getRoot()) {
        const style = this.getStyle(cell)
        if (style != null && !this.model.isEdge(cell)) {
          return (style.shape === ShapeNames.swimlane)
        }
      }
    }
    return false
  }

  @hook()
  convertDataToString(cell: Cell): string {
    const data = this.model.getData(cell)
    if (data != null) {
      if (typeof (data.toString) === 'function') {
        return data.toString()
      }
    }

    return ''
  }

  @hook()
  getHtml(cell: Cell): HTMLElement | string | null {
    let result = ''
    if (cell != null) {
      result = this.convertDataToString(cell)
    }
    return result
  }

  @hook()
  getLabel(cell: Cell): HTMLElement | string | null {
    let result = ''

    if (this.labelsVisible && cell != null) {
      const style = this.getStyle(cell)
      if (!style.noLabel) {
        result = this.convertDataToString(cell)
      }
    }

    return result
  }

  @hook()
  putLabel(cell: Cell, label: string) {
    const data = cell.getData()
    if (typeof data === 'object') {
      throw new Error('Method not implemented.')
    }

    return label
  }

  @hook()
  getTooltip(cell: Cell) {
    return this.convertDataToString(cell)
  }

  @hook()
  getCellLink(cell: Cell) {
    return null
  }

  @hook()
  getCellCursor(cell: Cell | null) {
    return null
  }

  @hook()
  getStartSize(swimlane: Cell | null) {
    const result = new Rectangle()
    const style = this.getStyle(swimlane)
    if (style != null) {
      const size = style.startSize || 40
      if (style.horizontal !== false) {
        result.height = size
      } else {
        result.width = size
      }
    }

    return result
  }

  @hook()
  getCellClassName(cell: Cell) {
    const style = this.getStyle(cell)
    return style.className || null
  }

  @hook()
  getLabelClassName(cell: Cell) {
    const style = this.getStyle(cell)
    return style.labelClassName || null
  }

  // #endregion

  // #region :::::::::::: Graph Behaviour

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
   * Returns the cells which may be exported in the given array of cells.
   */
  getExportableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.canExportCell(cell))
  }

  canExportCell(cell: Cell) {
    return this.exportEnabled
  }

  getImportableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.canImportCell(cell))
  }

  /**
   * Returns true if the given cell may be imported from the clipboard.
   *
   * Default is `true`.
   */
  canImportCell(cell: Cell) {
    return this.importEnabled
  }

  @hook()
  isValidSource(cell: Cell | null) {
    return (
      (cell == null && this.allowDanglingEdges) ||
      (
        cell != null && (
          !this.model.isEdge(cell) || this.edgesConnectable) &&
        this.isCellConnectable(cell)
      )
    )
  }

  @hook()
  isValidTarget(cell: Cell | null) {
    return this.isValidSource(cell)
  }

  @hook()
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

  @hook()
  isAutoSizeCell(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isAutoSizeCells() || style.autosize === true
  }

  @hook()
  isExtendParent(cell: Cell) {
    return !this.model.isEdge(cell) && this.isExtendParents()
  }

  @hook()
  isConstrainChild(cell: Cell) {
    return this.isConstrainChildren() &&
      !this.model.isEdge(this.model.getParent(cell)!)
  }

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

  @hook()
  isValidDropTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    return target != null && ((this.isSplitEnabled() &&
      this.isSplitTarget(target, cells, e)) || (!this.model.isEdge(target) &&
        (this.isSwimlane(target) || (this.model.getChildCount(target) > 0 &&
          !this.isCellCollapsed(target)))))
  }

  @hook()
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
    p.x -= this.panDx
    p.y -= this.panDy
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

  // #region :::::::::::: Keyboard

  enableKeyboard() {
    this.keyboardHandler.enable()
  }

  disableKeyboard() {
    this.keyboardHandler.disable()
  }

  bindKey(
    keys: string | string[],
    handler: KeyboardHandler.Handler,
    action?: KeyboardHandler.Action,
  ) {
    this.keyboardHandler.bind(keys, handler, action)
  }

  unbindKey(
    keys: string | string[],
    action?: KeyboardHandler.Action,
  ) {
    this.keyboardHandler.unbind(keys, action)
  }

  onKeyPress(keys: string | string[], handler: KeyboardHandler.Handler) {
    this.bindKey(keys, handler, 'keypress')
  }

  onKeyDown(keys: string | string[], handler: KeyboardHandler.Handler) {
    this.bindKey(keys, handler, 'keydown')
  }

  onKeyUp(keys: string | string[], handler: KeyboardHandler.Handler) {
    this.bindKey(keys, handler, 'keyup')
  }

  // #endregion

  // #region :::::::::::: Dispose

  protected disposeManagers() {
    this.changeManager.dispose()
    this.eventloop.dispose()
    this.selection.dispose()
    this.selectionManager.dispose()
    this.validator.dispose()
    this.viewport.dispose()
    this.cellManager.dispose()
  }

  protected disposeHandlers() {
    this.tooltipHandler.dispose()
    this.panningHandler.dispose()
    this.contextMenuHandler.dispose()
    this.selectionHandler.dispose()
    this.movingHandler.dispose()
    this.connectionHandler.dispose()
  }

  @Disposable.aop()
  dispose() {
    this.disposeManagers()
    this.disposeHandlers()

    if (this.cellEditor != null) {
      this.cellEditor.dispose()
    }

    if (this.view != null) {
      this.view.dispose()
    }

    (this as any).container = null
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
        this.getNativeValue = raw.bind(this, ...args)
        const ret = util.call(hook, this, ...args)
        delete this.getNativeValue

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
  export interface Options extends Partial<IHooks>, GraphOptions {
    model?: Model,
  }

  export interface CreateNodeOptions {
    /**
     * Specifies the x-coordinate of the node. For relative geometries, this
     * defines the percentage x-coordinate relative the parent width, which
     * value should be within `0-1`. For absolute geometries, this defines the
     * absolute x-coordinate in the graph.
     */
    x?: number,
    /**
     * Specifies the y-coordinate of the node. For relative geometries, this
     * defines the percentage y-coordinate relative the parent height, which
     * value should be within `0-1`. For absolute geometries, this defines the
     * absolute y-coordinate in the graph.
     */
    y?: number,
    width?: number,
    height?: number,
    /**
     * Specifies if the coordinates in the geometry are to be interpreted
     * as relative coordinates. If this is `true`, then the coordinates are
     * relative to the origin of the parent cell.
     */
    relative?: boolean,
    /**
     * For relative geometries, this defines the absolute offset from the
     * point defined by the relative coordinates. For absolute geometries,
     * this defines the offset for the label.
     */
    offset?: Point | Point.PointLike,

    id?: string,
    data?: any,
    style?: Style,
    visible?: boolean,
    collapsed?: boolean,
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
    /**
     * The source `Point` of the edge. This is used if the corresponding
     * edge does not have a source node. Otherwise it is ignored.
     */
    sourcePoint?: Point | Point.PointLike,
    /**
     * The target `Point` of the edge. This is used if the corresponding
     * edge does not have a target node. Otherwise it is ignored.
     */
    targetPoint?: Point | Point.PointLike,
    /**
     * Specifies the control points along the edge. These points are the
     * intermediate points on the edge, for the endpoints use `targetPoint`
     * and `sourcePoint` or set the terminals of the edge to a non-null value.
     */
    points?: (Point | Point.PointLike)[],
    offset?: Point | Point.PointLike,

    id?: string | null,
    data?: any,
    style?: Style,
    visible?: boolean,
    overlays?: Overlay[],
  }

  export interface AddEdgeOptions extends CreateEdgeOptions {
    parent?: Cell,
    index?: number,
    source?: Cell,
    target?: Cell,
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

    pan: 'pan',
    gesture: 'gesture',
    fireMouseEvent: 'fireMouseEvent',
    selectionChanged: 'selectionChanged',
  }
}
