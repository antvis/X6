import { Rectangle } from '../geometry'
import { FunctionExt } from '../util'
import { Disablable } from '../entity'
import { Route } from '../route'
import { Model } from '../core/model'
import { Cell } from '../core/cell'
import { View } from '../core/view'
import { State } from '../core/state'
import { Renderer } from '../core/renderer'
import { FullOptions } from '../option'
import { Dialect, Style, Size } from '../types'
import { Multiplicity, Image } from '../struct'
import {
  CellEditor,
  TooltipHandler,
  CursorHandler,
  SelectionHandler,
  ConnectionHandler,
  GuideHandler,
  SelectCellHandler,
  MovingHandler,
  PanningHandler,
  ContextMenuHandler,
  RubberbandHandler,
  KeyboardHandler,
  MouseWheelHandler,
  NodeHandler,
  EdgeHandler,
  EdgeElbowHandler,
  EdgeSegmentHandler,
} from '../handler'
import { hook } from './decorator'
import { EventArgs } from './events'
import { Selection } from './selection'
import { SelectionManager } from './selection-manager'
import { ChangeManager } from './change-manager'
import { EventLoopManager } from './eventloop-manager'
import { ViewportManager } from './viewport-manager'
import { ValidationManager } from './validation-manager'
import { PageBreakManager } from './pagebreak-manager'
import { CreationManager } from './creation-manager'
import { ConnectionManager } from './connection-manager'
import { StyleManager } from './style-manager'
import { RetrievalManager } from './retrieval-manager'
import { CollapseManager } from './collapse-manager'
import { OverlayManager } from './overlay-manager'
import { GroupManager } from './group-manager'
import { SizeManager } from './size-manager'
import { EditingManager } from './editing-manager'
import { MovingManager } from './moving-manager'
import { ZoomManager } from './zoom-manager'
import { PanningManager } from './panning-manager'
import { LayerManager } from './layer-manager'

