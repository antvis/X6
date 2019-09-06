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
  ConnectionManager,
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
  public readonly connectionManager: ConnectionManager
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
   * Specifies if ports are enabled.
   *
   * Default is `true`.
   */
  portsEnabled: boolean = true

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
  doubleTapEnabled = true

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
   * Tolerance for a move to be handled as a single click.
   *
   * Default is `4` pixels.
   */
  tolerance = 4

  /**
   * Value returned by <getOverlap> if <isAllowOverlapParent> returns
   * true for the given cell. <getOverlap> is used in <constrainChild> if
   * <isConstrainChild> returns true. The value specifies the
   * portion of the child which is allowed to overlap the parent.
   */
  defaultOverlap = 0.5

  /**
   * Specifies the default parent to be used to insert new cells.
   */
  defaultParent: Cell | null

  /**
   * Specifies the alternate edge style to be used if the main control point
   * on an edge is being doubleclicked. Default is null.
   */
  alternateEdgeStyle: CellStyle

  backgroundImage: Image

  /**
   * Specifies if the background page should be visible. Default is false.
   */
  pageVisible = false

  /**
   * Specifies if a dashed line should be drawn between multiple pages. Default
   * is false. If you change this value while a graph is being displayed then you
   * should call <sizeDidChange> to force an update of the display.
   */
  pageBreaksVisible = false

  /**
   * Specifies the color for page breaks. Default is 'gray'.
   */
  pageBreakColor = 'gray'

  /**
   * Specifies the page breaks should be dashed. Default is true.
   */
  pageBreakDashed = true

  /**
   * Specifies the minimum distance for page breaks to be visible. Default is
   * 20 (in pixels).
   */
  minPageBreakDist = 20

  /**
   * Specifies if the graph size should be rounded to the next page number in
   * <sizeDidChange>. This is only used if the graph container has scrollbars.
   * Default is false.
   */
  preferPageSize = false

  /**
   * Specifies the page format for the background page. Default is
   * <constants.PAGE_FORMAT_A4_PORTRAIT>. This is used as the default in
   * <mxPrintPreview> and for painting the background page if <pageVisible> is
   * true and the pagebreaks if <pageBreaksVisible> is true.
   */
  pageFormat: Rectangle = PageSize.A4_PORTRAIT

  /**
   * Specifies the scale of the background page. Default is 1.5.
   * Not yet implemented.
   */
  pageScale = 1.5

  /**
   * Specifies if <mxKeyHandler> should invoke <escape> when the escape key
   * is pressed. Default is true.
   */
  escapeEnabled = true

  /**
   * Specifies if scrollbars should be used for panning in <panGraph> if
   * any scrollbars are available. If scrollbars are enabled in CSS, but no
   * scrollbars appear because the graph is smaller than the container size,
   * then no panning occurs if this is true. Default is true.
   */
  useScrollbarsForPanning = true

  /**
   * Specifies the return value for <canExportCell>. Default is true.
   */
  exportEnabled = true

  /**
   * Specifies the return value for <canImportCell>. Default is true.
   */
  importEnabled = true

  /**
   * Specifies the return value for <isCellLocked>. Default is false.
   */
  cellsLocked = false

  /**
   * Specifies the return value for <isCellCloneable>. Default is true.
   */
  cellsCloneable = true

  /**
   * Specifies if folding (collapse and expand via an image icon in the graph
   * should be enabled). Default is true.
   */
  foldingEnabled = true

  /**
   * Specifies the return value for <isCellEditable>. Default is true.
   */
  cellsEditable = true

  /**
   * Specifies the return value for <isCellDeletable>. Default is true.
   */
  cellsDeletable = true

  /**
   * Specifies the return value for <isCellMovable>. Default is true.
   */
  cellsMovable = true

  /**
   * Specifies if the label of edge movable.
   *
   * Default is `true`.
   */
  edgeLabelsMovable: boolean = true

  /**
   * Specifies if the label of node movable.
   *
   * Default is `false`.
   */
  nodeLabelsMovable: boolean = false

  /**
   * Specifies the return value for <isDropEnabled>. Default is false.
   */
  dropEnabled = false

  /**
   * Specifies if dropping onto edges should be enabled. This is ignored if
   * <dropEnabled> is false. If enabled, it will call <splitEdge> to carry
   * out the drop operation. Default is true.
   */
  splitEnabled = true

  /**
   * Specifies the return value for <isCellResizable>. Default is true.
   */
  cellsResizable = true

  /**
   * Specifies the return value for <isCellsBendable>. Default is true.
   */
  cellsBendable = true

  /**
   * Specifies the return value for <isCellSelectable>. Default is true.
   */
  cellsSelectable = true

  /**
   * Specifies if cells is disconnectable.
   *
   * Default is `true`.
   */
  cellsDisconnectable = true

  /**
   * Specifies if the graph should automatically update the cell size after an
   * edit. Default is `false`.
   */
  autoSizeCells: boolean = false

  /**
   * Specifies if autoSize style should be applied when cells are added.
   *
   * Default is `false`.
   */
  autoSizeCellsOnAdd: boolean = false

  /**
   * Specifies if the graph should automatically scroll if the mouse goes near
   * the container edge while dragging. This is only taken into account if the
   * container has scrollbars. Default is `true`.
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
  timerAutoScroll = false

  /**
   * Specifies if panning via <panGraph> should be allowed to implement autoscroll
   * if no scrollbars are available in <scrollPointToVisible>. To enable panning
   * inside the container, near the edge, set <mxPanningManager.border> to a
   * positive value. Default is false.
   */
  allowAutoPanning = false

  /**
   * Specifies if the size of the graph should be automatically extended if the
   * mouse goes near the container edge while dragging. This is only taken into
   * account if the container has scrollbars. Default is true. See <autoScroll>.
   */
  autoExtend = true

  /**
   * <Rect> that specifies the area in which all cells in the diagram
   * should be placed. Uses in <getMaximumGraphBounds>. Use a width or height of
   * 0 if you only want to give a upper, left corner.
   */
  maximumGraphBounds: Rectangle | null

  /**
   * <Rect> that specifies the minimum size of the graph. This is ignored
   * if the graph container has no scrollbars. Default is null.
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
   * Specifies if the container should be resized to the graph size when
   * the graph size has changed. Default is false.
   */
  resizeContainer: boolean = false

  /**
   * Border to be added to the bottom and right side when the container is
   * being resized after the graph has been changed. Default is 0.
   */
  border = 0

  /**
   * Specifies if edges should appear in the foreground regardless of their order
   * in the model. If <keepEdgesInForeground> and <keepEdgesInBackground> are
   * both true then the normal order is applied. Default is false.
   */
  keepEdgesInForeground = false

  /**
   * Specifies if edges should appear in the background regardless of their order
   * in the model. If <keepEdgesInForeground> and <keepEdgesInBackground> are
   * both true then the normal order is applied. Default is false.
   */
  keepEdgesInBackground = false

  /**
   * Specifies if negative coordinates for nodes are allowed. Default is true.
   */
  allowNegativeCoordinates = true

  /**
   * Specifies if a child should be constrained inside the parent bounds after a
   * move or resize of the child. Default is true.
   */
  constrainChildren = true

  /**
   * Specifies if child cells with relative geometries should be constrained
   * inside the parent bounds, if <constrainChildren> is true, and/or the
   * <maximumGraphBounds>. Default is false.
   */
  constrainRelativeChildren = false

  /**
   * Specifies if a parent should contain the child bounds after a resize of
   * the child. Default is true. This has precedence over <constrainChildren>.
   */
  extendParents = true

  /**
   * Specifies if parents should be extended according to the <extendParents>
   * switch if cells are added. Default is true.
   */
  extendParentsOnAdd = true

  /**
   * Specifies if parents should be extended according to the <extendParents>
   * switch if cells are added. Default is false for backwards compatiblity.
   */
  extendParentsOnMove = false

  /**
   * Specifies the return value for <isRecursiveResize>. Default is
   * false for backwards compatiblity.
   */
  recursiveResize = false

  /**
   * Specifies if the cell size should be changed to the preferred size when
   * a cell is first collapsed. Default is true.
   */
  collapseToPreferredSize = true

  /**
   * Specifies the factor used for <zoomIn> and <zoomOut>. Default is 1.2
   * (120%).
   */
  zoomFactor = 1.2

  /**
   * Specifies if the viewport should automatically contain the selection cells
   * after a zoom operation. Default is false.
   */
  keepSelectionVisibleOnZoom = false

  /**
   * Specifies if the zoom operations should go into the center of the actual
   * diagram rather than going from top, left. Default is true.
   */
  centerZoom = true

  /**
   * Specifies if the scale and translate should be reset if
   * the root changes in the model.
   *
   * Default is `true`.
   */
  public resetViewOnRootChange: boolean = true

  /**
   * Specifies if edge control points should be reset after the resize of a
   * connected cell. Default is false.
   */
  resetEdgesOnResize = false

  /**
   * Specifies if edge control points should be reset after the move of a
   * connected cell. Default is false.
   */
  resetEdgesOnMove = false

  /**
   * Specifies if edge control points should be reset after the the edge has been
   * reconnected.
   *
   * Default is `true`.
   */
  resetEdgesOnConnect: boolean = true

  /**
   * Specifies if loops (aka self-references) are allowed. Default is false.
   */
  allowLoops = false

  /**
   * <EdgeStyle> to be used for loops. This is a fallback for loops if the
   * <constants.STYLE_LOOP> is undefined. Default is <EdgeStyle.Loop>.
   */
  defaultLoopStyle = EdgeStyle.loop

  /**
   * Specifies if multiple edges in the same direction between the same pair of
   * nodes are allowed.
   *
   * Default is `true`.
   */
  multigraph: boolean = true

  /**
   * Variable: connectableEdges
   *
   * Specifies if edges are connectable. Default is false. This overrides the
   * connectable field in edges.
   */
  connectableEdges = false

  /**
   * Specifies if edges with disconnected terminals are allowed in the graph.
   *
   * Default is `true`.
   */
  allowDanglingEdges: boolean = true

  /**
   * Specifies if edges that are cloned should be validated and only inserted
   * if they are valid. Default is true.
   */
  cloneInvalidEdges = false

  /**
   * Specifies if edges should be disconnected from their terminals when they
   * are moved. Default is true.
   */
  disconnectOnMove = true

  /**
   * Specifies if labels should be visible. This is used in <getLabel>. Default
   * is true.
   */
  labelsVisible = true

  /**
   * Specifies the return value for <isHtmlLabel>. Default is false.
   */
  htmlLabels = false

  /**
   * Specifies if swimlanes should be selectable via the content if the
   * mouse is released. Default is true.
   */
  swimlaneSelectionEnabled = true

  /**
   * Specifies if nesting of swimlanes is allowed. Default is true.
   */
  swimlaneNesting = true

  /**
   * The attribute used to find the color for the indicator if the indicator
   * color is set to 'swimlane'. Default is <constants.STYLE_FILLCOLOR>.
   */
  swimlaneIndicatorColorAttribute = 'fill'

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

  /**
   * Current horizontal panning value.
   */
  panDx: number = 0

  /**
   * Current vertical panning value.
   */
  panDy: number = 0

  collapsedImage: Image = images.collapsed
  expandedImage: Image = images.expanded
  warningImage: Image = images.warning

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
    this.connectionManager = new ConnectionManager(this)
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

  /**
   * Specifies if the grid is enabled.
   */
  gridEnabled: boolean

  enableGrid() {
    this.gridEnabled = true
  }

  disableGrid() {
    this.gridEnabled = false
  }

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

  batchUpdate(update: () => void) {
    this.model.batchUpdate(update)
  }

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
      return this.cellManager.addWarningOverlay(cell, warning, img, selectOnClick)
    }

    this.removeOverlays(cell)
    return null
  }

  // #endregion

  // #region :::::::::::: In-place Editing

  startEditing(e?: MouseEvent) {
    this.startEditingAtCell(null, e)
  }

  startEditingAtCell(cell?: Cell | null, e?: MouseEvent) {
    if (e == null || !DomEvent.isMultiTouchEvent(e)) {
      if (cell == null) {
        cell = this.getSelectedCell() // tslint:disable-line
        if (cell != null && !this.isCellEditable(cell)) {
          cell = null // tslint:disable-line
        }
      }

      if (cell != null) {
        this.trigger(Graph.events.startEditing, { cell, e })
        this.cellEditor.startEditing(cell, e)
        this.trigger(Graph.events.editingStarted, { cell, e })
      }
    }
  }

  /**
   * Returns the initial value for in-place editing.
   */
  getEditingValue(cell: Cell, e?: Event) {
    return this.convertDataToString(cell)
  }

  stopEditing(cancel: boolean = false) {
    this.cellEditor.stopEditing(cancel)
    this.trigger(Graph.events.editingStopped, { cancel })
  }

  labelChanged(cell: Cell, value: string, e?: Event) {
    this.model.batchUpdate(() => {
      const old = cell.data
      this.cellLabelChanged(cell, value, this.isAutoSizeCell(cell))
      this.trigger(Graph.events.labelChanged, { cell, value, old, e })
    })
    return cell
  }

  cellLabelChanged(cell: Cell, value: string, autoSize: boolean) {
    this.model.batchUpdate(() => {
      this.model.setData(cell, value)
      if (autoSize) {
        this.cellManager.cellSizeUpdated(cell, false)
      }
    })
  }

  // #endregion

  // #region :::::::::::: Cell Style

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
   * cell and returns the new value. If no cell is specified then
   * the current selected cell is used.
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

  /**
   * Sets the key to value in the styles of the given cells. This will modify
   * the existing cell styles in-place and override any existing assignment
   * for the given key. If no cells are specified, then the selection cells
   * are changed. If no value is specified, then the respective key is
   * removed from the styles.
   */
  setCellsStyle(
    key: string,
    value?: string | number | boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.cellManager.setCellsStyle(key, value, cells)
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

  toggleCells(
    show: boolean,
    cells: Cell[] = this.getSelectedCells(),
    includeEdges: boolean = true,
  ) {
    return this.cellManager.toggleCells(show, cells, includeEdges)
  }

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
    cells: Cell[] = util.sortCells(this.getSelectedCells(), true),
    toBack: boolean = false,
  ) {
    return this.cellManager.orderCells(cells, toBack)
  }

  // #endregion

  // #region :::::::::::: Cell Grouping

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
    cells: Cell[] = util.sortCells(this.getSelectedCells(), true),
  ) {
    return this.cellManager.groupCells(group, border, cells)
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
  ungroupCells(cells: Cell[] = this.getSelectedCells()) {
    return this.cellManager.ungroupCells(cells)
  }

  /**
   * Removes the specified cells from their parents and adds them to the
   * default parent. Returns the cells that were removed from their parents.
   */
  removeCellsFromParent(cells: Cell[] = this.getSelectedCells()) {
    return this.cellManager.removeCellsFromParent(cells)
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
   * Returns the bounding box for the given array of <Cells>. The bounding box for
   * each cell and its descendants is computed using <mxGraphView.getBoundingBox>.
   */
  getBoundingBox(cells: Cell[]) {
    let result: Rectangle | null = null

    if (cells == null || cells.length <= 0) {
      return result
    }

    cells.forEach((cell) => {
      if (this.model.isNode(cell) || this.model.isEdge(cell)) {
        const bbox = this.view.getBoundingBox(this.view.getState(cell), true)
        if (bbox != null) {
          if (result == null) {
            result = Rectangle.clone(bbox)
          } else {
            result.add(bbox)
          }
        }
      }
    })

    return result
  }

  // #endregion

  // #region :::::::::::: Cell Creation

  /**
   * Returns the clone for the given cell.
   *
   * @param cell `Cell` to be cloned.
   * @param allowInvalidEdges Optional boolean that specifies if invalid edges
   * should be cloned.  Default is `true`.
   * @param mapping Optional mapping for existing clones.
   * @param keepPosition Optional boolean indicating if the position of the
   * cells should be updated to reflect the lost parent cell.
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
    return this.cellManager.cloneCells(
      cells, allowInvalidEdges, mapping, keepPosition,
    )
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

  createNode(options: Graph.CreateNodeOptions = {}): Cell {
    return this.cellManager.createNode(options)
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

  createEdge(options: Graph.CreateEdgeOptions = {}): Cell {
    return this.cellManager.createEdge(options)
  }

  /**
   * Adds the cell to the parent and connects it to the given source and
   * target terminals.
   *
   * @param cell - `Cell` to be inserted into the given parent.
   * @param parent - `Cell` that represents the new parent. If no parent is
   * given then the default parent is used.
   * @param index - Optional index to insert the cells at. Default is to append.
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
   * @param index - Optional index to insert the cells at. Default is to append.
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

  // #endregion

  // #region :::::::::::: Cell Sizing

  /**
   * Resizes the specified cell to just fit around the its label
   * and/or children.
   *
   * @param cell `Cells` to be resized.
   * @param  recurse Optional boolean which specifies if all descendants
   * should be autosized. Default is `true`.
   */
  autoSizeCell(cell: Cell, recurse: boolean = true) {
    this.cellManager.autoSizeCell(cell, recurse)
  }

  updateCellSize(cell: Cell, ignoreChildren: boolean = false) {
    return this.cellManager.updateCellSize(cell, ignoreChildren)
  }

  /**
   * Sets the bounds of the given cell using <resizeCells>. Returns the
   * cell which was passed to the function.
   */
  resizeCell(cell: Cell, bounds: Rectangle, recurse?: boolean) {
    return this.resizeCells([cell], [bounds], recurse)[0]
  }

  /**
   * Sets the bounds of the given cells and fires a <DomEvent.RESIZE_CELLS>
   * event while the transaction is in progress. Returns the cells which
   * have been passed to the function.
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
   *
   * Parameters:
   *
   * cell - <Cell> that has been resized.
   * newGeo - <mxGeometry> that represents the new bounds.
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
   * Parameters:
   *
   * cell - <Cell> whose geometry should be scaled.
   * dx - Horizontal scaling factor.
   * dy - Vertical scaling factor.
   * recurse - Boolean indicating if the child cells should be scaled.
   */
  scaleCell(cell: Cell, dx: number, dy: number, recurse: boolean) {
    this.cellManager.scaleCell(cell, dx, dy, recurse)
  }

  /**
   * Resizes the parents recursively so that they contain the complete
   * area of the resized child cell.
   */
  extendParent(cell: Cell) {
    this.cellManager.extendParent(cell)
  }

  /**
   * Keeps the given cell inside the bounds returned by
   * <getCellContainmentArea> for its parent, according to the rules defined by
   * <getOverlap> and <isConstrainChild>. This modifies the cell's geometry
   * in-place and does not clone it.
   *
   * Parameters:
   *
   * cells - <Cell> which should be constrained.
   * sizeFirst - Specifies if the size should be changed first. Default is true.
   */
  constrainChild(cell: Cell, sizeFirst: boolean = true) {
    return this.cellManager.constrainChild(cell, sizeFirst)
  }

  /**
   * Constrains the children of the given cell.
   */
  constrainChildCells(cell: Cell) {
    cell.eachChild(child => this.constrainChild(child))
  }

  // #endregion

  // #region :::::::::::: Cell Moving

  importCells(
    cells: Cell[],
    dx: number,
    dy: number,
    target?: Cell,
    e?: MouseEvent,
    mapping?: WeakMap<Cell, Cell>,
  ) {
    return this.moveCells(cells, dx, dy, true, target, e, mapping)
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
   * Translates the geometry of the given cell and stores the new,
   * translated geometry in the model as an atomic change.
   */
  translateCell(cell: Cell, dx: number, dy: number) {
    this.cellManager.translateCell(cell, dx, dy)
  }

  /**
   * Returns the bounds inside which the diagram should be kept as an
   * <Rect>.
   */
  getMaximumGraphBounds() {
    return this.maximumGraphBounds
  }

  /**
   * Resets the control points of the edges that are connected to the given
   * cells if not both ends of the edge are in the given cells array.
   */
  resetEdges(edges: Cell[]) {
    this.cellManager.resetEdges(edges)
  }

  /**
   * Resets the control points of the given edge.
   */
  resetEdge(edge: Cell) {
    this.cellManager.resetEdge(edge)
  }

  // #endregion

  // #region :::::::::::: Cell Connecting

  /**
   * Returns the constraint used to connect to the outline of the given state.
   */
  getOutlineConstraint(point: Point, terminalState: State, me: any) {
    return this.connectionManager.getOutlineConstraint(point, terminalState, me)
  }

  getConstraints(terminal: Cell, isSource: boolean) {
    const ret = util.call(
      this.options.getConstraints, this, terminal, isSource,
    )

    if (ret != null) {
      return ret
    }

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

  getCellContainmentArea(cell: Cell) {
    return this.cellManager.getCellContainmentArea(cell)
  }

  /**
   * Returns an `ConnectionConstraint` that describes the given connection
   * point.
   */
  getConnectionConstraint(
    edgeState: State,
    terminalState?: State | null,
    isSource: boolean = false,
  ) {

    let point: Point | null = null

    // connection point specified in style
    const x = isSource ? edgeState.style.exitX : edgeState.style.entryX
    if (x != null) {
      const y = isSource ? edgeState.style.exitY : edgeState.style.entryY
      if (y != null) {
        point = new Point(x, y)
      }
    }

    let perimeter = false
    let dx = 0
    let dy = 0

    if (point != null) {
      perimeter = isSource
        ? edgeState.style.exitPerimeter !== false
        : edgeState.style.entryPerimeter !== false

      // Add entry/exit offset
      dx = (isSource ? edgeState.style.exitDx : edgeState.style.entryDx) as number
      dy = (isSource ? edgeState.style.exitDy : edgeState.style.entryDy) as number

      dx = isFinite(dx) ? dx : 0
      dy = isFinite(dy) ? dy : 0
    }

    return new Constraint({ point, perimeter, dx, dy })
  }

  setConnectionConstraint(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    constraint?: Constraint | null,
  ) {
    return this.cellManager.setConnectionConstraint(edge, terminal, isSource, constraint)
  }

  /**
   * Returns the nearest point in the list of absolute points
   * or the center of the opposite terminal.
   *
   * Parameters:
   *
   * node - <CellState> that represents the vertex.
   * constraint - <mxConnectionConstraint> that represents the connection point
   * constraint as returned by <getConnectionConstraint>.
   */
  getConnectionPoint(
    terminalState: State,
    constraint: Constraint,
    round: boolean = true,
  ) {
    return this.cellManager.getConnectionPoint(terminalState, constraint, round)
  }

  /**
   * Connects the specified end of the given edge to the given terminal
   * using <cellConnected> and fires <DomEvent.CONNECT_CELL> while the
   * transaction is in progress. Returns the updated edge.
   *
   * Parameters:
   *
   * edge - <Cell> whose terminal should be updated.
   * terminal - <Cell> that represents the new terminal to be used.
   * source - Boolean indicating if the new terminal is the source or target.
   * constraint - Optional <mxConnectionConstraint> to be used for this
   * connection.
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

  // #endregion

  // #region :::::::::::: Drilldown

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
  getTranslateForRoot(cell: Cell | null): Point | null {
    return null
  }

  /**
   * Returns true if the given cell is a "port", that is, when connecting to
   * it, the cell returned by getTerminalForPort should be used as the
   * terminal and the port should be referenced by the ID in either the
   * constants.STYLE_SOURCE_PORT or the or the
   * constants.STYLE_TARGET_PORT. Note that a port should not be movable.
   */
  isPort(cell: Cell) {
    const ret = util.call(this.options.isPort, this, cell)
    if (ret != null) {
      return ret
    }
    return false
  }

  /**
   * Returns the terminal to be used for a given port.
   */
  getTerminalForPort(cell: Cell, isSource: boolean) {
    return this.model.getParent(cell)
  }

  /**
   * Returns the offset to be used for the cells inside the given cell.
   */
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
   * Returns true if the given cell is a valid root.
   */
  isValidRoot(cell: Cell) {
    const ret = util.call(this.options.isValidRoot, this, cell)
    if (ret != null) {
      return ret
    }
    return (cell != null)
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
  getSwimlane(cell: Cell | null) {
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
   * Returns the bottom-most cell that intersects the given point (x, y) in
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
   * Returns true if the given coordinate pair is inside the content
   * of the given swimlane.
   */
  hitsSwimlaneContent(swimlane: Cell | null, x: number, y: number) {
    return this.cellManager.hitsSwimlaneContent(swimlane, x, y)
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
   * Returns the visible child nodes or edges in the given parent.
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
   *
   * Parameters:
   *
   * cell - <Cell> whose connections should be returned.
   * parent - Optional parent of the opposite end for a connection to be
   * returned.
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
   * @param recurse - Optional boolean the specifies if the parent specified
   * only need be an ancestral parent, true, or the direct parent, false.
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
   * Parameters:
   *
   * @param edges Array of `Cell`s that contains the edges whose opposite
   * terminals should be returned.
   * @param terminal - Specifies the end whose opposite should be returned.
   * @param includeSources - Optional boolean that specifies if source
   * terminals should be included in the result. Default is `true`.
   * @param includeTargets - Optional boolean that specifies if target
   * terminals should be included in the result. Default is `true`.
   */
  getOpposites(
    edges: Cell[],
    terminal: Cell,
    includeSources: boolean = true,
    includeTargets: boolean = true,
  ) {
    return this.cellManager.getOpposites(
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
   * halfpane from the given point (x0, y0) rightwards or downwards
   * depending on rightHalfpane and bottomHalfpane.
   *
   * @param x0 X-coordinate of the origin.
   * @param y0 Y-coordinate of the origin.
   * @param parent Optional `Cell` whose children should be checked.
   * @param rightHalfpane - Boolean indicating if the cells in the right
   * halfpane from the origin should be returned.
   * @param bottomHalfpane - Boolean indicating if the cells in the bottom
   * halfpane from the origin should be returned.
   */
  getCellsBeyond(
    x0: number,
    y0: number,
    parent: Cell = this.getDefaultParent(),
    rightHalfpane: boolean = false,
    bottomHalfpane: boolean = false,
  ) {
    return this.cellManager.getCellsBeyond(
      x0,
      y0,
      parent,
      rightHalfpane,
      bottomHalfpane,
    )
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
   * will be counted. Default is `false`.
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
   * Example:
   *
   * (code)
   * mxLog.show();
   * var cell = graph.getSelectionCell();
   * graph.traverse(cell, false, function(vertex, edge)
   * {
   *   mxLog.debug(graph.getLabel(vertex));
   * });
   * (end)
   *
   * Parameters:
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
    func: (node: Cell, edge: Cell | null) => boolean,
    edge?: Cell,
    visited: WeakMap<Cell, boolean> = new WeakMap<Cell, boolean>(),
    inverse: boolean = false,
  ) {
    this.cellManager.traverse(node, directed, func, edge, visited, inverse)
  }

  // #endregion

  // #region :::::::::::: Validation

  validateEdge(edge: Cell | null, source: Cell | null, target: Cell | null) {
    const ret = util.call(this.options.validateEdge, this, edge, source, target)
    if (ret != null) {
      return ret
    }

    return null
  }

  validateCell(cell: Cell, context: any) {
    const ret = util.call(this.options.validateCell, this, cell, context)
    if (ret != null) {
      return ret
    }

    return null
  }

  validationAlert(message: string) {
    console.warn(message)
  }

  isEdgeValid(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return this.validator.getEdgeValidationError(
      edge, source, target,
    ) == null
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

  panGraph(dx: number, dy: number) {
    this.viewport.panGraph(dx, dy)
  }

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

  /**
   * Zooms the graph to the given scale with an optional boolean center
   * argument, which is passd to <zoom>.
   */
  zoomTo(scale: number, center?: boolean) {
    this.zoom(scale / this.view.scale, center)
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
   * Zooms the graph using the given factor. Center is an optional boolean
   * argument that keeps the graph scrolled to the center.
   */
  zoom(factor: number, center: boolean = this.centerZoom) {
    this.viewport.zoom(factor, center)
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

  /**
   * Returns true if the given cell is connectable in this graph.
   */
  isCellConnectable(cell: Cell | null) {
    const ret = util.call(this.options.isCellConnectable, this, cell)
    if (ret != null) {
      return ret
    }

    return this.model.isConnectable(cell)
  }

  /**
   * Returns true if perimeter points should be computed such that the
   * resulting edge has only horizontal or vertical segments.
   */
  isOrthogonal(edgeState: State) {
    const orthogonal = edgeState.style.orthogonal
    if (orthogonal != null) {
      return orthogonal
    }

    const tmp = this.view.getEdgeFunction(edgeState)
    return (
      tmp === EdgeStyle.segmentConnector ||
      tmp === EdgeStyle.elbowConnector ||
      tmp === EdgeStyle.sideToSide ||
      tmp === EdgeStyle.topToBottom ||
      tmp === EdgeStyle.entityRelation ||
      tmp === EdgeStyle.orthConnector
    )
  }

  /**
   * Returns true if the given cell state is a loop.
   */
  isLoop(state: State) {
    const src = state.getVisibleTerminalState(true)
    const trg = state.getVisibleTerminalState(false)

    return (src != null && src === trg)
  }

  /**
   * Returns true if the given event is a clone event.
   */
  isCloneEvent(e: MouseEvent) {
    return DomEvent.isControlDown(e)
  }

  /**
   * Click-through behaviour on selected cells. If this returns true the
   * cell behind the selected cell will be selected.
   */
  isTransparentClickEvent(e: MouseEvent) {
    const ret = util.call(this.options.isTransparentClickEvent, this, e)
    if (ret != null) {
      return ret
    }
    return false
  }

  /**
   * Returns true if the given event is a toggle event.
   */
  isToggleEvent(e: MouseEvent) {
    return detector.IS_MAC ? DomEvent.isMetaDown(e) : DomEvent.isControlDown(e)
  }

  /**
   * Returns true if the given mouse event should be aligned to the grid.
   */
  isGridEnabledForEvent(e: MouseEvent) {
    return e != null && !DomEvent.isAltDown(e)
  }

  /**
   * Returns true if the given mouse event should be constrained.
   */
  isConstrainedEvent(e: MouseEvent) {
    return DomEvent.isShiftDown(e)
  }

  /**
   * Returns true if the given mouse event should not allow any connections
   * to be made.
   */
  isIgnoreTerminalEvent(e: MouseEvent) {
    const ret = util.call(this.options.isIgnoreTerminalEvent, this, e)
    if (ret != null) {
      return ret
    }

    return false
  }

  // #endregion

  // #region :::::::::::: Graph Appearance

  /**
   * Returns the <backgroundImage> as an <mxImage>.
   */
  getBackgroundImage() {
    return this.backgroundImage
  }

  /**
   * Sets the new <backgroundImage>.
   *
   * Parameters:
   *
   * image - New <mxImage> to be used for the background.
   */
  setBackgroundImage(image: Image) {
    this.backgroundImage = image
  }

  /**
   * Returns the <mxImage> used to display the collapsed state of
   * the specified cell state. This returns null for all edges.
   */
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
  convertDataToString(cell: Cell) {
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
   * Returns a string or DOM node that represents the label for the given cell.
   */
  getLabel(cell: Cell) {
    let result = ''

    if (this.labelsVisible && cell != null) {
      const state = this.view.getState(cell)
      const style = (state != null) ? state.style : this.getCellStyle(cell)

      if (!style.noLabel) {
        result = this.convertDataToString(cell)
      }
    }

    return result
  }

  /**
   * Returns true if the label must be rendered as HTML markup.
   */
  isHtmlLabel(cell: Cell) {
    return this.isHtmlLabels()
  }

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
   * displaying the given cells label. This implementation returns true if
   * <constants.STYLE_WHITE_SPACE> in the style of the given cell is 'wrap'.
   *
   * This is used as a workaround for IE ignoring the white-space directive
   * of child elements if the directive appears in a parent element. It
   * should be overridden to return true if a white-space directive is used
   * in the HTML markup that represents the given cells label. In order for
   * HTML markup to work in labels, <isHtmlLabel> must also return true
   * for the given cell.
   *
   * Example:
   *
   * (code)
   * graph.getLabel (cell)
   * {
   *   var tmp = getLabel.apply(this, arguments); // "supercall"
   *
   *   if (this.model.isEdge(cell))
   *   {
   *     tmp = '<div style="width: 150px; white-space:normal;">'+tmp+'</div>';
   *   }
   *
   *   return tmp;
   * }
   *
   * graph.isWrapping (state)
   * {
   * 	 return this.model.isEdge(state.cell);
   * }
   * (end)
   *
   * Makes sure no edge label is wider than 150 pixels, otherwise the content
   * is wrapped. Note: No width must be specified for wrapped node labels as
   * the node defines the width in its geometry.
   *
   * Parameters:
   *
   * state - <Cell> whose label should be wrapped.
   */
  isWrapping(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return style != null ? style.whiteSpace === 'wrap' : false
  }

  /**
   * Returns true if the overflow portion of labels should be hidden. If this
   * returns true then node labels will be clipped to the size of the vertices.
   * This implementation returns true if <constants.STYLE_OVERFLOW> in the
   * style of the given cell is 'hidden'.
   *
   * Parameters:
   *
   * state - <Cell> whose label should be clipped.
   */
  isLabelClipped(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return (style != null) ? style.overflow === 'hidden' : false
  }

  /**
   * Returns the string or DOM node that represents the tooltip for the given
   * state, node and coordinate pair. This implementation checks if the given
   * node is a folding icon or overlay and returns the respective tooltip. If
   * this does not result in a tooltip, the handler for the cell is retrieved
   * from <selectionCellsHandler> and the optional getTooltipForNode method is
   * called. If no special tooltip exists here then <getTooltipForCell> is used
   * with the cell in the given state as the argument to return a tooltip for the
   * given state.
   *
   * Parameters:
   *
   * state - <CellState> whose tooltip should be returned.
   * node - DOM node that is currently under the mouse.
   * x - X-coordinate of the mouse.
   * y - Y-coordinate of the mouse.
   */
  getTooltip(
    state: State | null,
    trigger: HTMLElement,
    x: number,
    y: number,
  ) {
    let tip: string | null = null

    if (state != null) {
      // Checks if the mouse is over the folding icon
      if (
        state.control != null && (
          trigger === state.control.elem ||
          trigger.parentNode === state.control.elem
        )
      ) {
        tip = 'this.collapseExpandResource'
        // tip = util.escape(mxResources.get(tip) || tip).replace(/\\n/g, '<br>')
      }

      if (tip == null && state.overlays != null) {
        state.overlays.each((shape) => {
          if (tip == null &&
            (trigger === shape.elem || trigger.parentNode === shape.elem)
          ) {
            tip = shape.overlay!.toString()
          }
        })
      }

      if (tip == null) {
        const handler = this.selectionHandler.getHandler(state.cell)
        const getTooltipForNode = handler && (handler as any).getTooltipForNode
        if (getTooltipForNode && typeof (getTooltipForNode) === 'function') {
          tip = getTooltipForNode(trigger)
        }
      }

      if (tip == null) {
        tip = this.getTooltipForCell(state.cell)
      }
    }

    return tip
  }

  /**
   * Returns the string or DOM node to be used as the tooltip for the given
   * cell. This implementation uses the cells getTooltip function if it
   * exists, or else it returns <convertValueToString> for the cell.
   *
   * Example:
   *
   * (code)
   * graph.getTooltipForCell (cell)
   * {
   *   return 'Hello, World!';
   * }
   * (end)
   *
   * Replaces all tooltips with the string Hello, World!
   *
   * Parameters:
   *
   * cell - <Cell> whose tooltip should be returned.
   */
  getTooltipForCell(cell: Cell) {
    let tip = null

    // if (cell != null && cell.getTooltip != null) {
    //   tip = cell.getTooltip()
    // } else {
    //   tip = this.convertValueToString(cell)
    // }

    tip = this.convertDataToString(cell)

    return tip
  }

  /**
   * Returns the string to be used as the link for the given cell. This
   * implementation returns null.
   *
   * Parameters:
   *
   * cell - <Cell> whose tooltip should be returned.
   */
  getLinkForCell(cell: Cell) {
    return null
  }

  /**
   * Returns the cursor value to be used for the CSS of the shape for the
   * given event. This implementation calls <getCursorForCell>.
   *
   * Parameters:
   *
   * me - <mxMouseEvent> whose cursor should be returned.
   */
  getCursorForMouseEvent(e: CustomMouseEvent): string | null {
    return this.getCursorForCell(e.getCell())
  }

  /**
   * Returns the cursor value to be used for the CSS of the shape for the
   * given cell. This implementation returns null.
   *
   * Parameters:
   *
   * cell - <Cell> whose cursor should be returned.
   */
  getCursorForCell(cell: Cell | null) {
    return null
  }

  /**
   * Returns the start size of the given swimlane, that is, the width or
   * height of the part that contains the title, depending on the
   * horizontal style. The return value is an <Rect> with either
   * width or height set as appropriate.
   *
   * Parameters:
   *
   * swimlane - <Cell> whose start size should be returned.
   */
  getStartSize(swimlane: Cell | null) {
    const result = new Rectangle()
    const state = this.view.getState(swimlane)
    const style = (state != null) ? state.style : this.getCellStyle(swimlane)

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

  /**
   * Returns the image URL for the given cell state.
   */
  getImage(state: State): string | null {
    return (state != null) && state.style.image || null
  }

  /**
   * Returns the vertical alignment for the given cell state.
   */
  getVerticalAlign(state: State): VAlign {
    return state && state.style.verticalAlign || 'middle'
  }

  getAlign(state: State): Align {
    return state && state.style.align || 'center'
  }

  /**
   * Returns the indicator color for the given cell state.
   */
  getIndicatorColor(state: State) {
    return state && state.style.indicatorColor || null
  }

  getIndicatorDirection(state: State) {
    return state && state.style.indicatorDirection || null
  }

  getIndicatorStrokeColor(state: State) {
    return state && state.style.indicatorStrokeColor || null
  }

  /**
   * Returns the indicator gradient color for the given cell state.
   */
  getIndicatorGradientColor(state: State) {
    return state && state.style.indicatorGradientColor || null
  }

  /**
   * Returns the indicator shape for the given cell state.
   */
  getIndicatorShape(state: State) {
    return state && state.style.indicatorShape || null
  }

  /**
   * Returns the indicator image for the given cell state.
   */
  getIndicatorImage(state: State) {
    return state && state.style.indicatorImage || null
  }

  getBorder() {
    return this.border
  }

  setBorder(value: number) {
    this.border = value
  }

  /**
   * Returns true if the given cell is a swimlane in the graph. A swimlane is
   * a container cell with some specific behaviour. This implementation
   * checks if the shape associated with the given cell is a <mxSwimlane>.
   *
   * Parameters:
   *
   * cell - <Cell> to be checked.
   */
  isSwimlane(cell: Cell | null) {
    if (cell != null) {
      if (this.model.getParent(cell) !== this.model.getRoot()) {
        const state = this.view.getState(cell)
        const style = (state != null) ? state.style : this.getCellStyle(cell)

        if (style != null && !this.model.isEdge(cell)) {
          return (style.shape === Shapes.swimlane)
        }
      }
    }

    return false
  }

  // #endregion

  // #region :::::::::::: Graph Behaviour

  isResizeContainer() {
    return this.resizeContainer
  }

  setResizeContainer(value: boolean) {
    this.resizeContainer = value
  }

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
  enterStopsCellEditing: boolean = false

  isEnterStopsCellEditing() {
    return this.enterStopsCellEditing
  }

  setEnterStopsCellEditing(value: boolean) {
    this.enterStopsCellEditing = value
  }

  /**
   * Returns true if the given cell may not be moved, sized, bended,
   * disconnected, edited or selected. This implementation returns true for
   * all nodes with a relative geometry if <locked> is false.
   *
   * Parameters:
   *
   * cell - <Cell> whose locked state should be returned.
   */
  isCellLocked(cell: Cell | null) {
    const geometry = this.model.getGeometry(cell)
    return (
      this.isCellsLocked() || (geometry != null &&
        this.model.isNode(cell) && geometry.relative)
    )
  }

  /**
   * Returns true if the given cell may not be moved, sized, bended,
   * disconnected, edited or selected. This implementation returns true for
   * all nodes with a relative geometry if <locked> is false.
   *
   * Parameters:
   *
   * cell - <Cell> whose locked state should be returned.
   */
  isCellsLocked() {
    return this.cellsLocked
  }

  /**
   * Sets if any cell may be moved, sized, bended, disconnected, edited or
   * selected.
   *
   * Parameters:
   *
   * value - Boolean that defines the new value for <cellsLocked>.
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
   * Returns true if the given cell is cloneable. This implementation returns
   * <isCellsCloneable> for all cells unless a cell style specifies
   * <constants.STYLE_CLONEABLE> to be 0.
   *
   * Parameters:
   *
   * cell - Optional <Cell> whose cloneable state should be returned.
   */
  isCellCloneable(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return this.isCellsCloneable() && style.cloneable !== false
  }

  /**
   * Returns <cellsCloneable>, that is, if the graph allows cloning of cells
   * by using control-drag.
   */
  isCellsCloneable() {
    return this.cellsCloneable
  }

  /**
   * Specifies if the graph should allow cloning of cells by holding down the
   * control key while cells are being moved. This implementation updates
   * <cellsCloneable>.
   *
   * Parameters:
   *
   * value - Boolean indicating if the graph should be cloneable.
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

  /**
   * Returns true if the given cell may be exported to the clipboard. This
   * implementation returns <exportEnabled> for all cells.
   *
   * Parameters:
   *
   * cell - <Cell> that represents the cell to be exported.
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

  /**
   * Returns true if the given cell may be imported from the clipboard.
   * This implementation returns <importEnabled> for all cells.
   *
   * Parameters:
   *
   * cell - <Cell> that represents the cell to be imported.
   */
  canImportCell(cell: Cell) {
    return this.importEnabled
  }

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
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)
    return this.isCellsDeletable() && style.deletable === true
  }

  isCellsDeletable() {
    return this.cellsDeletable
  }

  setCellsDeletable(value: boolean) {
    this.cellsDeletable = value
  }

  isCellRotatable(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

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
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return (
      this.isCellsMovable() &&
      !this.isCellLocked(cell) &&
      style.movable !== false
    )
  }

  isCellsMovable() {
    return this.cellsMovable
  }

  setCellsMovable(value: boolean) {
    this.cellsMovable = value
  }

  isGridEnabled() {
    return this.gridEnabled
  }

  setGridEnabled(value: boolean) {
    this.gridEnabled = value
  }

  isPortsEnabled() {
    return this.portsEnabled
  }

  setPortsEnabled(value: boolean) {
    this.portsEnabled = value
  }

  getTolerance() {
    return this.tolerance
  }

  setTolerance(value: number) {
    this.tolerance = value
  }

  isNodeLabelsMovable() {
    return this.nodeLabelsMovable
  }

  setNodeLabelsMovable(value: boolean) {
    this.nodeLabelsMovable = value
  }

  isEdgeLabelsMovable() {
    return this.edgeLabelsMovable
  }

  setEdgeLabelsMovable(value: boolean) {
    this.edgeLabelsMovable = value
  }

  isSwimlaneNesting() {
    return this.swimlaneNesting
  }

  /**
   * Specifies if swimlanes can be nested by drag and drop. This is only
   * taken into account if `dropEnabled` is true.
   */
  setSwimlaneNesting(value: boolean) {
    this.swimlaneNesting = value
  }

  isSwimlaneSelectionEnabled() {
    return this.swimlaneSelectionEnabled
  }

  /**
   * Specifies if swimlanes should be selected if the mouse is released
   * over their content area.
   */
  setSwimlaneSelectionEnabled(value: boolean) {
    this.swimlaneSelectionEnabled = value
  }

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

  isAllowLoops() {
    return this.allowLoops
  }

  setAllowLoops(value: boolean) {
    this.allowLoops = value
  }

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

  setConnectableEdges(value: boolean) {
    this.connectableEdges = value
  }

  isConnectableEdges() {
    return this.connectableEdges
  }

  /**
   * Specifies if edges should be inserted when cloned but not valid wrt.
   * <getEdgeValidationError>. If false such edges will be silently ignored.
   */
  setCloneInvalidEdges(value: boolean) {
    this.cloneInvalidEdges = value
  }

  isCloneInvalidEdges() {
    return this.cloneInvalidEdges
  }

  isDisconnectOnMove() {
    return this.disconnectOnMove
  }

  setDisconnectOnMove(value: boolean) {
    this.disconnectOnMove = value
  }

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

  isSplitEnabled() {
    return this.splitEnabled
  }

  /**
   * Specifies if the graph should allow dropping of cells onto or into other
   * cells.
   *
   * Parameters:
   *
   * dropEnabled - Boolean indicating if the graph should allow dropping
   * of cells into other cells.
   */
  setSplitEnabled(value: boolean) {
    this.splitEnabled = value
  }

  /**
   * Returns true if the given cell is resizable. This returns
   * <cellsResizable> for all given cells if <isCellLocked> does not return
   * true for the given cell and its style does not specify
   * <constants.STYLE_RESIZABLE> to be 0.
   *
   * Parameters:
   *
   * cell - <Cell> whose resizable state should be returned.
   */
  isCellResizable(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return (
      this.isCellsResizable() &&
      !this.isCellLocked(cell) &&
      style.resizable !== false
    )
  }

  /**
   * Returns <cellsResizable>.
   */
  isCellsResizable() {
    return this.cellsResizable
  }

  /**
   * Specifies if the graph should allow resizing of cells. This
   * implementation updates <cellsResizable>.
   *
   * Parameters:
   *
   * value - Boolean indicating if the graph should allow resizing of
   * cells.
   */
  setCellsResizable(value: boolean) {
    this.cellsResizable = value
  }

  /**
   * Returns true if the given terminal point is movable. This is independent
   * from <isCellConnectable> and <isCellDisconnectable> and controls if terminal
   * points can be moved in the graph if the edge is not connected. Note that it
   * is required for this to return true to connect unconnected edges. This
   * implementation returns true.
   *
   * Parameters:
   *
   * cell - <Cell> whose terminal point should be moved.
   * source - Boolean indicating if the source or target terminal should be moved.
   */
  isTerminalPointMovable(cell: Cell, isSource: boolean) {
    return true
  }

  /**
   * Returns true if the given cell is bendable.
   */
  isCellBendable(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return (
      this.isCellsBendable() &&
      !this.isCellLocked(cell) &&
      style.bendable !== false
    )
  }

  /**
   * Returns <cellsBenadable>.
   */
  isCellsBendable() {
    return this.cellsBendable
  }

  /**
   * Specifies if the graph should allow bending of edges. This
   * implementation updates <bendable>.
   *
   * Parameters:
   *
   * value - Boolean indicating if the graph should allow bending of
   * edges.
   */
  setCellsBendable(value: boolean) {
    this.cellsBendable = value
  }

  /**
   * Returns true if the given cell is editable. This returns <cellsEditable> for
   * all given cells if <isCellLocked> does not return true for the given cell
   * and its style does not specify <constants.STYLE_EDITABLE> to be 0.
   *
   * Parameters:
   *
   * cell - <Cell> whose editable state should be returned.
   */
  isCellEditable(cell: Cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return this.isCellsEditable() &&
      !this.isCellLocked(cell) &&
      style.editable !== false
  }

  /**
   * Returns <cellsEditable>.
   */
  isCellsEditable() {
    return this.cellsEditable
  }

  /**
   * Specifies if the graph should allow in-place editing for cell labels.
   * This implementation updates <cellsEditable>.
   *
   * Parameters:
   *
   * value - Boolean indicating if the graph should allow in-place
   * editing.
   */
  setCellsEditable(value: boolean) {
    this.cellsEditable = value
  }

  /**
   * Returns true if the given cell is disconnectable from the source or
   * target terminal. This returns <isCellsDisconnectable> for all given
   * cells if <isCellLocked> does not return true for the given cell.
   *
   * Parameters:
   *
   * cell - <Cell> whose disconnectable state should be returned.
   * terminal - <Cell> that represents the source or target terminal.
   * source - Boolean indicating if the source or target terminal is to be
   * disconnected.
   */
  isCellDisconnectable(cell: Cell, terminal: Cell, isSource: boolean) {
    return this.isCellsDisconnectable() && !this.isCellLocked(cell)
  }

  /**
   * Returns <cellsDisconnectable>.
   */
  isCellsDisconnectable() {
    return this.cellsDisconnectable
  }

  /**
   * Sets <cellsDisconnectable>.
   */
  setCellsDisconnectable(value: boolean) {
    this.cellsDisconnectable = value
  }

  /**
   * Returns true if the given cell is a valid source for new connections.
   * This implementation returns true for all non-null values and is
   * called by is called by <isValidConnection>.
   *
   * Parameters:
   *
   * cell - <Cell> that represents a possible source or null.
   */
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
   * Returns <isValidSource> for the given cell. This is called by
   * <isValidConnection>.
   *
   * Parameters:
   *
   * cell - <Cell> that represents a possible target or null.
   */
  isValidTarget(cell: Cell | null) {
    return this.isValidSource(cell)
  }

  /**
   * Returns true if the given target cell is a valid target for source.
   * This is a boolean implementation for not allowing connections between
   * certain pairs of nodes and is called by <getEdgeValidationError>.
   * This implementation returns true if <isValidSource> returns true for
   * the source and <isValidTarget> returns true for the target.
   *
   * Parameters:
   *
   * source - <Cell> that represents the source cell.
   * target - <Cell> that represents the target cell.
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
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)
    return this.isAutoSizeCells() || style.autosize === true
  }

  isAutoSizeCells() {
    return this.autoSizeCells
  }

  /**
   * Specifies if cell sizes should be automatically updated after a label
   * change. This implementation sets <autoSizeCells> to the given parameter.
   * To update the size of cells when the cells are added, set
   * <autoSizeCellsOnAdd> to true.
   *
   * Parameters:
   *
   * value - Boolean indicating if cells should be resized
   * automatically.
   */
  setAutoSizeCells(value: boolean) {
    this.autoSizeCells = value
  }

  /**
   * Returns true if the parent of the given cell should be extended if the
   * child has been resized so that it overlaps the parent. This
   * implementation returns <isExtendParents> if the cell is not an edge.
   *
   * Parameters:
   *
   * cell - <Cell> that has been resized.
   */
  isExtendParent(cell: Cell) {
    return !this.getModel().isEdge(cell) && this.isExtendParents()
  }

  isExtendParents() {
    return this.extendParents
  }

  setExtendParents(value: boolean) {
    this.extendParents = value
  }

  isExtendParentsOnAdd() {
    return this.extendParentsOnAdd
  }

  setExtendParentsOnAdd(value: boolean) {
    this.extendParentsOnAdd = value
  }

  isExtendParentsOnMove() {
    return this.extendParentsOnMove
  }

  setExtendParentsOnMove(value: boolean) {
    this.extendParentsOnMove = value
  }

  isRecursiveResize() {
    return this.recursiveResize
  }

  setRecursiveResize(value: boolean) {
    this.recursiveResize = value
  }

  /**
   * Returns true if the given cell should be kept inside the bounds of its
   * parent according to the rules defined by <getOverlap> and
   * <isAllowOverlapParent>. This implementation returns false for all children
   * of edges and <isConstrainChildren> otherwise.
   *
   * Parameters:
   *
   * cell - <Cell> that should be constrained.
   */
  isConstrainChild(cell: Cell) {
    return this.isConstrainChildren() &&
      !this.getModel().isEdge(this.getModel().getParent(cell)!)
  }

  isConstrainChildren() {
    return this.constrainChildren
  }

  setConstrainChildren(value: boolean) {
    this.constrainChildren = value
  }

  isConstrainRelativeChildren() {
    return this.constrainRelativeChildren
  }

  setConstrainRelativeChildren(value: boolean) {
    this.constrainRelativeChildren = value
  }

  isAllowNegativeCoordinates() {
    return this.allowNegativeCoordinates
  }

  setAllowNegativeCoordinates(value: boolean) {
    this.allowNegativeCoordinates = value
  }

  /**
   * Returns a decimal number representing the amount of the width and height
   * of the given cell that is allowed to overlap its parent. A value of 0
   * means all children must stay inside the parent, 1 means the child is
   * allowed to be placed outside of the parent such that it touches one of
   * the parents sides. If <isAllowOverlapParent> returns false for the given
   * cell, then this method returns 0.
   *
   * Parameters:
   *
   * cell - <Cell> for which the overlap ratio should be returned.
   */
  getOverlap(cell: Cell) {
    return (this.isAllowOverlapParent(cell)) ? this.defaultOverlap : 0
  }

  /**
   * Returns true if the given cell is allowed to be placed outside of the
   * parents area.
   *
   * Parameters:
   *
   * cell - <Cell> that represents the child to be checked.
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
  isFoldable(cell: Cell, nextCollapseState: boolean) {
    const ret = util.call(this.options.isFoldable, this, cell, nextCollapseState)
    if (ret != null) {
      return ret
    }

    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return (this.model.getChildCount(cell) > 0 && style.foldable !== false)
  }

  /**
   * Returns true if the given cell is a valid drop target for the specified
   * cells. If <splitEnabled> is true then this returns <isSplitTarget> for
   * the given arguments else it returns true if the cell is not collapsed
   * and its child count is greater than 0.
   *
   * Parameters:
   *
   * cell - <Cell> that represents the possible drop target.
   * cells - <Cells> that should be dropped into the target.
   * evt - Mouseevent that triggered the invocation.
   */
  isValidDropTarget(cell: Cell, cells: Cell[], e: MouseEvent) {
    return cell != null && ((this.isSplitEnabled() &&
      this.isSplitTarget(cell, cells, e)) || (!this.model.isEdge(cell) &&
        (this.isSwimlane(cell) || (this.model.getChildCount(cell) > 0 &&
          !this.isCellCollapsed(cell)))))
  }

  /**
   * Returns true if the given edge may be splitted into two edges with the
   * given cell as a new terminal between the two.
   *
   * Parameters:
   *
   * target - <Cell> that represents the edge to be splitted.
   * cells - <Cells> that should split the edge.
   * evt - Mouseevent that triggered the invocation.
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
   * If the given array contains a swimlane and <swimlaneNesting> is false
   * then this always returns null. If no cell is given, then the bottommost
   * swimlane at the location of the given event is returned.
   *
   * This function should only be used if <isDropEnabled> returns true.
   *
   * Parameters:
   *
   * cells - Array of <Cells> which are to be dropped onto the target.
   * evt - Mouseevent for the drag and drop.
   * cell - <Cell> that is under the mousepointer.
   * clone - Optional boolean to indicate of cells will be cloned.
   */
  getDropTarget(
    cells: Cell[],
    evt: MouseEvent,
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
      DomEvent.getClientX(evt),
      DomEvent.getClientY(evt),
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
      !this.isValidDropTarget(cell, cells, evt) &&
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
    this.connectionManager.dispose()
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

export namespace Graph {
  interface Hooks {
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

    getTooltip?: (this: Graph, cell: Cell) => string | HTMLElement
    getConstraints?: (
      this: Graph,
      cell: Cell,
      isSource: boolean,
    ) => Constraint[] | null

    isPort?: (this: Graph, cell: Cell) => boolean | null
    isFoldable?: (this: Graph, cell: Cell, nextCollapseState: boolean) => boolean | null
    isCellConnectable?: (this: Graph, cell: Cell | null) => boolean | null
    isValidRoot?: (this: Graph, cell: Cell) => boolean | null

    isTransparentClickEvent?: (this: Graph, e: MouseEvent) => boolean | null
    isIgnoreTerminalEvent?: (this: Graph, e: MouseEvent) => boolean | null

    validateCell?: (this: Graph, cell: Cell, context: any) => string | null
    validateEdge?: (
      this: Graph,
      edge: Cell | null,
      source: Cell | null,
      target: Cell | null,
    ) => string | null
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
    showContextMenu: 'showContextMenu',
    hideContextMenu: 'hideContextMenu',
    selectionChanged: 'selectionChanged',
  }
}
