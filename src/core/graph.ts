import * as util from '../util'
import * as images from '../assets/images'
import { Cell } from './cell'
import { View } from './view'
import { Model } from './model'
import { CellState } from './state'
import { Geometry } from './geometry'
import { Renderer } from './renderer'
import { StyleSheet, EdgeStyle } from '../stylesheet'
import { Label } from '../shape'
import { Align, VAlign, CellStyle, Dialect } from '../types'
import { IChange, RootChange, ChildChange } from '../change'
import {
  constants,
  detector,
  Events,
  DomEvent,
  CustomMouseEvent,
  IDisposable,
} from '../common'
import {
  Rectangle,
  Point,
  Constraint,
  Image,
  Overlay,
  ShapeName,
  PageSize,
  Multiplicity,
} from '../struct'
import {
  IMouseHandler,
  TooltipHandler,
  PopupMenuHandler,
  PanningHandler,
  SelectionHandler,
  GraphHandler,
  ConnectionHandler,
  NodeHandler,
  EdgeHandler,
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

export class Graph extends Events implements IDisposable {
  public readonly container: HTMLElement
  public readonly model: Model
  public readonly view: View
  public readonly styleSheet: StyleSheet
  public readonly renderer: Renderer

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

  prefixCls: string = 'x6'

  /**
   * Holds the <CellEditor> that is used as the in-place editing.
   */
  cellEditor: any

  /**
   * An array of `Multiplicity` describing the allowed
   * connections in a graph.
   */
  multiplicities: Multiplicity[] = []

  /**
   * Dialect to be used for drawing the graph.
   */
  dialect: Dialect

  /**
   * Specifies the grid size.
   *
   * Default is `10`.
   */
  gridSize: number = 10

  /**
   * Specifies if the grid is enabled. This is used in <snap>.
   */
  gridEnabled = true

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
   * Specifies the return value for <isEnabled>. Default is true.
   */
  enabled = true

  /**
   * Specifies if <mxKeyHandler> should invoke <escape> when the escape key
   * is pressed. Default is true.
   */
  escapeEnabled = true

  /**
   * If true, when editing is to be stopped by way of selection changing,
   * data in diagram changing or other means stopCellEditing is invoked, and
   * changes are saved. This is implemented in a focus handler in
   * <CellEditor>. Default is true.
   */
  invokesStopCellEditing = true

  /**
   * If true, pressing the enter key without pressing control or shift will stop
   * editing and accept the new value. This is used in <CellEditor> to stop
   * cell editing. Note: You can always use F2 and escape to stop editing.
   * Default is false.
   */
  enterStopsCellEditing = false

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

  hooks: Graph.Hooks

  constructor(container: HTMLElement, options: Graph.Options = {}) {
    super()

    this.container = container
    this.dialect = options.dialect === 'html' ? 'html' : 'svg'
    this.hooks = options.hooks || {}
    this.model = options.model || this.createModel()
    this.styleSheet = options.styleSheet || this.createStyleSheet()
    this.view = this.createView()
    this.renderer = this.createRenderer()
    this.selection = this.createSelection()

    // The order of the following initializations should not be modified.
    this.changeManager = new ChangeManager(this)
    this.eventloop = new EventLoop(this)
    this.handlerManager = new HandlerManager(this)
    this.cellManager = new CellManager(this)
    this.selectionManager = new SelectionManager(this)
    this.connectionManager = new ConnectionManager(this)
    this.validator = new ValidationManager(this)
    this.viewport = new ViewportManager(this)

    if (container != null) {
      this.init(container)
    }

    this.view.revalidate()
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
    return (this.hooks.createModel != null &&
      this.hooks.createModel(this) ||
      new Model()
    )
  }

  protected createView() {
    return (this.hooks.createView != null &&
      this.hooks.createView(this) ||
      new View(this)
    )
  }

  protected createStyleSheet() {
    return (this.hooks.createStyleSheet != null &&
      this.hooks.createStyleSheet(this) ||
      new StyleSheet()
    )
  }

  protected createRenderer() {
    return (this.hooks.createRenderer != null &&
      this.hooks.createRenderer(this) ||
      new Renderer()
    )
  }

  protected createSelection() {
    return (this.hooks.createSelection != null &&
      this.hooks.createSelection(this) ||
      new Selection(this)
    )
  }

  hideTooltip() {
    if (this.tooltipHandler) {
      this.tooltipHandler.hide()
    }
  }

  enableTooltips() {
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

  protected init(container: HTMLElement) {
    // TODO:
    // this.cellEditor = new CellEditor(this)
    this.view.init()
    this.viewport.sizeDidChange()

    if (detector.IS_IE) {
      DomEvent.addListener(window, 'unload', () => {
        this.dispose()
      })

      // disable shift-click for text
      DomEvent.addListener(container, 'selectstart', (e: MouseEvent) => {
        return (
          this.isEditing() ||
          (!this.eventloop.isMouseDown && !DomEvent.isShiftDown(e))
        )
      })
    }
  }

  batchUpdate(update: () => void) {
    this.model.batchUpdate(update)
  }

  /**
   * Returns the cells to be selected for the given array of changes.
   */
  getSelectionCellsForChanges(changes: IChange[]) {
    const dict = new WeakMap<Cell, boolean>()
    const cells: Cell[] = []

    const addCell = (cell: Cell) => {
      if (!dict.get(cell) && this.model.contains(cell)) {
        if (this.model.isEdge(cell) || this.model.isNode(cell)) {
          dict.set(cell, true)
          cells.push(cell)
        } else {
          cell.eachChild(child => addCell(child))
        }
      }
    }

    changes.forEach((change) => {
      if (!(change instanceof RootChange)) {
        let cell = null

        if (change instanceof ChildChange) {
          cell = change.child
        } else {
          const tmp = (change as any).cell
          if (tmp != null && tmp instanceof Cell) {
            cell = tmp
          }
        }

        if (cell != null) {
          addCell(cell)
        }
      }
    })

    return cells
  }

  // #region :::::::::::: Overlays

  /**
   * Adds an `CellOverlay` for the specified cell.
   */
  addCellOverlay(cell: Cell, overlay: Overlay) {
    if (cell.overlays == null) {
      cell.overlays = []
    }

    cell.overlays.push(overlay)

    const state = this.view.getState(cell)
    if (state != null) {
      // Immediately updates the cell display if the state exists
      this.renderer.redraw(state)
    }

    this.trigger(Graph.events.addOverlay, { cell, overlay })

    return overlay
  }

  /**
   * Returns the array of `CellOverlay` for the given cell or null
   * if no overlays are defined.
   */
  getCellOverlays(cell: Cell) {
    return cell.overlays
  }

  /**
   * Removes and returns the given `CellOverlay` from the given cell.
   * If no overlay is given, then all overlays are removed.
   */
  removeCellOverlay(cell: Cell, overlay?: Overlay | null) {
    if (overlay == null) {
      this.removeCellOverlays(cell)
    } else {
      const index = util.indexOf(cell.overlays, overlay)
      if (index >= 0 && cell.overlays != null) {
        cell.overlays.splice(index, 1)
        if (cell.overlays.length === 0) {
          cell.overlays = null
        }

        const state = this.view.getState(cell)
        if (state != null) {
          this.renderer.redraw(state)
        }

        this.trigger(Graph.events.removeOverlay, { cell, overlay })
      } else {
        // tslint:disable-next-line
        overlay = null
      }
    }

    return overlay
  }

  removeCellOverlays(cell: Cell) {
    const overlays = cell.overlays
    if (overlays != null) {
      cell.overlays = null

      const state = this.view.getState(cell)
      if (state != null) {
        this.renderer.redraw(state)
      }

      this.trigger(Graph.events.removeOverlays, { cell, overlays })
    }

    return overlays
  }

  /**
   * Removes all `CellOverlays` in the graph for the given cell and all its
   * descendants. If no cell is specified then all overlays are removed from
   * the graph.
   */
  clearCellOverlays(cell: Cell = this.model.getRoot()) {
    this.removeCellOverlays(cell)
    cell.eachChild(child => this.clearCellOverlays(child))
  }

  /**
   * Creates an overlay for the given cell using the `warning` string and
   * image `warningImage`, then returns the new `CellOverlay`. The `warning`
   * string is displayed as a tooltip in a red font and may contain HTML
   * markup. If the `warning` string is null or a zero length string, then
   * all overlays are removed from the cell.
   */
  setCellWarning(
    cell: Cell,
    warning?: string | null,
    img: Image = this.warningImage,
    selectOnClick: boolean = false,
  ) {
    if (warning != null && warning.length > 0) {
      // Creates the overlay with the image and warning
      const overlay = new Overlay(
        img,
        `<font color=red>${warning}</font>`,
      )

      // Adds a handler for single mouseclicks to select the cell
      // if (selectOnClick) {
      // TODO:
      //   overlay.addListener('click', () => {
      //     if (this.isEnabled()) {
      //       this.setSelectionCell(cell)
      //     }
      //   })
      // }

      return this.addCellOverlay(cell, overlay)
    }

    this.removeCellOverlays(cell)

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
        // TODO:
        // this.cellEditor.startEditing(cell, e)
        this.trigger(Graph.events.editingStarted, { cell, e })
      }
    }
  }

  /**
   * Returns the initial value for in-place editing.
   */
  getEditingValue(cell: Cell, e?: MouseEvent) {
    return this.convertValueToString(cell)
  }

  stopEditing(cancel: boolean = false) {
    // TOOD:
    // this.cellEditor.stopEditing(cancel)
    this.trigger(Graph.events.editingStopped, { cancel })
  }

  labelChanged(cell: Cell, value: string, e?: MouseEvent) {
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
        this.cellSizeUpdated(cell, false)
      }
    })
  }

  // #endregion

  // #region :::::::::::: Cell styles

  /**
   * Returns a key-value pair object representing the cell style for the
   * given cell. If no string is defined in the model that specifies the
   * style, then the default style for the cell is returned or an empty
   * object, if no style can be found.
   *
   * Note: You should try and get the cell state for the given cell and
   * use the cached style in the state before using this method.
   */
  getCellStyle(cell: Cell | null) {
    if (cell) {
      const defaultStyle = this.model.isEdge(cell)
        ? this.styleSheet.getDefaultEdgeStyle()
        : this.styleSheet.getDefaultNodeStyle()

      const style = this.model.getStyle(cell) || {}
      return this.postProcessCellStyle({
        ...defaultStyle,
        ...style,
      })
    }
    return {}
  }

  /**
   * Tries to resolve the value for the image style in the image bundles and
   * turns short data URIs as defined in `ImageBundle` to data URIs as
   * defined in RFC 2397 of the IETF.
   */
  protected postProcessCellStyle(style: CellStyle) {
    if (style != null) {
      const key = style.image
      // TODO: xx
      let image = null // this.getImageFromBundles(key)
      if (image != null) {
        style.image = image
      } else {
        image = key
      }

      // Converts short data uris to normal data uris
      if (image != null && image.substring(0, 11) === 'data:image/') {
        if (image.substring(0, 20) === 'data:image/svg+xml,<') {
          // Required for FF and IE11
          image = image.substring(0, 19) + encodeURIComponent(image.substring(19))
        } else if (image.substring(0, 22) !== 'data:image/svg+xml,%3C') {
          const comma = image.indexOf(',')
          // add base64 encoding prefix if needed
          if (
            comma > 0 &&
            image.substring(comma - 7, comma + 1) !== ';base64,'
          ) {
            image = `${image.substring(0, comma)};base64,${image.substring(comma + 1)}`
          }
        }

        style.image = image
      }
    }

    return style
  }

  /**
   * Sets the style of the specified cells. If no cells are given, then the
   * selection cells are changed.
   */
  setCellStyle(style: CellStyle, cells: Cell[] = this.getSelectedCells()) {
    if (cells != null) {
      this.model.batchUpdate(() => {
        cells.forEach(cell => this.model.setStyle(cell, style))
      })
    }
  }

  /**
   * Toggles the boolean value for the given key in the style of the given
   * cell and returns the new value as 0 or 1. If no cell is specified then
   * the selection cell is used.
   *
   * Parameter:
   *
   * key - String representing the key for the boolean value to be toggled.
   * defaultValue - Optional boolean default value if no value is defined.
   * Default is false.
   * cell - Optional <Cell> whose style should be modified. Default is
   * the selection cell.
   */
  toggleCellStyle(
    key: string,
    defaultValue: boolean = false,
    cell: Cell = this.getSelectedCell()) {
    return this.toggleCellStyles(key, defaultValue, [cell])
  }

  /**
   * Toggles the boolean value for the given key in the style of the given
   * cells and returns the new value as 0 or 1. If no cells are specified,
   * then the selection cells are used.
   */
  toggleCellStyles(
    key: string,
    defaultValue: boolean = false,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    let value = null
    if (cells != null && cells.length > 0) {
      const state = this.view.getState(cells[0])
      const style = state != null ? state.style : this.getCellStyle(cells[0])

      if (style != null) {
        value = (style as any)[key] ? false : true
        this.setCellStyles(key, value, cells)
      }
    }

    return value
  }

  /**
   * Sets the key to value in the styles of the given cells. This will modify
   * the existing cell styles in-place and override any existing assignment
   * for the given key. If no cells are specified, then the selection cells
   * are changed. If no value is specified, then the respective key is
   * removed from the styles.
   */
  setCellStyles(
    key: string,
    value?: string | number | boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach((cell) => {
          if (cell != null) {
            const raw = this.model.getStyle(cell)!
            const style = { ...raw }
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
   *
   * Parameters:
   *
   * key - String representing the key to toggle the flag in.
   * flag - Integer that represents the bit to be toggled.
   * value - Boolean value to be used or null if the value should be toggled.
   * cells - Optional array of <Cells> to change the style for. Default is
   * the selection cells.
   */
  setCellStyleFlags(
    key: string,
    flag: number,
    value: boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    if (cells != null && cells.length > 0) {
      if (value == null) {
        const state = this.view.getState(cells[0])
        const style = (state != null) ? state.style : this.getCellStyle(cells[0])

        if (style != null) {
          const current = parseInt((style as any)[key], 10) || 0
          value = !((current & flag) === flag) // tslint:disable-line
        }
      }

      this.setCellStyles(key, value ? flag : null, cells)
    }
  }

  // #endregion

  // #region :::::::::::: Cell alignment and orientation

  /**
   * Aligns the given cells vertically or horizontally according to the given
   * alignment using the optional parameter as the coordinate.
   */
  alignCells(
    align: Align | VAlign,
    cells: Cell[] = this.getSelectedCells(),
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
              let geo = this.getCellGeometry(cells[i])

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

                this.resizeCell(cells[i], geo.bounds)
              }
            }
          }

          this.trigger(Graph.events.alignCells, { align, cells })
        } finally {
          this.model.endUpdate()
        }
      }
    }

    return cells
  }

  /**
   * Toggles the style of the given edge between null (or empty) and
   * `alternateEdgeStyle`.
   */
  flipEdge(edge: Cell) {
    if (edge != null && this.alternateEdgeStyle != null) {
      this.model.beginUpdate()
      try {
        const style = this.model.getStyle(edge)
        if (style == null) {
          this.model.setStyle(edge, this.alternateEdgeStyle)
        } else {
          this.model.setStyle(edge, {})
        }

        // Removes all existing control points
        this.resetEdge(edge)
        this.trigger(Graph.events.flipEdge, { edge })
      } finally {
        this.model.endUpdate()
      }
    }

    return edge
  }

  // #endregion

  // #region :::::::::::: Order

  /**
   * Moves the given cells to the front or back. The change is carried out
   * using <cellsOrdered>. This method fires <DomEvent.ORDER_CELLS> while the
   * transaction is in progress.
   *
   * Parameters:
   *
   * back - Boolean that specifies if the cells should be moved to back.
   * cells - Array of <Cells> to move to the background. If null is
   * specified then the selection cells are used.
   */
  orderCells(
    back: boolean,
    cells: Cell[] = util.sortCells(this.getSelectedCells(), true),
  ) {
    this.model.batchUpdate(() => {
      this.cellsOrdered(cells, !!back)
      this.trigger(Graph.events.orderCells, { cells, back: !!back })
    })
    return cells
  }

  /**
   * Moves the given cells to the front or back.
   */
  cellsOrdered(cells: Cell[], back: boolean) {
    if (cells != null) {
      this.model.batchUpdate(() => {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          const parent = this.model.getParent(cells[i])!

          if (back) {
            this.model.add(parent, cells[i], i)
          } else {
            this.model.add(
              parent, cells[i],
              this.model.getChildCount(parent) - 1,
            )
          }
        }
        this.trigger(Graph.events.cellsOrdered, { cells, back: !!back })
      })
    }
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
    cells: Cell[] = util.sortCells(this.getSelectedCells(), true),
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
        if (this.getCellGeometry(group) == null) {
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

        this.trigger(Graph.events.groupCells, { group, cells, border })
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
    const result = this.getBoundingBoxFromGeometry(children, true)
    if (result != null) {
      if (this.isSwimlane(group)) {
        const size = this.getStartSize(group)

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
   *
   * 设计一种钩子机制
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
  ungroupCells(cells: Cell[] = this.getSelectedCells()) {
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
        this.trigger(Graph.events.ungroupCells, { cells })
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

  /**
   * Removes the specified cells from their parents and adds them to the
   * default parent. Returns the cells that were removed from their parents.
   */
  removeCellsFromParent(cells: Cell[] = this.getSelectedCells()) {
    this.model.batchUpdate(() => {
      const parent = this.getDefaultParent()!
      const index = this.model.getChildCount(parent)

      this.cellsAdded(cells, parent, index, null, null, true)
      this.trigger(Graph.events.removeCellsFromParent, { cells })
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
    cells: Cell[] = this.getSelectedCells(),
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
        let geo = this.getCellGeometry(cells[i])
        if (geo != null) {
          const children = this.getChildCells(cells[i])

          if (children != null && children.length > 0) {
            const bounds = this.getBoundingBoxFromGeometry(children, true)

            if (bounds != null && bounds.width > 0 && bounds.height > 0) {
              let left = 0
              let top = 0

              // Adds the size of the title area for swimlanes
              if (this.isSwimlane(cells[i])) {
                const size = this.getStartSize(cells[i])
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

  // #region :::::::::::: Cell cloning, insertion and removal

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
            !this.isEdgeValid(
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

  insertNode(options: Graph.InsertNodeOptions = {}): Cell {
    const node = this.createNode(options)
    return this.addCell(node, options.parent, options.index)
  }

  addNode(node: Cell, parent?: Cell, index?: number): Cell {
    return this.addNodes([node], parent, index)[0]
  }

  addNodes(nodes: Cell[], parent?: Cell, index?: number): Cell[] {
    return this.addCells(nodes, parent, index)
  }

  createNode(options: Graph.CreateNodeOptions = {}): Cell {
    const geo = new Geometry(options.x, options.y, options.width, options.height)
    geo.relative = options.relative != null ? options.relative : false
    const node = new Cell(options.data, geo, options.style)
    node.setId(options.id)
    node.asNode(true)
    node.setConnectable(true)

    return node
  }

  insertEdge(options: Graph.InsertEdgeOptions = {}): Cell {
    const edge = this.createEdge(options)
    return this.addEdge(
      edge,
      options.parent,
      options.sourceNode,
      options.targetNode,
      options.index,
    )
  }

  createEdge(options: Graph.CreateEdgeOptions = {}): Cell {
    const geo = new Geometry()
    geo.relative = true

    const edge = new Cell(options.data, geo, options.style)
    edge.setId(options.id)
    edge.asEdge(true)

    return edge
  }

  addEdge(
    edge: Cell,
    parent?: Cell,
    sourceNode?: Cell,
    targetNode?: Cell,
    index?: number,
  ) {
    return this.addCell(edge, parent, index, sourceNode, targetNode)
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
    sourceNode?: Cell,
    targetNode?: Cell,
  ) {
    return this.addCells([cell], parent, index, sourceNode, targetNode)[0]
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
    sourceNode?: Cell,
    targetNode?: Cell,
  ) {
    this.model.batchUpdate(() => {
      this.trigger(
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
                !this.isAllowNegativeCoordinates() &&
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

          if (this.autoSizeCellsOnAdd) {
            this.autoSizeCell(cells[i], true)
          }

          // Extends the parent or constrains the child
          if (
            (extend == null || extend) &&
            this.isExtendParentsOnAdd() &&
            this.isExtendParent(cells[i])
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

        this.trigger(
          Graph.events.cellsAdded,
          { cells, parent, index, sourceNode, targetNode, absolute },
        )
      })
    }
  }

  /**
   * Resizes the specified cell to just fit around the its label
   * and/or children.
   *
   * @param cell `Cells` to be resized.
   * @param  recurse Optional boolean which specifies if all descendants
   * should be autosized. Default is `true`.
   */
  autoSizeCell(cell: Cell, recurse: boolean = true) {
    if (recurse) {
      cell.eachChild(child => this.autoSizeCell(child))
    }

    if (this.getModel().isNode(cell) && this.isAutoSizeCell(cell)) {
      this.updateCellSize(cell)
    }
  }

  /**
   * Removes the given cells from the graph including all connected edges if
   * includeEdges is true.
   */
  removeCells(
    cells: Cell[] = this.getDeletableCells(this.getSelectedCells()),
    includeEdges: boolean = true,
  ) {
    let removingCells: Cell[]

    if (includeEdges) {
      removingCells = this.getDeletableCells(this.addAllEdges(cells))
    } else {
      removingCells = cells.slice()

      // Removes edges that are currently not
      // visible as those cannot be updated
      const edges = this.getDeletableCells(this.getAllEdges(cells))
      const dict = new WeakMap<Cell, boolean>()

      cells.forEach(cell => (dict.set(cell, true)))
      edges.forEach((edge) => {
        if (this.view.getState(edge) == null && !dict.get(edge)) {
          dict.set(edge, true)
          removingCells.push(edge)
        }
      })
    }

    this.model.batchUpdate(() => {
      this.cellsRemoved(removingCells)
      this.trigger(Graph.events.removeCells, {
        includeEdges,
        cells: removingCells,
      })
    })

    return removingCells
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

        this.trigger(Graph.events.cellsRemoved, { cells })
      })
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
    const parent = this.model.getParent(edge)
    const source = this.model.getTerminal(edge, true)

    this.model.batchUpdate(() => {
      if (newEdge == null) {
        newEdge = this.cloneCell(edge) // tslint:disable-line

        // Removes waypoints before/after new cell
        const state = this.view.getState(edge)
        let geo = this.getCellGeometry(newEdge)

        if (geo != null && geo.points != null && state != null) {
          const t = this.view.translate
          const s = this.view.scale
          const idx = util.findNearestSegment(state, (dx + t.x) * s, (dy + t.y) * s)
          geo.points = geo.points.slice(0, idx)

          geo = this.getCellGeometry(edge)

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

      this.trigger(Graph.events.splitEdge, { edge, cells, newEdge, dx, dy })
    })

    return newEdge
  }

  // #endregion

  // #region :::::::::::: Cell visibility

  toggleCells(
    show: boolean,
    cells: Cell[] = this.getSelectedCells(),
    includeEdges: boolean = true,
  ) {
    if (includeEdges) {
      cells = this.addAllEdges(cells) // tslint:disable-line
    }

    this.model.batchUpdate(() => {
      this.setCellsVisibleImpl(cells, show)
      this.trigger(Graph.events.toggleCells, { show, cells, includeEdges })
    })

    return cells
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
    recurse: boolean = false,
    cells: Cell[] = this.getFoldableCells(this.getSelectedCells(), collapse),
    checkFoldable: boolean = false,
  ) {
    this.stopEditing(false)
    this.model.batchUpdate(() => {
      this.cellsFolded(cells, collapse, recurse, checkFoldable)
      this.trigger(Graph.events.foldCells, { collapse, recurse, cells })
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
            (!checkFoldable || this.isCellFoldable(cell, collapse)) &&
            collapse !== this.isCellCollapsed(cell)
          ) {
            this.model.setCollapsed(cell, collapse)
            this.swapBounds(cell, collapse)

            if (this.isExtendParent(cell)) {
              this.extendParent(cell)
            }

            if (recurse) {
              const children = this.model.getChildren(cell)
              this.cellsFolded(children, collapse, recurse)
            }

            this.constrainChild(cell)
          }
        })
        this.trigger(Graph.events.cellsFolded, { cells, collapse, recurse })
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

        if (this.collapseToPreferredSize) {
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

  // #endregion

  // #region :::::::::::: Cell sizing

  updateCellSize(cell: Cell, ignoreChildren: boolean = false) {
    this.model.batchUpdate(() => {
      this.cellSizeUpdated(cell, ignoreChildren)
      this.trigger(Graph.events.updateCellSize, { cell, ignoreChildren })
    })
    return cell
  }

  protected cellSizeUpdated(cell: Cell, ignoreChildren: boolean) {
    if (cell != null) {
      this.model.batchUpdate(() => {
        const size = this.getPreferredSizeForCell(cell)
        let geo = this.model.getGeometry(cell)
        if (size != null && geo != null) {
          const collapsed = this.isCellCollapsed(cell)
          geo = geo.clone()

          if (this.isSwimlane(cell)) {
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
      if (this.getImage(state) != null || style.image != null) {
        if (style.shape === ShapeName.label) {
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
      const image = this.getFoldingImage(state)

      if (image != null) {
        dx += image.width + 8
      }

      // Adds space for label
      let value = this.renderer.getLabelValue(state)
      if (value != null && value.length > 0) {
        if (!this.isHtmlLabel(state.cell)) {
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

        if (this.gridEnabled) {
          width = this.snap(width + this.gridSize / 2)
          height = this.snap(height + this.gridSize / 2)
        }

        result = new Rectangle(0, 0, width, height)
      } else {
        const gs2 = 4 * this.gridSize
        result = new Rectangle(0, 0, gs2, gs2)
      }
    }

    return result
  }

  /**
   * Sets the bounds of the given cell using <resizeCells>. Returns the
   * cell which was passed to the function.
   *
   * Parameters:
   *
   * cell - <Cell> whose bounds should be changed.
   * bounds - <Rect> that represents the new bounds.
   */
  resizeCell(cell: Cell, bounds: Rectangle, recurse?: boolean) {
    return this.resizeCells([cell], [bounds], recurse)[0]
  }

  /**
   * Function: resizeCells
   *
   * Sets the bounds of the given cells and fires a <DomEvent.RESIZE_CELLS>
   * event while the transaction is in progress. Returns the cells which
   * have been passed to the function.
   *
   * Parameters:
   *
   * cells - Array of <Cells> whose bounds should be changed.
   * bounds - Array of <Rects> that represent the new bounds.
   */
  resizeCells(
    cells: Cell[],
    bounds: Rectangle[],
    recurse: boolean = this.isRecursiveResize(),
  ) {
    this.model.batchUpdate(() => {
      this.cellsResized(cells, bounds, recurse)
      this.trigger(Graph.events.resizeCells, { cells, bounds })
    })
    return cells
  }

  /**
   * Sets the bounds of the given cells and fires a <DomEvent.CELLS_RESIZED>
   * event. If <extendParents> is true, then the parent is extended if a
   * child size is changed so that it overlaps with the parent.
   *
   * The following example shows how to control group resizes to make sure
   * that all child cells stay within the group.
   *
   * (code)
   * graph.addListener(DomEvent.CELLS_RESIZED, function(sender, evt)
   * {
   *   var cells = evt.getProperty('cells');
   *
   *   if (cells != null)
   *   {
   *     for (var i = 0; i < cells.length; i++)
   *     {
   *       if (graph.getModel().getChildCount(cells[i]) > 0)
   *       {
   *         var geo = graph.getCellGeometry(cells[i]);
   *
   *         if (geo != null)
   *         {
   *           var children = graph.getChildCells(cells[i], true, true);
   *           var bounds = graph.getBoundingBoxFromGeometry(children, true);
   *
   *           geo = geo.clone();
   *           geo.width = Math.max(geo.width, bounds.width);
   *           geo.height = Math.max(geo.height, bounds.height);
   *
   *           graph.getModel().setGeometry(cells[i], geo);
   *         }
   *       }
   *     }
   *   }
   * });
   * (end)
   *
   * Parameters:
   *
   * cells - Array of <Cells> whose bounds should be changed.
   * bounds - Array of <Rects> that represent the new bounds.
   * recurse - Optional boolean that specifies if the children should be resized.
   */
  cellsResized(
    cells: Cell[],
    bounds: Rectangle[],
    recurse: boolean = false,
  ) {
    if (cells != null && bounds != null && cells.length === bounds.length) {
      this.model.batchUpdate(() => {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          this.cellResized(cells[i], bounds[i], false, recurse)
          if (this.isExtendParent(cells[i])) {
            this.extendParent(cells[i])
          }
          this.constrainChild(cells[i])
        }

        if (this.resetEdgesOnResize) {
          this.resetEdges(cells)
        }

        this.trigger(Graph.events.cellsResized, { cells, bounds })
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
        !this.isAllowNegativeCoordinates()
      ) {
        geo.bounds.x = Math.max(0, geo.bounds.x)
        geo.bounds.y = Math.max(0, geo.bounds.y)
      }

      this.model.batchUpdate(() => {
        if (recurse) {
          this.resizeChildCells(cell, geo!)
        }

        this.model.setGeometry(cell, geo!)
        this.constrainChildCells(cell)
      })
    }
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
   * Constrains the children of the given cell using <constrainChild>.
   */
  constrainChildCells(cell: Cell) {
    cell.eachChild(child => this.constrainChild(child))
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

      if (!this.isCellMovable(cell)) {
        geo.bounds.x = x
        geo.bounds.y = y
      }

      if (!this.isCellResizable(cell)) {
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

  /**
   * Resizes the parents recursively so that they contain the complete area
   * of the resized child cell.
   *
   * Parameters:
   *
   * cell - <Cell> that has been resized.
   */
  extendParent(cell: Cell) {
    if (cell != null) {
      const parent = this.model.getParent(cell)
      let pgeo = this.getCellGeometry(parent!)

      if (parent != null && pgeo != null && !this.isCellCollapsed(parent)) {
        const geo = this.getCellGeometry(cell)

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

  // #endregion

  // #region :::::::::::: Cell moving

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
          const geo = this.getCellGeometry(cells[i])
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
          cells = this.cloneCells(cells, this.isCloneInvalidEdges(), cache)!

          if (target == null) {
            // tslint:disable-next-line
            target = this.getDefaultParent()!
          }
        }

        const previous = this.isAllowNegativeCoordinates()

        if (target != null) {
          this.setAllowNegativeCoordinates(true)
        }

        this.cellsMoved(
          cells, dx, dy,
          !clone && this.isDisconnectOnMove() && this.isAllowDanglingEdges(),
          target == null,
          this.isExtendParentsOnMove() && target == null,
        )

        this.setAllowNegativeCoordinates(previous)

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
  cellsMoved(
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

          if (extend && this.isExtendParent(cells[i])) {
            this.extendParent(cells[i])
          } else if (constrain) {
            this.constrainChild(cells[i])
          }
        }

        if (this.resetEdgesOnMove) {
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

      if (!geo.relative && this.model.isNode(cell) && !this.isAllowNegativeCoordinates()) {
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

  /**
   * Returns the <Rect> inside which a cell is to be kept.
   *
   * Parameters:
   *
   * cell - <Cell> for which the area should be returned.
   */
  getCellContainmentArea(cell: Cell) {
    if (cell != null && !this.model.isEdge(cell)) {
      const parent = this.model.getParent(cell)

      if (parent != null && parent !== this.getDefaultParent()) {
        const g = this.model.getGeometry(parent)

        if (g != null) {
          let x = 0
          let y = 0
          let w = g.bounds.width
          let h = g.bounds.height

          if (this.isSwimlane(parent)) {
            const size = this.getStartSize(parent)

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

  /**
   * Returns the bounds inside which the diagram should be kept as an
   * <Rect>.
   */
  getMaximumGraphBounds() {
    return this.maximumGraphBounds
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
    if (cell != null) {
      let geo = this.getCellGeometry(cell)

      if (geo != null && (this.isConstrainRelativeChildren() || !geo.relative)) {
        const parent = this.model.getParent(cell)!
        // const pgeo = this.getCellGeometry(parent)
        let max = this.getMaximumGraphBounds()

        // Finds parent offset
        if (max != null) {
          const off = this.getBoundingBoxFromGeometry([parent], false)

          if (off != null) {
            max = Rectangle.clone(max)

            max.x -= off.x
            max.y -= off.y
          }
        }

        if (this.isConstrainChild(cell)) {
          let tmp = this.getCellContainmentArea(cell)

          if (tmp != null) {
            const overlap = this.getOverlap(cell)

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

          if (!this.isCellCollapsed(cell)) {
            const desc = this.model.getDescendants(cell)

            for (let i = 0; i < desc.length; i += 1) {
              if (this.isCellVisible(desc[i])) {
                cells.push(desc[i])
              }
            }
          }

          const bbox = this.getBoundingBoxFromGeometry(cells, false)

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

  /**
   * Resets the control points of the edges that are connected to the given
   * cells if not both ends of the edge are in the given cells array.
   *
   * Parameters:
   *
   * cells - Array of <Cells> for which the connected edges should be
   * reset.
   */
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
   *
   * Parameters:
   *
   * edge - <Cell> whose points should be reset.
   */
  resetEdge(edge: Cell) {
    let geo = this.model.getGeometry(edge)
    if (geo != null && geo.points != null && geo.points.length > 0) {
      geo = geo.clone()
      geo.points = []
      this.model.setGeometry(edge, geo)
    }

    return edge
  }

  // #endregion

  // #region :::::::::::: Cell connecting and connection constraints

  /**
   * Returns the constraint used to connect to the outline of the given state.
   */
  getOutlineConstraint(point: Point, terminalState: CellState, me: any) {
    return this.connectionManager.getOutlineConstraint(point, terminalState, me)
  }

  /**
   * Returns an array of all <mxConnectionConstraints> for the given terminal. If
   * the shape of the given terminal is a <mxStencilShape> then the constraints
   * of the corresponding <mxStencil> are returned.
   *
   * Parameters:
   *
   * terminal - <CellState> that represents the terminal.
   * source - Boolean that specifies if the terminal is the source or target.
   */
  getAllConnectionConstraints(
    terminalState: CellState,
    isSource: boolean,
  ) {
    if (
      terminalState != null &&
      terminalState.shape != null &&
      terminalState.shape.stencil != null
    ) {
      return terminalState.shape.stencil.constraints
    }

    return null
  }

  /**
   * Returns an `ConnectionConstraint` that describes the given connection
   * point.
   */
  getConnectionConstraint(
    edgeState: CellState,
    terminalState?: CellState | null,
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

    return new Constraint(point, perimeter, null, dx, dy)
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
          this.setCellStyles(
            isSource ? 'exitX' : 'entryX',
            null,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitY' : 'entryY',
            null,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitDx' : 'entryDx',
            null,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitDy' : 'entryDy',
            null,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitPerimeter' : 'entryPerimeter',
            null,
            [edge],
          )
        } else if (constraint.point != null) {
          this.setCellStyles(
            isSource ? 'exitX' : 'entryX',
            `${constraint.point.x}`,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitY' : 'entryY',
            `${constraint.point.y}`,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitDx' : 'entryDx',
            `${constraint.dx}`,
            [edge],
          )
          this.setCellStyles(
            isSource ? 'exitDy' : 'entryDy',
            `${constraint.dy}`,
            [edge],
          )

          // Only writes 0 since 1 is default
          if (!constraint.perimeter) {
            this.setCellStyles(
              isSource ? 'exitPerimeter' : 'entryPerimeter',
              '0',
              [edge],
            )
          } else {
            this.setCellStyles(
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
    terminalState: CellState,
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

        if (this.getModel().isNode(terminalState.cell)) {
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

  /**
   * Sets the new terminal for the given edge and resets the edge points if
   * <resetEdgesOnConnect> is true. This method fires
   * <DomEvent.CELL_CONNECTED> while the transaction is in progress.
   *
   * Parameters:
   *
   * edge - <Cell> whose terminal should be updated.
   * terminal - <Cell> that represents the new terminal to be used.
   * source - Boolean indicating if the new terminal is the source or target.
   * constraint - <mxConnectionConstraint> to be used for this connection.
   */
  cellConnected(
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
        if (this.isPortsEnabled()) {
          let id = null

          if (terminal != null && this.isPort(terminal)) {
            id = terminal.getId()
            // tslint:disable-next-line
            terminal = this.getTerminalForPort(terminal, isSource)!
          }

          if (id != null) {
            const key = isSource ? 'sourcePort' : 'targetPort'
            this.setCellStyles(key, id, [edge])
          }
        }

        this.model.setTerminal(edge, terminal, isSource)

        if (this.resetEdgesOnConnect) {
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
   * Disconnects the given edges from the terminals which are not in the
   * given array.
   *
   * Parameters:
   *
   * cells - Array of <Cells> to be disconnected.
   */
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

                if (src != null && this.isCellDisconnectable(cells[i], src, true)) {
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

                if (trg != null && this.isCellDisconnectable(cells[i], trg, false)) {
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
   * This implementation always returns false.
   *
   * A typical implementation is the following:
   *
   * (code)
   * graph.isPort (cell)
   * {
   *   var geo = this.getCellGeometry(cell);
   *
   *   return (geo != null) ? geo.relative : false;
   * };
   * (end)
   *
   * Parameters:
   *
   * cell - <Cell> that represents the port.
   */
  isPort(cell: Cell) {
    return false
  }

  /**
   * Returns the terminal to be used for a given port. This implementation
   * always returns the parent cell.
   *
   * Parameters:
   *
   * cell - <Cell> that represents the port.
   * source - If the cell is the source or target port.
   */
  getTerminalForPort(cell: Cell, isSource: boolean) {
    return this.model.getParent(cell)
  }

  /**
   * Returns the offset to be used for the cells inside the given cell. The
   * root and layer cells may be identified using <mxGraphModel.isRoot> and
   * <mxGraphModel.isLayer>. For all other current roots, the
   * <mxGraphView.currentRoot> field points to the respective cell, so that
   * the following holds: cell == this.view.currentRoot. This implementation
   * returns null.
   *
   * Parameters:
   *
   * cell - <Cell> whose offset should be returned.
   */
  getChildOffsetForCell(cell: Cell): Point | null {
    return null
  }

  /**
   * Uses the given cell as the root of the displayed cell hierarchy. If no
   * cell is specified then the selection cell is used. The cell is only used
   * if <isValidRoot> returns true.
   *
   * Parameters:
   *
   * cell - Optional <Cell> to be used as the new root. Default is the
   * selection cell.
   */
  enterGroup(cell: Cell = this.getSelectedCell()) {
    if (cell != null && this.isValidRoot(cell)) {
      this.view.setCurrentRoot(cell)
      this.clearSelection()
    }
  }

  /**
   * Changes the current root to the next valid root in the displayed cell
   * hierarchy.
   */
  exitGroup() {
    const root = this.model.getRoot()
    const current = this.getCurrentRoot()

    if (current != null) {
      let next = this.model.getParent(current)!

      // Finds the next valid root in the hierarchy
      while (next !== root && !this.isValidRoot(next) &&
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
        this.setSelectedCell(current)
      }
    }
  }

  /**
   * Uses the root of the model as the root of the displayed
   * cell hierarchy and selects the previous root.
   */
  home() {
    const current = this.getCurrentRoot()
    if (current != null) {
      this.view.setCurrentRoot(null)
      const state = this.view.getState(current)
      if (state != null) {
        this.setSelectedCell(current)
      }
    }
  }

  /**
   * Returns true if the given cell is a valid root for the cell display
   * hierarchy. This implementation returns true for all non-null values.
   *
   * Parameters:
   *
   * cell - <Cell> which should be checked as a possible root.
   */
  isValidRoot(cell: Cell) {
    return (cell != null)
  }

  // #endregion

  // #region :::::::::::: Graph display

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
    return this.hooks.isCellConnectable
      ? this.hooks.isCellConnectable(cell)
      : this.model.isConnectable(cell)
  }

  /**
   * Returns true if perimeter points should be computed such that the
   * resulting edge has only horizontal or vertical segments.
   */
  isOrthogonal(edgeState: CellState) {
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
  isLoop(state: CellState) {
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
    return this.hooks.isTransparentClickEvent
      ? this.hooks.isTransparentClickEvent(e)
      : false
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
    return this.hooks.isIgnoreTerminalEvent
      ? this.hooks.isIgnoreTerminalEvent(e)
      : false
  }

  // #endregion

  // #region :::::::::::: Validation

  validateEdge(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return this.hooks.validateEdge
      ? this.hooks.validateEdge(edge, source, target)
      : null
  }

  validateCell(cell: Cell, context: any) {
    return this.hooks.validateCell
      ? this.hooks.validateCell(cell, context)
      : null
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

  // #region :::::::::::: Graph appearance

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
  getFoldingImage(state: CellState) {
    if (
      state != null &&
      this.foldingEnabled &&
      !this.getModel().isEdge(state.cell)
    ) {
      const collapsed = this.isCellCollapsed(state.cell)
      if (this.isCellFoldable(state.cell, !collapsed)) {
        return (collapsed) ? this.collapsedImage : this.expandedImage
      }
    }

    return null
  }

  /**
   * Returns the textual representation for the given cell.
   */
  convertValueToString(cell: Cell) {
    const value = this.model.getData(cell)
    if (value != null) {
      if (util.isHTMLNode(value)) {
        return value.nodeName
      }

      if (typeof (value.toString) === 'function') {
        return value.toString()
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
        result = this.convertValueToString(cell)
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
    state: CellState | null,
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

      if (tip == null && state.overlaySet != null) {
        state.overlaySet.forEach((overlay) => {
          const shape = state.overlayMap!.get(overlay)!
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

    tip = this.convertValueToString(cell)

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
  getImage(state: CellState): string | null {
    return (state != null)
      ? state.style.image || null
      : null
  }

  /**
   * Returns the vertical alignment for the given cell state.
   */
  getVerticalAlign(state: CellState): VAlign {
    return state && state.style.verticalAlign || 'middle'
  }

  getAlign(state: CellState): Align {
    return state && state.style.align || 'center'
  }

  /**
   * Returns the indicator color for the given cell state.
   */
  getIndicatorColor(state: CellState) {
    return state && state.style.indicatorColor || null
  }

  getIndicatorDirection(state: CellState) {
    return state && state.style.indicatorDirection || null
  }

  getIndicatorStrokeColor(state: CellState) {
    return state && state.style.indicatorStrokeColor || null
  }

  /**
   * Returns the indicator gradient color for the given cell state.
   */
  getIndicatorGradientColor(state: CellState) {
    return state && state.style.indicatorGradientColor || null
  }

  /**
   * Returns the indicator shape for the given cell state.
   */
  getIndicatorShape(state: CellState) {
    return state && state.style.indicatorShape || null
  }

  /**
   * Returns the indicator image for the given cell state.
   */
  getIndicatorImage(state: CellState) {
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
          return (style.shape === ShapeName.swimlane)
        }
      }
    }

    return false
  }

  // #endregion

  // #region :::::::::::: Graph behaviour

  isResizeContainer() {
    return this.resizeContainer
  }

  setResizeContainer(value: boolean) {
    this.resizeContainer = value
  }

  isEnabled() {
    return this.enabled
  }

  /**
   * Specifies if the graph should allow any interactions.
   */
  setEnabled(value: boolean) {
    this.enabled = value
  }

  isEscapeEnabled() {
    return this.escapeEnabled
  }

  setEscapeEnabled(value: boolean) {
    this.escapeEnabled = value
  }

  isInvokesStopCellEditing() {
    return this.invokesStopCellEditing
  }

  setInvokesStopCellEditing(value: boolean) {
    this.invokesStopCellEditing = value
  }

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

  getGridSize() {
    return this.gridSize
  }

  setGridSize(value: number) {
    this.gridSize = value
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
   * If no cell is specified then this returns true if any
   * cell is currently being edited.
   *
   * Parameters:
   *
   * cell - <Cell> that should be checked.
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
    return this.model.filterCells(cells, cell => this.isCellFoldable(cell, collapse))
  }

  /**
   * Returns true if the given cell is foldable. This implementation
   * returns true if the cell has at least one child and its style
   * does not specify <constants.STYLE_FOLDABLE> to be 0.
   */
  isCellFoldable(cell: Cell, nextCollapseState: boolean) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)

    return (
      this.model.getChildCount(cell) > 0 &&
      style.foldable !== true
    )
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

  // #region :::::::::::: Cell retrieval

  getCurrentRoot() {
    return this.view.currentRoot
  }

  getDefaultParent(): Cell {
    let parent = this.getCurrentRoot()
    if (parent == null) {
      parent = this.defaultParent
      if (parent == null) {
        const root = this.model.getRoot()
        parent = this.model.getChildAt(root, 0)
      }
    }

    return parent!
  }

  setDefaultParent(cell: Cell | null) {
    this.defaultParent = cell
  }

  /**
   * Returns the nearest ancestor of the given cell which is a swimlane, or
   * the given cell, if it is itself a swimlane.
   */
  getSwimlane(cell: Cell) {
    let result = cell
    while (result != null && !this.isSwimlane(result)) {
      result = this.model.getParent(result)!
    }

    return result
  }

  /**
   * Returns the bottom-most swimlane that intersects the given point (x, y)
   * in the cell hierarchy that starts at the given parent.
   */
  getSwimlaneAt(
    x: number,
    y: number,
    parent: Cell = this.getDefaultParent(),
  ): Cell | null {
    const childCount = this.model.getChildCount(parent)
    for (let i = 0; i < childCount; i += 1) {
      const child = this.model.getChildAt(parent, i)!
      const result = this.getSwimlaneAt(x, y, child)

      if (result != null) {
        return result
      }

      if (this.isSwimlane(child)) {
        const state = this.view.getState(child)
        if (this.intersects(state, x, y)) {
          return child
        }
      }
    }

    return null
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
    ignoreFn?: (state: CellState, x?: number, y?: number) => boolean,
  ): Cell | null {
    if (parent == null) {
      // tslint:disable-next-line
      parent = this.getCurrentRoot() || this.model.getRoot()
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
          this.isCellVisible(cell) && (
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
  intersects(state: CellState | null, x: number, y: number) {
    if (state != null) {
      const points = state.absolutePoints
      if (points != null) {
        const t2 = this.tolerance * this.tolerance
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

  /**
   * Returns true if the given coordinate pair is inside the content
   * of the given swimlane.
   */
  hitsSwimlaneContent(swimlane: Cell | null, x: number, y: number) {
    const state = this.getView().getState(swimlane)
    const size = this.getStartSize(swimlane)

    if (state != null) {
      const scale = this.getView().getScale()
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
    const result: Cell[] = []
    const edges: Cell[] = []
    const isCollapsed = this.isCellCollapsed(node)

    node.eachChild((child) => {
      if (isCollapsed || !this.isCellVisible(child)) {
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

  /**
   * Returns the edges between the given source and target. This takes into
   * account collapsed and invisible cells and returns the connected edges
   * as displayed on the screen.
   */
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

  /**
   * Returns an <Point> representing the given event in the unscaled,
   * non-translated coordinate space of <container> and applies the grid.
   *
   * Parameters:
   *
   * evt - Mousevent that contains the mouse pointer location.
   * addOffset - Optional boolean that specifies if the position should be
   * offset by half of the <gridSize>. Default is true.
   */
  getPointForEvent(e: MouseEvent, addOffset: boolean = true) {
    const p = util.clientToGraph(
      this.container,
      DomEvent.getClientX(e),
      DomEvent.getClientY(e),
    )

    const s = this.view.scale
    const tr = this.view.translate
    const off = addOffset ? this.gridSize / 2 : 0

    p.x = this.snap(p.x / s - tr.x - off)
    p.y = this.snap(p.y / s - tr.y - off)

    return p
  }

  /**
   * Returns the child nodes and edges of the given parent that are contained
   * in the given rectangle.
   *
   * @param x X-coordinate of the rectangle.
   * @param y Y-coordinate of the rectangle.
   * @param width Width of the rectangle.
   * @param height Height of the rectangle.
   * @param parent `Cell` that should be used as the root of the recursion.
   * Default is current root of the view or the root of the model.
   * @param result Optional array to store the result in.
   */
  getCellsInRegion(
    x: number,
    y: number,
    width: number,
    height: number,
    parent: Cell = this.getCurrentRoot() || this.model.getRoot(),
    result: Cell[] = [],
  ) {
    if (width > 0 || height > 0) {
      const rect = new Rectangle(x, y, width, height)

      parent && parent.eachChild((cell) => {
        const state = this.view.getState(cell)
        if (state != null && this.isCellVisible(cell)) {
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
    const result: Cell[] = []

    if (rightHalfpane || bottomHalfpane) {
      parent && parent.eachChild((child) => {
        const state = this.view.getState(child)
        if (this.isCellVisible(child) && state != null) {
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
    const roots: Cell[] = []

    let best = null
    let maxDiff = 0

    parent && parent.eachChild((cell) => {
      if (this.model.isNode(cell) && this.isCellVisible(cell)) {
        const conns = this.getConnections(cell, isolate ? parent : null)
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

  // #region :::::::::::: eventloop

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

  // #region :::::::::::: dispose

  private destoryed = false

  get disposed() {
    return this.destoryed
  }

  dispose() {
    if (this.destoryed) {
      return
    }

    this.destoryed = true

    this.changeManager.dispose()
    this.eventloop.dispose()
    this.selection.dispose()
    this.selectionManager.dispose()
    this.connectionManager.dispose()
    this.handlerManager.dispose()
    this.validator.dispose()
    this.viewport.dispose()
    this.cellManager.dispose()

    this.tooltipHandler.dispose()
    this.panningHandler.dispose()
    this.popupMenuHandler.dispose()
    this.selectionHandler.dispose()
    this.graphHandler.dispose()
    this.connectionHandler.dispose()

    if (this.cellEditor != null) {
      this.cellEditor.destroy()
    }

    if (this.view != null) {
      this.view.dispose()
    }

    (this as any).container = null
  }

  // #endregion
}

export namespace Graph {
  export interface Hooks {
    createModel?: (graph: Graph) => Model
    createView?: (graph: Graph) => View
    createRenderer?: (graph: Graph) => Renderer
    createStyleSheet?: (graph: Graph) => StyleSheet
    createSelection?: (graph: Graph) => Selection

    createTooltipHandler?: (graph: Graph) => TooltipHandler
    createConnectionHandler?: (graph: Graph) => ConnectionHandler
    createSelectionHandler?: (graph: Graph) => SelectionHandler
    createGraphHandler?: (graph: Graph) => GraphHandler
    createPanningHandler?: (graph: Graph) => PanningHandler
    createPopupMenuHandler?: (graph: Graph) => PopupMenuHandler
    createNodeHandler?: (graph: Graph, state: CellState) => NodeHandler
    createEdgeHandler?: (graph: Graph, state: CellState) => EdgeHandler
    createElbowEdgeHandler?: (graph: Graph, state: CellState) => EdgeHandler
    createEdgeSegmentHandler?: (graph: Graph, state: CellState) => EdgeHandler

    getTooltip?: (cell: Cell) => string | HTMLElement

    isCellConnectable?: (cell: Cell | null) => boolean
    isTransparentClickEvent?: (e: MouseEvent) => boolean
    isIgnoreTerminalEvent?: (e: MouseEvent) => boolean

    validateCell?: (cell: Cell, context: any) => string | null
    validateEdge?: (
      edge: Cell | null,
      source: Cell | null,
      target: Cell | null,
    ) => string | null
  }

  export interface Options extends Hooks {
    dialect?: Dialect,
    model?: Model,
    styleSheet?: StyleSheet,
    hooks?: Hooks,
  }

  export interface CreateNodeOptions {
    id?: string
    data?: any
    x?: number
    y?: number
    width?: number
    height?: number
    style?: CellStyle
    relative?: boolean
  }

  export interface InsertNodeOptions extends CreateNodeOptions {
    parent?: Cell
    index?: number
  }

  export interface CreateEdgeOptions {
    id?: string | null
    data?: any
    style?: CellStyle
  }

  export interface InsertEdgeOptions extends CreateEdgeOptions {
    parent?: Cell
    index?: number
    sourceNode?: Cell,
    targetNode?: Cell,
  }

  export const events = {
    refresh: 'refresh',
    root: 'root',
    addOverlay: 'addOverlay',
    removeOverlay: 'removeOverlay',
    removeOverlays: 'removeOverlays',
    startEditing: 'startEditing',
    editingStarted: 'editingStarted',
    editingStopped: 'editingStopped',
    labelChanged: 'labelChanged',
    size: 'size',
    alignCells: 'alignCells',
    flipEdge: 'flipEdge',
    orderCells: 'orderCells',
    cellsOrdered: 'cellsOrdered',
    groupCells: 'groupCells',
    ungroupCells: 'ungroupCells',
    removeCellsFromParent: 'removeCellsFromParent',
    addCells: 'addCells',
    cellsAdded: 'cellsAdded',
    removeCells: 'removeCells',
    cellsRemoved: 'cellsRemoved',
    splitEdge: 'splitEdge',
    toggleCells: 'toggleCells',
    foldCells: 'foldCells',
    cellsFolded: 'cellsFolded',
    updateCellSize: 'updateCellSize',
    resizeCells: 'resizeCells',
    cellsResized: 'cellsResized',

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