export class BaseGraph extends Disablable<EventArgs>
  implements GraphProperties, CompositeOptions {
  public options: FullOptions
  public container: HTMLElement
  public model: Model
  public view: View
  public renderer: Renderer

  public cellEditor: CellEditor
  public changeManager: ChangeManager
  public eventloopManager: EventLoopManager
  public viewportManager: ViewportManager
  public pageBreakManager: PageBreakManager
  public zoomManager: ZoomManager
  public selection: Selection
  public selectionManager: SelectionManager
  public creationManager: CreationManager
  public connectionManager: ConnectionManager
  public retrievalManager: RetrievalManager
  public styleManager: StyleManager
  public validationManager: ValidationManager
  public collapseManager: CollapseManager
  public overlayManager: OverlayManager
  public groupManager: GroupManager
  public sizeManager: SizeManager
  public editingManager: EditingManager
  public movingManager: MovingManager
  public panningManager: PanningManager
  public layerManager: LayerManager

  public tooltipHandler: TooltipHandler
  public cursorHandler: CursorHandler
  public selectionHandler: SelectionHandler
  public connectionHandler: ConnectionHandler
  public guideHandler: GuideHandler
  public selectHandler: SelectCellHandler
  public movingHandler: MovingHandler
  public panningHandler: PanningHandler
  public contextMenuHandler: ContextMenuHandler
  public rubberbandHandler: RubberbandHandler
  public keyboardHandler: KeyboardHandler
  public mouseWheelHandler: MouseWheelHandler

  /**
   * Get the native value of hooked method.
   */
  public getNativeValue: <T>() => T | null

  public getModel() {
    return this.model
  }

  public getView() {
    return this.view
  }

  protected createManagers() {
    this.changeManager = new ChangeManager(this as any)
    this.eventloopManager = new EventLoopManager(this as any)
    this.viewportManager = new ViewportManager(this as any)
    this.pageBreakManager = new PageBreakManager(this as any)
    this.zoomManager = new ZoomManager(this as any)
    this.selectionManager = new SelectionManager(this as any)
    this.creationManager = new CreationManager(this as any)
    this.connectionManager = new ConnectionManager(this as any)
    this.retrievalManager = new RetrievalManager(this as any)
    this.styleManager = new StyleManager(this as any)
    this.validationManager = new ValidationManager(this as any)
    this.collapseManager = new CollapseManager(this as any)
    this.overlayManager = new OverlayManager(this as any)
    this.groupManager = new GroupManager(this as any)
    this.sizeManager = new SizeManager(this as any)
    this.editingManager = new EditingManager(this as any)
    this.movingManager = new MovingManager(this as any)
    this.panningManager = new PanningManager(this as any)
    this.layerManager = new LayerManager(this as any)
  }

  protected createHandlers() {
    // The order of the following initializations should not be modified.
    this.cellEditor = new CellEditor(this as any)
    this.tooltipHandler = this.createTooltipHandler()
    this.cursorHandler = this.createCursorHandler()
    this.selectionHandler = this.createSelectionHandler()
    this.connectionHandler = this.createConnectionHandler()
    this.guideHandler = this.createGuideHandler()
    this.selectHandler = this.createSelectHandler()
    this.movingHandler = this.createMovingHandler()
    this.panningHandler = this.createPanningHandler()
    this.contextMenuHandler = this.createContextMenuHandler()
    this.rubberbandHandler = this.createRubberbandHandler()
    this.keyboardHandler = this.createKeyboardHandler()
    this.mouseWheelHandler = this.creatMouseWheelHandler()
  }

  @hook()
  createKeyboardHandler() {
    return new KeyboardHandler(this as any)
  }

  @hook()
  creatMouseWheelHandler() {
    return new MouseWheelHandler(this as any)
  }

  @hook()
  createTooltipHandler() {
    return new TooltipHandler(this as any)
  }

  @hook()
  createCursorHandler() {
    return new CursorHandler(this as any)
  }

  @hook()
  createGuideHandler() {
    return new GuideHandler(this as any)
  }

  @hook()
  createSelectHandler() {
    return new SelectCellHandler(this as any)
  }

  @hook()
  createConnectionHandler() {
    return new ConnectionHandler(this as any)
  }

  @hook()
  createSelectionHandler() {
    return new SelectionHandler(this as any)
  }

  @hook()
  createMovingHandler() {
    return new MovingHandler(this as any)
  }

  @hook()
  createPanningHandler() {
    return new PanningHandler(this as any)
  }

  @hook()
  createContextMenuHandler() {
    return new ContextMenuHandler(this as any)
  }

  @hook()
  createRubberbandHandler() {
    return new RubberbandHandler(this as any)
  }

  @hook(null, true)
  createCellHandler(state: State | null) {
    if (state != null) {
      if (this.model.isEdge(state.cell)) {
        const sourceState = state.getVisibleTerminalState(true)
        const targetState = state.getVisibleTerminalState(false)
        const geo = state.cell.getGeometry()
        const edgeFn = this.view.getRoute(
          state,
          geo != null ? geo.points : null,
          sourceState!,
          targetState!,
        )
        return this.createEdgeHandler(state, edgeFn)
      }

      return this.createNodeHandler(state)
    }

    return null
  }

  @hook()
  createNodeHandler(state: State) {
    return new NodeHandler(this as any, state)
  }

  @hook()
  createEdgeHandler(state: State, edgeFn: Route.Router | null) {
    let result = null

    if (
      edgeFn === Route.loop ||
      edgeFn === Route.elbow ||
      edgeFn === Route.sideToSide ||
      edgeFn === Route.topToBottom
    ) {
      result = this.createElbowEdgeHandler(state)
    } else if (edgeFn === Route.segment || edgeFn === Route.orth) {
      result = this.createEdgeSegmentHandler(state)
    } else {
      return (
        FunctionExt.call(this.options.createEdgeHandler, this, this, state) ||
        new EdgeHandler(this as any, state)
      )
    }

    return result
  }

  @hook()
  createEdgeSegmentHandler(state: State) {
    return new EdgeSegmentHandler(this as any, state)
  }

  @hook()
  createElbowEdgeHandler(state: State) {
    return new EdgeElbowHandler(this as any, state)
  }

  // #region IDisposable

  protected disposeManagers() {
    this.changeManager.dispose()
    this.eventloopManager.dispose()
    this.viewportManager.dispose()
    this.pageBreakManager.dispose()
    this.zoomManager.dispose()
    this.selection.dispose()
    this.selectionManager.dispose()
    this.creationManager.dispose()
    this.connectionManager.dispose()
    this.retrievalManager.dispose()
    this.styleManager.dispose()
    this.validationManager.dispose()
    this.collapseManager.dispose()
    this.overlayManager.dispose()
    this.groupManager.dispose()
    this.sizeManager.dispose()
    this.editingManager.dispose()
    this.movingManager.dispose()
  }

  protected disposeHandlers() {
    if (this.cellEditor != null) {
      this.cellEditor.dispose()
    }
    this.tooltipHandler.dispose()
    this.cursorHandler.dispose()
    this.selectionHandler.dispose()
    this.connectionHandler.dispose()
    this.guideHandler.dispose()
    this.selectHandler.dispose()
    this.movingHandler.dispose()
    this.panningHandler.dispose()
    this.contextMenuHandler.dispose()
    this.rubberbandHandler.dispose()
    this.keyboardHandler.dispose()
    this.mouseWheelHandler.dispose()
  }

  @Disablable.dispose()
  dispose() {
    this.disposeManagers()
    this.disposeHandlers()

    if (this.view != null) {
      this.view.dispose()
    }
  }

  // #endregion

  // #region Properties

  get prefixCls() {
    return this.options.prefixCls
  }

  get dialect() {
    return this.options.dialect
  }

  get antialiased() {
    return this.options.antialiased
  }

  isInfinite() {
    return this.options.infinite
  }

  get infinite() {
    return this.isInfinite()
  }

  getTolerance() {
    return this.options.tolerance
  }

  setTolerance(tolerance: number) {
    if (this.getTolerance() !== tolerance) {
      this.options.tolerance = tolerance
    }
    return this
  }

  get tolerance() {
    return this.getTolerance()
  }

  set tolerance(tolerance: number) {
    this.setTolerance(tolerance)
  }

  getBackgroundColor() {
    return this.options.backgroundColor
  }

  setBackgroundColor(color: string | null, refresh: boolean = true) {
    if (this.getBackgroundColor() !== color) {
      this.options.backgroundColor = color
      if (refresh) {
        this.view.validateBackgroundStyle()
      }
    }
    return this
  }

  get backgroundColor() {
    return this.getBackgroundColor()
  }

  set backgroundColor(color: string | null) {
    this.setBackgroundColor(color)
  }

  getBorder() {
    return this.options.border
  }

  setBorder(border: number) {
    if (this.getBorder() !== border) {
      this.options.border = border
    }
    return this
  }

  get border() {
    return this.getBorder()
  }

  set border(border: number) {
    this.setBorder(border)
  }

  getWarningImage() {
    return this.options.warningImage
  }

  setWarningImage(image: Image, refresh: boolean = true) {
    if (this.getWarningImage() !== image) {
      this.options.warningImage = image
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get warningImage() {
    return this.getWarningImage()
  }

  set warningImage(image: Image) {
    this.setWarningImage(image)
  }

  getAlternateEdgeStyle() {
    return this.options.alternateEdgeStyle
  }

  setAlternateEdgeStyle(style: Style | null) {
    if (this.getAlternateEdgeStyle() !== style) {
      this.options.alternateEdgeStyle = style
    }
    return this
  }

  get alternateEdgeStyle() {
    return this.getAlternateEdgeStyle()
  }

  set alternateEdgeStyle(style: Style | null) {
    this.setAlternateEdgeStyle(style)
  }

  isNativeDblClickEnabled() {
    return this.options.nativeDblClickEnabled
  }

  setNativeDblClickEnabled(enabled: boolean) {
    if (this.isNativeDblClickEnabled() !== enabled) {
      this.options.nativeDblClickEnabled = enabled
    }
    return this
  }

  toggleNativeDblClickEnabled() {
    if (this.isNativeDblClickEnabled()) {
      this.disableNativeDblClick()
    } else {
      this.enableNativeDblClick()
    }
  }

  enableNativeDblClick() {
    return this.setNativeDblClickEnabled(true)
  }

  disableNativeDblClick() {
    return this.setNativeDblClickEnabled(false)
  }

  get nativeDblClickEnabled() {
    return this.isNativeDblClickEnabled()
  }

  set nativeDblClickEnabled(enabled: boolean) {
    this.setNativeDblClickEnabled(enabled)
  }

  isDoubleTapEnabled() {
    return this.options.doubleTapEnabled
  }

  setDoubleTapEnabled(enabled: boolean) {
    if (this.isDoubleTapEnabled() !== enabled) {
      this.options.doubleTapEnabled = enabled
    }
    return this
  }

  toggleDoubleTapEnabled() {
    if (this.isDoubleTapEnabled()) {
      this.disableDoubleTap()
    } else {
      this.enableDoubleTap()
    }
  }

  enableDoubleTap() {
    return this.setDoubleTapEnabled(true)
  }

  disableDoubleTap() {
    return this.setDoubleTapEnabled(false)
  }

  get doubleTapEnabled() {
    return this.isDoubleTapEnabled()
  }

  set doubleTapEnabled(enabled: boolean) {
    this.setDoubleTapEnabled(enabled)
  }

  getDoubleTapTimeout() {
    return this.options.doubleTapTimeout
  }

  setDoubleTapTimeout(timeout: number) {
    if (this.getDoubleTapTimeout() !== timeout) {
      this.options.doubleTapTimeout = timeout
    }
    return this
  }

  get doubleTapTimeout() {
    return this.getDoubleTapTimeout()
  }

  set doubleTapTimeout(timeout: number) {
    this.setDoubleTapTimeout(timeout)
  }

  getDoubleTapTolerance() {
    return this.options.doubleTapTolerance
  }

  setDoubleTapTolerance(tol: number) {
    if (this.getDoubleTapTolerance() !== tol) {
      this.options.doubleTapTolerance = tol
    }
    return this
  }

  get doubleTapTolerance() {
    return this.getDoubleTapTolerance()
  }

  set doubleTapTolerance(tol: number) {
    this.setDoubleTapTolerance(tol)
  }

  isTapAndHoldEnabled() {
    return this.options.tapAndHoldEnabled
  }

  setTapAndHoldEnabled(enabled: boolean) {
    if (this.isTapAndHoldEnabled() !== enabled) {
      this.options.tapAndHoldEnabled = enabled
    }
    return this
  }

  toggleTapAndHoldEnabled() {
    if (this.isTapAndHoldEnabled()) {
      this.disableTapAndHold()
    } else {
      this.enableTapAndHold()
    }
    return this
  }

  enableTapAndHold() {
    return this.setTapAndHoldEnabled(true)
  }

  disableTapAndHold() {
    return this.setTapAndHoldEnabled(true)
  }

  get tapAndHoldEnabled() {
    return this.isTapAndHoldEnabled()
  }

  set tapAndHoldEnabled(enabled: boolean) {
    this.setTapAndHoldEnabled(enabled)
  }

  getTapAndHoldDelay() {
    return this.options.tapAndHoldDelay
  }

  setTapAndHoldDelay(delay: number) {
    if (this.getTapAndHoldDelay() !== delay) {
      this.options.tapAndHoldDelay = delay
    }
    return this
  }

  get tapAndHoldDelay() {
    return this.getTapAndHoldDelay()
  }

  set tapAndHoldDelay(delay: number) {
    this.setTapAndHoldDelay(delay)
  }

  isEscapeEnabled() {
    return this.options.keyboard.escape
  }

  setEscapeEnabled(enabled: boolean) {
    if (this.isEscapeEnabled() !== enabled) {
      this.options.keyboard.escape = enabled
    }
    return this
  }

  toggleEscapeEnabled() {
    if (this.isEscapeEnabled()) {
      this.disableEscape()
    } else {
      this.enableEscape()
    }
    return this
  }

  enableEscape() {
    return this.setEscapeEnabled(true)
  }

  disableEscape() {
    return this.setEscapeEnabled(false)
  }

  get escapeEnabled() {
    return this.isEscapeEnabled()
  }

  set escapeEnabled(enabled: boolean) {
    this.setEscapeEnabled(enabled)
  }

  isAutoScroll() {
    return this.options.autoScroll
  }

  setAutoScroll(auto: boolean) {
    if (this.isAutoScroll() !== auto) {
      this.options.autoScroll = auto
    }
    return this
  }

  toggleAutoScroll() {
    if (this.isAutoScroll()) {
      this.disableAutoScroll()
    } else {
      this.enableAutoScroll()
    }
    return this
  }

  enableAutoScroll() {
    return this.setAutoScroll(true)
  }

  disableAutoScroll() {
    return this.setAutoScroll(false)
  }

  get autoScroll() {
    return this.isAutoScroll()
  }

  set autoScroll(auto: boolean) {
    this.setAutoScroll(auto)
  }

  isIgnoreScrollbars() {
    return this.options.ignoreScrollbars
  }

  setIgnoreScrollbars(ignore: boolean) {
    if (this.isIgnoreScrollbars() !== ignore) {
      this.options.ignoreScrollbars = ignore
    }
    return this
  }

  get ignoreScrollbars() {
    return this.isIgnoreScrollbars()
  }

  set ignoreScrollbars(ignore: boolean) {
    this.setIgnoreScrollbars(ignore)
  }

  isTranslateToScrollPosition() {
    return this.options.translateToScrollPosition
  }

  setTranslateToScrollPosition(v: boolean) {
    if (this.isTranslateToScrollPosition() !== v) {
      this.options.translateToScrollPosition = v
    }
    return this
  }

  get translateToScrollPosition() {
    return this.isTranslateToScrollPosition()
  }

  set translateToScrollPosition(v: boolean) {
    this.setTranslateToScrollPosition(v)
  }

  isTimerAutoScroll() {
    return this.options.timerAutoScroll
  }

  setTimerAutoScroll(auto: boolean) {
    if (this.isTimerAutoScroll() !== auto) {
      this.options.timerAutoScroll = auto
    }
    return this
  }

  get timerAutoScroll() {
    return this.isTimerAutoScroll()
  }

  set timerAutoScroll(auto: boolean) {
    this.setTimerAutoScroll(auto)
  }

  isAutoPanningAllowed() {
    return this.options.allowAutoPanning
  }

  setAutoPanningAllowed(enabled: boolean) {
    if (this.isAutoPanningAllowed() !== enabled) {
      this.options.allowAutoPanning = enabled
    }
    return this
  }

  toggleAutoPanning() {
    if (this.isAutoPanningAllowed()) {
      this.disableAutoPanning()
    } else {
      this.enableAutoPanning()
    }
    return this
  }

  enableAutoPanning() {
    return this.setAutoPanningAllowed(true)
  }

  disableAutoPanning() {
    return this.setAutoPanningAllowed(false)
  }

  get allowAutoPanning() {
    return this.isAutoPanningAllowed()
  }

  set allowAutoPanning(enabled: boolean) {
    this.setAutoPanningAllowed(enabled)
  }

  isUseScrollbarsForPanning() {
    return this.options.useScrollbarsForPanning
  }

  setUseScrollbarsForPanning(enabled: boolean) {
    if (this.isUseScrollbarsForPanning() !== enabled) {
      this.options.useScrollbarsForPanning = enabled
    }
    return this
  }

  get useScrollbarsForPanning() {
    return this.isUseScrollbarsForPanning()
  }

  set useScrollbarsForPanning(enabled: boolean) {
    this.setUseScrollbarsForPanning(enabled)
  }

  isAutoExtend() {
    return this.options.autoExtend
  }

  setAutoExtend(auto: boolean) {
    if (this.isAutoExtend() !== auto) {
      this.options.autoExtend = auto
    }
    return this
  }

  toggleAutoExtend() {
    if (this.isAutoExtend()) {
      this.disableAutoExtend()
    } else {
      this.enableAutoExtend()
    }
    return this
  }

  enableAutoExtend() {
    return this.setAutoExtend(true)
  }

  disableAutoExtend() {
    return this.setAutoExtend(false)
  }

  get autoExtend() {
    return this.isAutoExtend()
  }

  set autoExtend(auto: boolean) {
    this.setAutoExtend(auto)
  }

  getMaxGraphBounds() {
    return this.options.maxGraphBounds
  }

  setMaxGraphBounds(bounds: Rectangle | null) {
    if (this.getMaxGraphBounds() !== bounds) {
      this.options.maxGraphBounds = bounds
    }
    return this
  }

  get maxGraphBounds() {
    return this.getMaxGraphBounds()
  }

  set maxGraphBounds(bounds: Rectangle | null) {
    this.setMaxGraphBounds(bounds)
  }

  getMinGraphSize() {
    return this.options.minGraphSize
  }

  setMinGraphSize(size: Size | null) {
    if (this.getMinGraphSize() !== size) {
      this.options.minGraphSize = size
    }
    return this
  }

  get minGraphSize() {
    return this.getMinGraphSize()
  }

  set minGraphSize(size: Size | null) {
    this.setMinGraphSize(size)
  }

  getMinContainerSize() {
    return this.options.minContainerSize
  }

  setMinContainerSize(size: Size | null) {
    if (this.getMinContainerSize() !== size) {
      this.options.minContainerSize = size
    }
    return this
  }

  get minContainerSize() {
    return this.getMinContainerSize()
  }

  set minContainerSize(size: Size | null) {
    this.setMinContainerSize(size)
  }

  getMaxContainerSize() {
    return this.options.maxContainerSize
  }

  setMaxContainerSize(size: Size | null) {
    if (this.getMaxContainerSize() !== size) {
      this.options.maxContainerSize = size
    }
    return this
  }

  get maxContainerSize() {
    return this.getMaxContainerSize()
  }

  set maxContainerSize(size: Size | null) {
    this.setMaxContainerSize(size)
  }

  isAutoResizeContainer() {
    return this.options.autoResizeContainer
  }

  setAutoResizeContainer(auto: boolean) {
    if (this.isAutoResizeContainer() !== auto) {
      this.options.autoResizeContainer = auto
    }
    return this
  }

  enableAutoResizeContainer() {
    return this.setAutoResizeContainer(true)
  }

  disableAutoResizeContainer() {
    return this.setAutoResizeContainer(false)
  }

  get autoResizeContainer() {
    return this.isAutoResizeContainer()
  }

  set autoResizeContainer(auto: boolean) {
    this.setAutoResizeContainer(auto)
  }

  isResetViewOnRootChange() {
    return this.options.resetViewOnRootChange
  }

  setResetViewOnRootChange(v: boolean) {
    if (this.isResetViewOnRootChange() !== v) {
      this.options.resetViewOnRootChange = v
    }
    return this
  }

  get resetViewOnRootChange() {
    return this.isResetViewOnRootChange()
  }

  set resetViewOnRootChange(v: boolean) {
    this.setResetViewOnRootChange(v)
  }

  isKeepSelectionVisibleOnZoom() {
    return this.options.keepSelectionVisibleOnZoom
  }

  setKeepSelectionVisibleOnZoom(v: boolean) {
    if (this.isKeepSelectionVisibleOnZoom() !== v) {
      this.options.keepSelectionVisibleOnZoom = v
    }
    return this
  }

  get keepSelectionVisibleOnZoom() {
    return this.isKeepSelectionVisibleOnZoom()
  }

  set keepSelectionVisibleOnZoom(v: boolean) {
    this.setKeepSelectionVisibleOnZoom(v)
  }

  isCenterZoom() {
    return this.options.centerZoom
  }

  setCenterZoom(v: boolean) {
    if (this.isCenterZoom() !== v) {
      this.options.centerZoom = v
    }
    return this
  }

  get centerZoom() {
    return this.isCenterZoom()
  }

  set centerZoom(v: boolean) {
    this.setCenterZoom(v)
  }

  getScaleFactor() {
    return this.options.scaleFactor
  }

  setScaleFactor(factor: number) {
    if (this.getScaleFactor() !== factor) {
      this.options.scaleFactor = factor
    }
    return this
  }

  get scaleFactor() {
    return this.getScaleFactor()
  }

  set scaleFactor(factor: number) {
    this.setScaleFactor(factor)
  }

  getMinScale() {
    return this.options.minScale
  }

  setMinScale(minScale: number) {
    if (this.getMinScale() !== minScale) {
      this.options.minScale = minScale
    }
    return this
  }

  get minScale() {
    return this.getMinScale()
  }

  set minScale(minScale: number) {
    this.setMinScale(minScale)
  }

  getMaxScale() {
    return this.options.maxScale
  }

  setMaxScale(maxScale: number) {
    if (this.getMaxScale() !== maxScale) {
      this.options.maxScale = maxScale
    }
    return this
  }

  get maxScale() {
    return this.getMaxScale()
  }

  set maxScale(maxScale: number) {
    this.setMaxScale(maxScale)
  }

  getMinFitScale() {
    return this.options.minFitScale
  }

  setMinFitScale(minFitScale: number) {
    if (this.getMinFitScale() !== minFitScale) {
      this.options.minFitScale = minFitScale
    }
    return this
  }

  get minFitScale() {
    return this.getMinFitScale()
  }

  set minFitScale(minFitScale: number) {
    this.setMinFitScale(minFitScale)
  }

  getMaxFitScale() {
    return this.options.maxFitScale
  }

  setMaxFitScale(maxFitScale: number) {
    if (this.getMaxFitScale() !== maxFitScale) {
      this.options.maxFitScale = maxFitScale
    }
    return this
  }

  get maxFitScale() {
    return this.getMaxFitScale()
  }

  set maxFitScale(maxFitScale: number) {
    this.setMaxFitScale(maxFitScale)
  }

  isPortsEnabled() {
    return this.options.portsEnabled
  }

  setPortsEnabled(v: boolean) {
    if (this.isPortsEnabled() !== v) {
      this.options.portsEnabled = v
    }
    return this
  }

  togglePortsEnabled() {
    if (this.isPortsEnabled()) {
      this.disablePorts()
    } else {
      this.enablePorts()
    }
    return this
  }

  enablePorts() {
    return this.setPortsEnabled(true)
  }

  disablePorts() {
    return this.setPortsEnabled(false)
  }

  get portsEnabled() {
    return this.isPortsEnabled()
  }

  set portsEnabled(v: boolean) {
    this.setPortsEnabled(v)
  }

  isPageVisible() {
    return this.options.pageVisible
  }

  setPageVisible(visible: boolean) {
    if (this.isPageVisible() !== visible) {
      this.options.pageVisible = visible
      this.view.validateBackground()
    }
    return this
  }

  togglePageVisible() {
    if (this.isPageVisible()) {
      this.hidePage()
    } else {
      this.showPage()
    }
  }

  showPage() {
    return this.setPageVisible(true)
  }

  hidePage() {
    return this.setPageVisible(false)
  }

  get pageVisible() {
    return this.isPageVisible()
  }

  getPageScale() {
    return this.options.pageScale
  }

  setPageScale(scale: number, refresh: boolean = true) {
    if (this.getPageScale() !== scale) {
      this.options.pageScale = scale
      if (refresh && this.isPageVisible()) {
        this.sizeDidChange()
        this.view.validateBackground()
      }
    }
  }

  get pageScale() {
    return this.getPageScale()
  }

  set pageScale(scale: number) {
    this.setPageScale(scale)
  }

  getPageFormat() {
    return this.options.pageFormat
  }

  setPageFormat(size: Size, refresh: boolean = true) {
    if (this.getPageFormat() !== size) {
      this.options.pageFormat = size
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get pageFormat() {
    return this.getPageFormat()
  }

  set pageFormat(size: Size) {
    this.setPageFormat(size)
  }

  isPreferPageSize() {
    return this.options.preferPageSize
  }

  setPreferPageSize(v: boolean) {
    if (this.isPreferPageSize() !== v) {
      this.options.preferPageSize = v
    }
    return this
  }

  get preferPageSize() {
    return this.isPreferPageSize()
  }

  set preferPageSize(v: boolean) {
    this.setPreferPageSize(v)
  }

  getMultiplicities() {
    return this.options.multiplicities
  }

  setMultiplicities(multiplicities: Multiplicity[] | null) {
    if (this.getMultiplicities() !== multiplicities) {
      this.options.multiplicities = multiplicities
    }
    return this
  }

  get multiplicities() {
    return this.getMultiplicities()
  }

  set multiplicities(multiplicities: Multiplicity[] | null) {
    this.setMultiplicities(multiplicities)
  }

  // #region cells

  isCellsResizable() {
    return this.options.resize.enabled
  }

  setCellsResizable(v: boolean) {
    if (this.isCellsResizable() !== v) {
      this.options.resize.enabled = v
    }
    return this
  }

  get cellsResizable() {
    return this.isCellsResizable()
  }

  set cellsResizable(v: boolean) {
    this.setCellsResizable(v)
  }

  isCellsRotatable() {
    return this.options.rotate.enabled
  }

  setCellsRotatable(v: boolean) {
    if (this.isCellsRotatable() !== v) {
      this.options.rotate.enabled = v
    }
    return this
  }

  get cellsRotatable() {
    return this.isCellsRotatable()
  }

  set cellsRotatable(v: boolean) {
    this.setCellsRotatable(v)
  }

  isCellsCloneable() {
    return this.options.cellsCloneable
  }

  setCellsCloneable(cloneable: boolean) {
    if (this.isCellsCloneable() !== cloneable) {
      this.options.cellsCloneable = cloneable
    }
    return this
  }

  get cellsCloneable() {
    return this.isCellsCloneable()
  }

  set cellsCloneable(cloneable: boolean) {
    this.setCellsCloneable(cloneable)
  }

  isCellsSelectable() {
    return this.options.cellsSelectable
  }

  setCellsSelectable(selectable: boolean) {
    if (this.isCellsSelectable() !== selectable) {
      this.options.cellsSelectable = selectable
    }
    return this
  }

  get cellsSelectable() {
    return this.isCellsSelectable()
  }

  set cellsSelectable(selectable: boolean) {
    this.setCellsSelectable(selectable)
  }

  isCellsDeletable() {
    return this.options.cellsDeletable
  }

  setCellsDeletable(deletable: boolean) {
    if (this.isCellsDeletable() !== deletable) {
      this.options.cellsDeletable = deletable
    }
    return this
  }

  get cellsDeletable() {
    return this.isCellsDeletable()
  }

  set cellsDeletable(deletable: boolean) {
    this.setCellsDeletable(deletable)
  }

  isCellsMovable() {
    return this.options.cellsMovable
  }

  setCellsMovable(movable: boolean) {
    if (this.isCellsMovable() !== movable) {
      this.options.cellsMovable = movable
    }
    return this
  }

  get cellsMovable() {
    return this.isCellsMovable()
  }

  set cellsMovable(movable: boolean) {
    this.setCellsMovable(movable)
  }

  isCellsBendable() {
    return this.options.cellsBendable
  }

  setCellsBendable(bendable: boolean) {
    if (this.isCellsBendable() !== bendable) {
      this.options.cellsBendable = bendable
    }
    return this
  }

  get cellsBendable() {
    return this.isCellsBendable()
  }

  set cellsBendable(bendable: boolean) {
    this.setCellsBendable(bendable)
  }

  isCellsEditable() {
    return this.options.cellsEditable
  }

  setCellsEditable(editable: boolean) {
    if (this.isCellsEditable() !== editable) {
      this.options.cellsEditable = editable
    }
    return this
  }

  get cellsEditable() {
    return this.isCellsEditable()
  }

  set cellsEditable(editable: boolean) {
    this.setCellsEditable(editable)
  }

  isCellsDisconnectable() {
    return this.options.cellsDisconnectable
  }

  setCellsDisconnectable(disconnectable: boolean) {
    if (this.isCellsDisconnectable() !== disconnectable) {
      this.options.cellsDisconnectable = disconnectable
    }
    return this
  }

  get cellsDisconnectable() {
    return this.isCellsDisconnectable()
  }

  set cellsDisconnectable(disconnectable: boolean) {
    this.setCellsDisconnectable(disconnectable)
  }

  isCellsLocked() {
    return this.options.cellsLocked
  }

  setCellsLocked(locked: boolean, refresh: boolean = true) {
    if (this.isCellsLocked() !== locked) {
      this.options.cellsLocked = locked
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get cellsLocked() {
    return this.isCellsLocked()
  }

  set cellsLocked(locked: boolean) {
    this.setCellsLocked(locked)
  }

  isDropEnabled() {
    return this.options.dropEnabled
  }

  setDropEnabled(dropable: boolean) {
    if (this.isDropEnabled() !== dropable) {
      this.options.dropEnabled = dropable
    }
    return this
  }

  get dropEnabled() {
    return this.isDropEnabled()
  }

  set dropEnabled(dropable: boolean) {
    this.setDropEnabled(dropable)
  }

  isRemoveCellsFromParentAllowed() {
    return this.options.allowRemoveCellsFromParent
  }

  setRemoveCellsFromParentAllowed(allowed: boolean) {
    if (this.isRemoveCellsFromParentAllowed() !== allowed) {
      this.options.allowRemoveCellsFromParent = allowed
    }
    return this
  }

  get allowRemoveCellsFromParent() {
    return this.isRemoveCellsFromParentAllowed()
  }

  set allowRemoveCellsFromParent(allowed: boolean) {
    this.setRemoveCellsFromParentAllowed(allowed)
  }

  isAutoRemoveEmptyParent() {
    return this.options.autoRemoveEmptyParent
  }

  setAutoRemoveEmptyParent(auto: boolean) {
    if (this.isAutoRemoveEmptyParent() !== auto) {
      this.options.autoRemoveEmptyParent = auto
    }
    return this
  }

  get autoRemoveEmptyParent() {
    return this.isAutoRemoveEmptyParent()
  }

  set autoRemoveEmptyParent(auto: boolean) {
    this.setAutoRemoveEmptyParent(auto)
  }

  isExtendParents() {
    return this.options.extendParents
  }

  setExtendParents(v: boolean) {
    if (this.isExtendParents() !== v) {
      this.options.extendParents = v
    }
    return this
  }

  get extendParents() {
    return this.isExtendParents()
  }

  set extendParents(v: boolean) {
    this.setExtendParents(v)
  }

  isExtendParentsOnAdd() {
    return this.options.extendParentsOnAdd
  }

  setExtendParentsOnAdd(v: boolean) {
    if (this.isExtendParentsOnAdd() !== v) {
      this.options.extendParentsOnAdd = v
    }
    return this
  }

  get extendParentsOnAdd() {
    return this.isExtendParentsOnAdd()
  }

  set extendParentsOnAdd(v: boolean) {
    this.setExtendParentsOnAdd(v)
  }

  isExtendParentsOnMove() {
    return this.options.extendParentsOnMove
  }

  setExtendParentsOnMove(v: boolean) {
    if (this.isExtendParentsOnMove() !== v) {
      this.options.extendParentsOnMove = v
    }
    return this
  }

  get extendParentsOnMove() {
    return this.isExtendParentsOnMove()
  }

  set extendParentsOnMove(v: boolean) {
    this.setExtendParentsOnMove(v)
  }

  isConstrainChildren() {
    return this.options.constrainChildren
  }

  setConstrainChildren(v: boolean) {
    if (this.isConstrainChildren() !== v) {
      this.options.constrainChildren = v
    }
    return this
  }

  get constrainChildren() {
    return this.isConstrainChildren()
  }

  set constrainChildren(v: boolean) {
    this.setConstrainChildren(v)
  }

  isConstrainRelativeChildren() {
    return this.options.constrainRelativeChildren
  }

  setConstrainRelativeChildren(v: boolean) {
    if (this.isConstrainRelativeChildren() !== v) {
      this.options.constrainRelativeChildren = v
    }
    return this
  }

  get constrainRelativeChildren() {
    return this.isConstrainRelativeChildren()
  }

  set constrainRelativeChildren(v: boolean) {
    this.setConstrainRelativeChildren(v)
  }

  isAutoSizeOnAdded() {
    return this.options.autoSizeOnAdded
  }

  setAutoSizeOnAdded(auto: boolean) {
    if (this.isAutoSizeOnAdded() !== auto) {
      this.options.autoSizeOnAdded = auto
    }
    return this
  }

  toggleAutoSizeOnAdded() {
    if (this.isAutoSizeOnAdded()) {
      this.disableAutoSizeOnAdded()
    } else {
      this.enableAutoSizeOnAdded()
    }
    return this
  }

  enableAutoSizeOnAdded() {
    return this.setAutoSizeOnAdded(true)
  }

  disableAutoSizeOnAdded() {
    return this.setAutoSizeOnAdded(false)
  }

  get autoSizeOnAdded() {
    return this.isAutoSizeOnAdded()
  }

  set autoSizeOnAdded(auto: boolean) {
    this.setAutoSizeOnAdded(auto)
  }

  isAutoSizeOnEdited() {
    return this.options.autoSizeOnEdited
  }

  setAutoSizeOnEdited(auto: boolean) {
    if (this.isAutoSizeOnEdited() !== auto) {
      this.options.autoSizeOnEdited = auto
    }
    return this
  }

  toggleAutoSizeOnEdited() {
    if (this.isAutoSizeOnEdited()) {
      this.disableAutoSizeOnEdited()
    } else {
      this.enableAutoSizeOnEdited()
    }
    return this
  }

  enableAutoSizeOnEdited() {
    return this.setAutoSizeOnEdited(true)
  }

  disableAutoSizeOnEdited() {
    return this.setAutoSizeOnEdited(false)
  }

  get autoSizeOnEdited() {
    return this.isAutoSizeOnEdited()
  }

  set autoSizeOnEdited(auto: boolean) {
    this.setAutoSizeOnEdited(auto)
  }

  isRecursiveResize() {
    return this.options.recursiveResize
  }

  setRecursiveResize(v: boolean) {
    if (this.isRecursiveResize() !== v) {
      this.options.recursiveResize = v
    }
    return this
  }

  get recursiveResize() {
    return this.isRecursiveResize()
  }

  set recursiveResize(v: boolean) {
    this.setRecursiveResize(v)
  }

  isCellsExportable() {
    return this.options.cellsExportable
  }

  setCellsExportable(exportable: boolean) {
    if (this.isCellsExportable() !== exportable) {
      this.options.cellsExportable = true
    }
    return this
  }

  toggleCellsExportable() {
    return this.setCellsExportable(!this.isCellsExportable())
  }

  get cellsExportable() {
    return this.isCellsExportable()
  }

  set cellsExportable(exportable: boolean) {
    this.setCellsExportable(exportable)
  }

  isCellsImportable() {
    return this.options.cellsImportable
  }

  setCellsImportable(importable: boolean) {
    if (this.isCellsImportable() !== importable) {
      this.options.cellsImportable = importable
    }
    return this
  }

  toggleCellsImportable() {
    return this.setCellsImportable(!this.isCellsImportable())
  }

  get cellsImportable() {
    return this.isCellsImportable()
  }

  set cellsImportable(importable: boolean) {
    this.setCellsImportable(importable)
  }

  isNegativeCoordinatesAllowed() {
    return this.options.allowNegativeCoordinates
  }

  setNegativeCoordinatesAllowed(v: boolean) {
    if (this.isNegativeCoordinatesAllowed() !== v) {
      this.options.allowNegativeCoordinates = v
    }
    return this
  }

  enableNegativeCoordinates() {
    return this.setNegativeCoordinatesAllowed(true)
  }

  disableNegativeCoordinates() {
    return this.setNegativeCoordinatesAllowed(false)
  }

  get allowNegativeCoordinates() {
    return this.isNegativeCoordinatesAllowed()
  }

  set allowNegativeCoordinates(v: boolean) {
    this.setNegativeCoordinatesAllowed(v)
  }

  isAutoUpdateCursor() {
    return this.options.autoUpdateCursor
  }

  setAutoUpdateCursor(auto: boolean) {
    if (this.isAutoUpdateCursor() !== auto) {
      this.options.autoUpdateCursor = auto
    }

    return this
  }

  toggleAutoUpdateCursor() {
    if (this.isAutoUpdateCursor()) {
      this.disableAutoUpdateCursor()
    } else {
      this.enableAutoUpdateCursor()
    }
    return this
  }

  enableAutoUpdateCursor() {
    return this.setAutoUpdateCursor(true)
  }

  disableAutoUpdateCursor() {
    return this.setAutoUpdateCursor(false)
  }

  get autoUpdateCursor() {
    return this.isAutoUpdateCursor()
  }

  set autoUpdateCursor(auto: boolean) {
    this.setAutoUpdateCursor(auto)
  }

  getDefaultOverlap() {
    return this.options.defaultOverlap
  }

  setDefaultOverlap(v: number) {
    if (this.getDefaultOverlap() !== v) {
      this.options.defaultOverlap = v
    }
    return this
  }

  get defaultOverlap() {
    return this.getDefaultOverlap()
  }

  set defaultOverlap(v: number) {
    this.setDefaultOverlap(v)
  }

  isInvokesStopCellEditing() {
    return this.options.invokesStopCellEditing
  }

  setInvokesStopCellEditing(v: boolean) {
    if (this.isInvokesStopCellEditing() !== v) {
      this.options.invokesStopCellEditing = v
    }
    return this
  }

  get invokesStopCellEditing() {
    return this.isInvokesStopCellEditing()
  }

  set invokesStopCellEditing(v: boolean) {
    this.setInvokesStopCellEditing(v)
  }

  isStopEditingOnEnter() {
    return this.options.stopEditingOnEnter
  }

  setStopEditingOnEnter(v: boolean) {
    if (this.isStopEditingOnEnter() !== v) {
      this.options.stopEditingOnEnter = v
    }
    return this
  }

  toggleStopEditingOnEnter() {
    if (this.isStopEditingOnEnter()) {
      this.disableStopEditingOnEnter()
    } else {
      this.enableStopEditingOnEnter()
    }
    return this
  }

  enableStopEditingOnEnter() {
    return this.setStopEditingOnEnter(true)
  }

  disableStopEditingOnEnter() {
    return this.setStopEditingOnEnter(false)
  }

  get stopEditingOnEnter() {
    return this.isStopEditingOnEnter()
  }

  set stopEditingOnEnter(v: boolean) {
    this.setStopEditingOnEnter(v)
  }

  isScrollOnMove() {
    return this.options.scrollOnMove
  }

  setScrollOnMove(v: boolean) {
    if (this.isScrollOnMove() !== v) {
      this.options.scrollOnMove = v
    }
    return this
  }

  toggleScrollOnMove() {
    if (this.isScrollOnMove()) {
      this.disableScrollOnMove()
    } else {
      this.enableScrollOnMove()
    }
    return this
  }

  enableScrollOnMove() {
    this.setScrollOnMove(true)
  }

  disableScrollOnMove() {
    this.setScrollOnMove(false)
  }

  get scrollOnMove() {
    return this.isScrollOnMove()
  }

  set scrollOnMove(v: boolean) {
    this.setScrollOnMove(v)
  }

  // #endregion

  // #region label

  isNodeLabelsMovable() {
    return this.options.nodeLabelsMovable
  }

  setNodeLabelsMovable(v: boolean) {
    if (this.isNodeLabelsMovable() !== v) {
      this.options.nodeLabelsMovable = v
    }
    return this
  }

  toggleNodeLabelsMovable() {
    return this.setNodeLabelsMovable(!this.isNodeLabelsMovable())
  }

  get nodeLabelsMovable() {
    return this.isNodeLabelsMovable()
  }

  set nodeLabelsMovable(v: boolean) {
    this.setNodeLabelsMovable(v)
  }

  isEdgeLabelsMovable() {
    return this.options.edgeLabelsMovable
  }

  setEdgeLabelsMovable(v: boolean) {
    if (this.isEdgeLabelsMovable() !== v) {
      this.options.edgeLabelsMovable = v
    }
    return this
  }

  toggleEdgeLabelsMovable() {
    return this.setEdgeLabelsMovable(!this.isEdgeLabelsMovable())
  }

  get edgeLabelsMovable() {
    return this.isEdgeLabelsMovable()
  }

  set edgeLabelsMovable(v: boolean) {
    this.setEdgeLabelsMovable(v)
  }

  isHtmlLabels() {
    return this.options.htmlLabels
  }

  setHtmlLabels(v: boolean, refresh: boolean = true) {
    if (this.isHtmlLabels() !== v) {
      this.options.htmlLabels = v
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  toggleHtmlLabels() {
    return this.setHtmlLabels(!this.isHtmlLabels())
  }

  get htmlLabels() {
    return this.isHtmlLabels()
  }

  set htmlLabels(v: boolean) {
    this.setHtmlLabels(v)
  }

  isLabelsVisible() {
    return this.options.labelsVisible
  }

  setLabelsVisible(v: boolean, refresh: boolean = true) {
    if (this.isLabelsVisible() !== v) {
      this.options.labelsVisible = v
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  showLabels(refresh: boolean = true) {
    return this.setLabelsVisible(true, refresh)
  }

  hideLabels(refresh: boolean = true) {
    return this.setLabelsVisible(false, refresh)
  }

  toggleLabelsVisible(refresh: boolean = true) {
    if (this.isLabelsVisible()) {
      this.hideLabels(refresh)
    } else {
      this.showLabels(refresh)
    }
    return this
  }

  get labelsVisible() {
    return this.isLabelsVisible()
  }

  set labelsVisible(v: boolean) {
    this.setLabelsVisible(v)
  }

  // #endregion

  // #region edges

  getDefaultLoopRouter() {
    return this.options.defaultLoopRouter
  }

  setDefaultLoopRouter(router: Route.Router, refresh: boolean = true) {
    if (this.getDefaultLoopRouter() !== router) {
      this.options.defaultLoopRouter = router
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get defaultLoopRouter() {
    return this.getDefaultLoopRouter()
  }

  set defaultLoopRouter(router: Route.Router) {
    this.setDefaultLoopRouter(router)
  }

  isKeepEdgesInForeground() {
    return this.options.keepEdgesInForeground
  }

  setKeepEdgesInForeground(v: boolean, refresh: boolean = true) {
    if (this.isKeepEdgesInForeground() !== v) {
      this.options.keepEdgesInForeground = v
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get keepEdgesInForeground() {
    return this.isKeepEdgesInForeground()
  }

  set keepEdgesInForeground(v: boolean) {
    this.setKeepEdgesInForeground(v)
  }

  isKeepEdgesInBackground() {
    return this.options.keepEdgesInBackground
  }

  setKeepEdgesInBackground(v: boolean, refresh: boolean = true) {
    if (this.isKeepEdgesInBackground() !== v) {
      this.options.keepEdgesInBackground = v
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get keepEdgesInBackground() {
    return this.isKeepEdgesInBackground()
  }

  set keepEdgesInBackground(v: boolean) {
    this.setKeepEdgesInBackground(v)
  }

  isResetEdgesOnResize() {
    return this.options.resetEdgesOnResize
  }

  setResetEdgesOnResize(v: boolean) {
    if (this.isResetEdgesOnResize() !== v) {
      this.options.resetEdgesOnResize = v
    }
    return this
  }

  get resetEdgesOnResize() {
    return this.isResetEdgesOnResize()
  }

  set resetEdgesOnResize(v: boolean) {
    this.setResetEdgesOnResize(v)
  }

  isResetEdgesOnMove() {
    return this.options.resetEdgesOnMove
  }

  setResetEdgesOnMove(v: boolean) {
    if (this.isResetEdgesOnMove() !== v) {
      this.options.resetEdgesOnMove = v
    }
    return this
  }

  get resetEdgesOnMove() {
    return this.isResetEdgesOnMove()
  }

  set resetEdgesOnMove(v: boolean) {
    this.setResetEdgesOnMove(v)
  }

  isResetEdgesOnConnect() {
    return this.options.resetEdgesOnConnect
  }

  setResetEdgesOnConnect(v: boolean) {
    if (this.isResetEdgesOnConnect() !== v) {
      this.options.resetEdgesOnConnect = v
    }
    return this
  }

  get resetEdgesOnConnect() {
    return this.isResetEdgesOnConnect()
  }

  set resetEdgesOnConnect(v: boolean) {
    this.setResetEdgesOnConnect(v)
  }

  isMultigraphSupported() {
    return this.options.multigraphSupported
  }

  setMultigraphSupported(supported: boolean) {
    if (this.isMultigraphSupported() !== supported) {
      this.options.multigraphSupported = true
    }
    return this
  }

  enableMultigraph() {
    return this.setMultigraphSupported(true)
  }

  disableMultigraph() {
    return this.setMultigraphSupported(false)
  }

  get multigraphSupported() {
    return this.isMultigraphSupported()
  }

  set multigraphSupported(supported: boolean) {
    this.setMultigraphSupported(supported)
  }

  isLoopsAllowed() {
    return this.options.allowLoops
  }

  setLoopsAllowed(allowed: boolean) {
    if (this.isLoopsAllowed() !== allowed) {
      this.options.allowLoops = allowed
    }
    return this
  }

  enableLoops() {
    return this.setLoopsAllowed(true)
  }

  disableLoops() {
    return this.setLoopsAllowed(false)
  }

  get allowLoops() {
    return this.isLoopsAllowed()
  }

  set loopsAllowed(allowed: boolean) {
    this.setLoopsAllowed(allowed)
  }

  isDanglingEdgesEnabled() {
    return this.options.allowDanglingEdges
  }

  setDanglingEdgesEnabled(enabled: boolean) {
    if (this.isDanglingEdgesEnabled() !== enabled) {
      this.options.allowDanglingEdges = enabled
    }
    return this
  }

  enableDanglingEdges() {
    return this.setDanglingEdgesEnabled(true)
  }

  disableDanglingEdges() {
    return this.setDanglingEdgesEnabled(false)
  }

  get allowDanglingEdges() {
    return this.isDanglingEdgesEnabled()
  }

  set danglingEdgesEnabled(enabled: boolean) {
    this.setDanglingEdgesEnabled(enabled)
  }

  isEdgesConnectable() {
    return this.options.edgesConnectable
  }

  setEdgesConnectable(v: boolean) {
    if (this.isEdgesConnectable() !== v) {
      this.options.edgesConnectable = v
    }
    return this
  }

  get edgesConnectable() {
    return this.isEdgesConnectable()
  }

  set edgesConnectable(v: boolean) {
    this.setEdgesConnectable(v)
  }

  isInvalidEdgesClonable() {
    return this.options.invalidEdgesClonable
  }

  setInvalidEdgesClonable(v: boolean) {
    if (this.isInvalidEdgesClonable() !== v) {
      this.options.invalidEdgesClonable = true
    }
    return this
  }

  enableCloneInvalidEdges() {
    return this.setInvalidEdgesClonable(true)
  }

  disableCloneInvalidEdges() {
    return this.setInvalidEdgesClonable(false)
  }

  get invalidEdgesClonable() {
    return this.isInvalidEdgesClonable()
  }

  set invalidEdgesClonable(v: boolean) {
    this.setInvalidEdgesClonable(v)
  }

  isDisconnectOnMove() {
    return this.options.disconnectOnMove
  }

  setDisconnectOnMove(v: boolean) {
    if (this.isDisconnectOnMove() !== v) {
      this.options.disconnectOnMove = v
    }
    return this
  }

  get disconnectOnMove() {
    return this.isDisconnectOnMove()
  }

  set disconnectOnMove(v: boolean) {
    this.setDisconnectOnMove(v)
  }

  isConnectOnDrop() {
    return this.options.connectOnDrop
  }

  setConnectOnDrop(v: boolean) {
    if (this.isConnectOnDrop() !== v) {
      this.options.connectOnDrop = v
    }
    return this
  }

  get connectOnDrop() {
    return this.isConnectOnDrop()
  }

  set connectOnDrop(v: boolean) {
    this.setConnectOnDrop(v)
  }

  isSplitEnabled() {
    return this.options.splitEnabled
  }

  setSplitEnabled(v: boolean) {
    if (this.isSplitEnabled() !== v) {
      this.options.splitEnabled = v
    }
    return this
  }

  get splitEnabled() {
    return this.isSplitEnabled()
  }

  set splitEnabled(v: boolean) {
    this.setSplitEnabled(v)
  }

  // #endregion

  // #region nodes

  isSwimlaneNesting() {
    return this.options.swimlaneNesting
  }

  setSwimlaneNesting(v: boolean) {
    if (this.isSwimlaneNesting() !== v) {
      this.options.swimlaneNesting = v
    }
    return this
  }

  get swimlaneNesting() {
    return this.isSwimlaneNesting()
  }

  set swimlaneNesting(v: boolean) {
    this.setSwimlaneNesting(v)
  }

  isSwimlaneSelectionEnabled() {
    return this.options.swimlaneSelectionEnabled
  }

  setSwimlaneSelectionEnabled(v: boolean) {
    if (this.isSwimlaneSelectionEnabled() !== v) {
      this.options.swimlaneSelectionEnabled = v
    }
    return this
  }

  get swimlaneSelectionEnabled() {
    return this.isSwimlaneSelectionEnabled()
  }

  set swimlaneSelectionEnabled(v: boolean) {
    this.setSwimlaneSelectionEnabled(v)
  }

  getSwimlaneIndicatorColorAttribute() {
    return this.options.swimlaneIndicatorColorAttribute
  }

  setSwimlaneIndicatorColorAttribute(attr: string) {
    if (this.getSwimlaneIndicatorColorAttribute() !== attr) {
      this.options.swimlaneIndicatorColorAttribute = attr
    }
    return this
  }

  get swimlaneIndicatorColorAttribute() {
    return this.getSwimlaneIndicatorColorAttribute()
  }

  set swimlaneIndicatorColorAttribute(attr: string) {
    this.setSwimlaneIndicatorColorAttribute(attr)
  }

  getMaxCellCountForHandle() {
    return this.options.maxCellCountForHandle
  }

  setMaxCellCountForHandle(count: number) {
    if (this.getMaxCellCountForHandle() !== count) {
      this.options.maxCellCountForHandle = count
    }
    return this
  }

  get maxCellCountForHandle() {
    return this.getMaxCellCountForHandle()
  }

  set maxCellCountForHandle(count: number) {
    this.setMaxCellCountForHandle(count)
  }

  // #endregion

  // #endregion
}

export interface GraphProperties {
  prefixCls: string
  dialect: Dialect
  /**
   * Specifies if the canvas is infinite.
   *
   * Default is `false`.
   */
  infinite: boolean
  antialiased: boolean

  /**
   * Tolerance for a move to be handled as a single click.
   *
   * Default is `4` pixels.
   */
  tolerance: number

  backgroundColor: string | null

  /**
   * Border to be added to the bottom and right side when the
   * container is being resized after the graph has been changed.
   *
   * Default is `0`.
   */
  border: number

  warningImage: Image

  /**
   * Specifies the alternate edge style to be used if the main control
   * point on an edge is being doubleclicked.
   *
   * Default is `null`.
   */
  alternateEdgeStyle: Style | null

  /**
   * Specifies if native double click events should be detected.
   *
   * Default is `true`.
   */
  nativeDblClickEnabled: boolean

  /**
   * Specifies if double taps on touch-based devices should be handled
   * as a double click.
   *
   * Default is `true`.
   */
  doubleTapEnabled: boolean

  /**
   * Specifies the timeout for double taps and non-native double clicks.
   *
   * Default is `500` ms.
   */
  doubleTapTimeout: number

  /**
   * Specifies the tolerance for double taps.
   *
   * Default is `25` pixels.
   */
  doubleTapTolerance: number

  /**
   * Specifies if tap and hold should be used for starting connections
   * on touch-based devices.
   *
   * Default is `true`.
   */
  tapAndHoldEnabled: boolean

  /**
   * Specifies the time for a tap and hold.
   *
   * Default is `500` ms.
   */
  tapAndHoldDelay: number

  /**
   * Specifies if the graph should automatically scroll if the mouse
   * goes near the container edge while dragging. This is only taken
   * into account if the container has scrollbars.
   *
   * Default is `true`.
   *
   * If you need this to work without scrollbars then set `ignoreScrollbars`
   * to true. In general, with no scrollbars, the use of `allowAutoPanning`
   * is recommended.
   */
  autoScroll: boolean

  /**
   * Specifies if the graph should automatically scroll regardless
   * of the scrollbars. This will scroll the container using positive
   * values for scroll positions. To avoid possible conflicts with
   * panning, set `translateToScrollPosition` to true.
   */
  ignoreScrollbars: boolean

  /**
   * Specifies if the graph should automatically convert the current
   * scroll position to a translate in the graph view when a mouseUp
   * event is received. This can be used to avoid conflicts when using
   * `autoScroll` and `ignoreScrollbars` with no scrollbars in the
   * container.
   */
  translateToScrollPosition: boolean

  /**
   * Specifies if autoscrolling should be carried out via `PanningManager`
   * even if the container has scrollbars. This disables `scrollPointToVisible`
   * and uses `PanningManager` instead. If this is true then `autoExtend` is
   * disabled. It should only be used with a scroll buffer or when scollbars
   * are visible and scrollable in all directions.
   *
   * Default is `false`.
   */
  timerAutoScroll: boolean

  /**
   * Specifies if panning via `panGraph` should be allowed to implement
   * autoscroll if no scrollbars are available in `scrollPointToVisible`.
   * To enable panning inside the container, near the edge,
   * set `PanningManager.border` to a positive value.
   *
   * Default is `false`.
   */
  allowAutoPanning: boolean

  /**
   * Specifies if scrollbars should be used for panning if any scrollbars
   * are available. If scrollbars are enabled in CSS, but no scrollbars
   * appear because the graph is smaller than the container size, then no
   * panning occurs if this is true.
   *
   * Default is `true`.
   */
  useScrollbarsForPanning: boolean

  /**
   * Specifies if the size of the graph should be automatically extended
   * if the mouse goes near the container edge while dragging. This is only
   * taken into account if the container has scrollbars.
   *
   * Default is `true`.
   */
  autoExtend: boolean

  /**
   * `Rectangle` that specifies the area in which all cells in the diagram
   * should be placed. Use a width or height of 0 if you only want to give
   * a upper, left corner.
   */
  maxGraphBounds: Rectangle | null

  /**
   * The minimum size of the graph.
   *
   * This is ignored if the graph container has no scrollbars.
   *
   * Default is `null`.
   */
  minGraphSize: Size | null

  minContainerSize: Size | null
  maxContainerSize: Size | null

  /**
   * Specifies if the container should be resized to the graph
   * size when the graph size has changed.
   *
   * Default is `false`.
   */
  autoResizeContainer: boolean

  /**
   * Specifies if the scale and translate should be reset if the
   * root changes in the model.
   *
   * Default is `true`.
   */
  resetViewOnRootChange: boolean

  /**
   * Specifies if the viewport should automatically contain
   * the selection cells after a zoom operation.
   *
   * Default is `false`.
   */
  keepSelectionVisibleOnZoom: boolean

  /**
   * Specifies if the zoom operations should go into the center
   * of the actual diagram rather than going from top, left.
   *
   * Default is `true`.
   */
  centerZoom: boolean

  /**
   * Specifies the factor used for `zoomIn` and `zoomOut`.
   *
   * Default is `1.2`
   */
  scaleFactor: number
  minScale: number
  maxScale: number

  /**
   * Specifies the minimum scale to be applied in `fit`.
   *
   * Default is `0.1`. Set to `null` to allow any value.
   */
  minFitScale: number

  /**
   * Specifies the maximum scale to be applied in `fit`.
   *
   * Default is `8`. Set to `null` to allow any value.
   */
  maxFitScale: number

  /**
   * Specifies if ports are enabled.
   *
   * Default is `true`.
   */
  portsEnabled: boolean

  /**
   * Specifies if the background page should be visible.
   *
   * Default is `false`.
   */
  pageVisible: boolean

  /**
   * Specifies the scale of the background page.
   *
   * Default is `1`.
   */
  pageScale: number

  /**
   * Specifies the page format for the background page.
   */
  pageFormat: Size

  /**
   * Specifies if the graph size should be rounded to the next page
   * number in `sizeDidChange`.
   *
   * This is only used if the graph container has scrollbars.
   *
   * Default is `false`.
   */
  preferPageSize: boolean

  /**
   * An array of `Multiplicity` describing the allowed connections in
   * the graph.
   */
  multiplicities: Multiplicity[] | null

  /**
   * Specifies if the graph should allow cloning of cells by holding
   * down the control key while cells are being moved.
   *
   * Default is `true`.
   */
  cellsCloneable: boolean

  cellsSelectable: boolean

  cellsDeletable: boolean

  /**
   * Specifies if the graph should allow moving of cells.
   *
   * Default is `true`.
   */
  cellsMovable: boolean

  /**
   * Specifies if the graph should allow bending of edges.
   *
   * Default is `true`.
   */
  cellsBendable: boolean

  /**
   * Specifies if the graph should allow in-place editing for
   * cell labels.
   *
   * Default is `true`.
   */
  cellsEditable: boolean

  /**
   * Specifies if cells is disconnectable.
   *
   * Default is `true`.
   */
  cellsDisconnectable: boolean

  /**
   * Specifies if the cells in the graph can be moved, sized, bended,
   * disconnected, edited, selected.
   *
   * Default is `false`.
   */
  cellsLocked: boolean

  /**
   * Specifies if the graph should allow dropping of cells onto or
   * into other cells.
   *
   * Default is `false`.
   */
  dropEnabled: boolean

  /**
   * Specifies if cells may be moved out of their parents.
   *
   * Default is `true`.
   */
  allowRemoveCellsFromParent: boolean

  /**
   * If empty parents should be removed from the model after all child cells
   * have been moved out.
   *
   * Default is `true`.
   */
  autoRemoveEmptyParent: boolean

  /**
   * Specifies if a parent should contain the child bounds after
   * a resize of the child.
   *
   * Default is `true`.
   */
  extendParents: boolean

  extendParentsOnAdd: boolean

  extendParentsOnMove: boolean

  /**
   * Specifies if a child should be constrained inside the parent
   * bounds after a move or resize of the child.
   *
   * Default is `true`.
   */
  constrainChildren: boolean

  /**
   * Specifies if child cells with relative geometries should be
   * constrained inside the parent bounds.
   *
   * Default is `false`.
   */
  constrainRelativeChildren: boolean

  /**
   * Specifies if autoSize style should be applied when cells are added.
   *
   * Default is `false`.
   */
  autoSizeOnAdded: boolean

  /**
   * Specifies if cell sizes should be automatically updated
   * after a label change.
   *
   * Default is `false`.
   */
  autoSizeOnEdited: boolean

  recursiveResize: boolean

  /**
   * Specifies if cells may be exported to the clipboard.
   *
   * Default is `true`.
   */
  cellsExportable: boolean

  /**
   * Specifies if cells may be imported from the clipboard.
   *
   * Default is `true`.
   */
  cellsImportable: boolean

  /**
   * Specifies if negative coordinates for nodes are allowed.
   *
   * Default is `true`.
   */
  allowNegativeCoordinates: boolean

  /**
   * Specifies if a move cursor should be shown if the mouse
   * is over a movable cell.
   *
   * Default is `true`.
   */
  autoUpdateCursor: boolean

  /**
   * Specifies the portion of the child which is allowed to overlap
   * the parent.
   *
   * Default is `0.5`.
   */
  defaultOverlap: number

  /**
   * If true, when editing is to be stopped by way of selection
   * changing, data in diagram changing or other means stopCellEditing
   * is invoked, and changes are saved.
   *
   * Default is `true`.
   */
  invokesStopCellEditing: boolean

  /**
   * If true, pressing the enter key without pressing control or
   * shift will stop editing and accept the new value.
   *
   * Note: You can always use F2 and escape to stop editing.
   *
   * Default is `false`.
   */
  stopEditingOnEnter: boolean

  /**
   * Specifies if the view should be scrolled so that a moved cell is
   * visible.
   *
   * Default is `true`.
   */
  scrollOnMove: boolean

  // #region label

  /**
   * Specifies if the label of node movable.
   *
   * Default is `false`.
   */
  nodeLabelsMovable: boolean

  /**
   * Specifies if the label of edge movable.
   *
   * Default is `true`.
   */
  edgeLabelsMovable: boolean

  /**
   * Specifies if the label must be rendered as HTML markup.
   *
   * Default is `false`.
   */
  htmlLabels: boolean

  /**
   * Specifies if labels should be visible.
   *
   * Default is `true`.
   */
  labelsVisible: boolean

  // #endregion

  // #region edge

  defaultLoopRouter: Route.Router

  /**
   * Specifies if edges should appear in the foreground regardless
   * of their order in the model. If `keepEdgesInForeground` and
   * `keepEdgesInBackground` are both true then the normal order
   * is applied.
   *
   * Default is `false`.
   */
  keepEdgesInForeground: boolean

  /**
   * Specifies if edges should appear in the background regardless
   * of their order in the model. If `keepEdgesInForeground` and
   * `keepEdgesInBackground` are both true then the normal order
   * is applied.
   *
   * Default is `false`.
   */
  keepEdgesInBackground: boolean

  /**
   * Specifies if edge control points should be reset after the
   * resize of a connected cell.
   *
   * Default is `false`.
   */
  resetEdgesOnResize: boolean

  /**
   * Specifies if edge control points should be reset after the
   * move of a connected cell.
   *
   * Default is `false`.
   */
  resetEdgesOnMove: boolean

  /**
   * Specifies if edge control points should be reset after the
   * edge has been reconnected.
   *
   * Default is `true`.
   */
  resetEdgesOnConnect: boolean

  /**
   * Specifies if multiple edges in the same direction between
   * the same pair of nodes are allowed.
   *
   * Default is `true`.
   */
  multigraphSupported: boolean

  /**
   * Specifies if loops (aka self-references) are allowed.
   *
   * Default is `false`.
   */
  allowLoops: boolean

  /**
   * Specifies if edges with disconnected terminals are allowed
   * in the graph. Dangling edge is an edge that do not have a
   * source and/or target terminal defined.
   *
   * Default is `true`.
   */
  allowDanglingEdges: boolean

  /**
   * Specifies if edges are connectable.
   *
   * Default is `false`.
   */
  edgesConnectable: boolean

  /**
   * Specifies if edges that are cloned should be validated and
   * only inserted if they are valid.
   *
   * Default is `false`.
   */
  invalidEdgesClonable: boolean

  /**
   * Specifies if edges should be disconnected from their terminals
   * when they are moved.
   *
   * Default is `true`.
   */
  disconnectOnMove: boolean

  /**
   * Specifies if drop events are interpreted as new connections if
   * no other drop action is defined.
   *
   * Default is `false`.
   */
  connectOnDrop: boolean

  /**
   * Specifies if dropping onto edges should be splited.
   *
   * Default is `true`.
   */
  splitEnabled: boolean

  // #endregion

  // #region node

  /**
   * Specifies if swimlanes can be nested by drag and drop.
   *
   * Default is `true`.
   */
  swimlaneNesting: boolean

  /**
   * Specifies if swimlanes should be selected if the mouse is
   * released over their content area.
   *
   * Default is `true`.
   */
  swimlaneSelectionEnabled: boolean

  /**
   * The attribute used to find the color for the indicator if
   * the indicator color is set to 'swimlane'.
   */
  swimlaneIndicatorColorAttribute: string

  /**
   * Defines the maximum number of cells to paint subhandles for.
   *
   * Default is `20` for IE and `50` for others. Set this to `0` if you
   * want an unlimited number of handles to be displayed. This is only
   * recommended if the number of cells in the graph is limited to a
   * small number, eg. `500`.
   */
  maxCellCountForHandle: number

  // #endregion
}

export interface CompositeOptions {
  /**
   * Specifies if handle escape key press.
   *
   * Default is `true`.
   */
  escapeEnabled?: boolean

  /**
   * Specifies if the graph should allow resizing of cells.
   *
   * Default is `true`.
   */
  cellsResizable?: boolean

  /**
   * Specifies if the graph should allow rotating of cells.
   *
   * Default is `true`.
   */
  cellsRotatable?: boolean
}

export interface BaseGraph extends IPreDependencies {}

export interface IPreDependencies {
  panX: number
  panY: number

  snap(value: number): number
  getGridSize(): number
  sizeDidChange(): this
  isCellLocked(cell: Cell | null): boolean
  isCellCollapsed(cell: Cell | null): boolean
  isCellConnectable(cell: Cell | null): boolean
  getDefaultParent(): Cell
  getSelectedCell(): Cell
  getSelectedCells(): Cell[]
  getDeletableCells(cells: Cell[]): Cell[]
  getCollapsableCells(cells: Cell[], collapse: boolean): Cell[]
  getStyle(cell: Cell | null): Style
  getLabel(cell: Cell): HTMLElement | string | null
}
