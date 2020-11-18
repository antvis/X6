import { FunctionExt } from '../util'
import { Cell } from '../model/cell'
import { Node } from '../model/node'
import { Edge } from '../model/edge'
import { Model } from '../model/model'
import { View } from '../view/view'
import { Markup } from '../view/markup'
import { CellView } from '../view/cell'
import { NodeView } from '../view/node'
import { EdgeView } from '../view/edge'
import { Widget } from '../addon/common'
import { MiniMap } from '../addon/minimap'
import { Snapline } from '../addon/snapline'
import { Scroller } from '../addon/scroller'
import { Selection } from '../addon/selection'
import { Clipboard } from '../addon/clipboard'
import { Transform } from '../addon/transform'
import { HTML } from '../shape/standard/html'
import { Edge as StandardEdge } from '../shape/standard/edge'
import { Base } from './base'
import { Graph } from './graph'
import { Options } from './options'
import { Renderer } from './renderer'
import { GraphView } from './view'
import { DefsManager } from './defs'
import { GridManager } from './grid'
import { CoordManager } from './coord'
import { SnaplineManager } from './snapline'
import { ScrollerManager } from './scroller'
import { ClipboardManager } from './clipboard'
import { HighlightManager } from './highlight'
import { TransformManager } from './transform'
import { SelectionManager } from './selection'
import { BackgroundManager } from './background'
import { HistoryManager } from './history'
import { MiniMapManager } from './minimap'
import { Keyboard } from './keyboard'
import { MouseWheel } from './mousewheel'
import { PrintManager } from './print'
import { FormatManager } from './format'
import { PortManager } from '../model/port'
import { Rectangle } from '../geometry'

namespace Decorator {
  export function hook(nullable?: boolean, hookName?: string | null) {
    return (
      target: Hook,
      methodName: string,
      descriptor: PropertyDescriptor,
    ) => {
      const raw = descriptor.value
      const name = hookName || methodName

      descriptor.value = function (this: Hook, ...args: any[]) {
        const hook = (this.options as any)[name]
        if (hook != null) {
          this.getNativeValue = raw.bind(this, ...args)
          const ret = FunctionExt.call(hook, this.graph, ...args)
          this.getNativeValue = null
          if (ret != null || (nullable === true && ret === null)) {
            return ret
          }
        }

        return raw.call(this, ...args)
      }
    }
  }

  export function after(hookName?: string | null) {
    return (
      target: Hook,
      methodName: string,
      descriptor: PropertyDescriptor,
    ) => {
      const raw = descriptor.value
      const name = hookName || methodName

      descriptor.value = function (this: Hook, ...args: any[]) {
        let ret = raw.call(this, ...args)
        const hook = (this.options as any)[name]
        if (hook != null) {
          ret = FunctionExt.call(hook, this.graph, ...args) && ret
        }
        return ret
      }
    }
  }
}

export class Hook extends Base implements Hook.IHook {
  /**
   * Get the native value of hooked method.
   */
  public getNativeValue: (<T>() => T | null) | null

  @Decorator.hook()
  createModel() {
    if (this.options.model) {
      return this.options.model
    }
    const model = new Model()
    model.graph = this.graph
    return model
  }

  @Decorator.hook()
  createView() {
    return new GraphView(this.graph)
  }

  @Decorator.hook()
  createRenderer() {
    return new Renderer(this.graph)
  }

  @Decorator.hook()
  createDefsManager() {
    return new DefsManager(this.graph)
  }

  @Decorator.hook()
  createGridManager() {
    return new GridManager(this.graph)
  }

  @Decorator.hook()
  createCoordManager() {
    return new CoordManager(this.graph)
  }

  @Decorator.hook()
  createTransform(node: Node, widgetOptions?: Widget.Options) {
    const options = this.getTransformOptions(node)
    if (options.resizable || options.rotatable) {
      return new Transform({
        node,
        graph: this.graph,
        ...options,
        ...widgetOptions,
      })
    }

    return null
  }

  protected getTransformOptions(node: Node) {
    const resizing = Options.parseOptionGroup<Options.ResizingRaw>(
      this.graph,
      node,
      this.options.resizing,
    )

    const rotating = Options.parseOptionGroup<Options.RotatingRaw>(
      this.graph,
      node,
      this.options.rotating,
    )

    const transforming = Options.parseOptionGroup<Options.TransformingRaw>(
      this.graph,
      node,
      this.options.transforming,
    )

    const options: Transform.Options = {
      ...transforming,

      resizable: resizing.enabled,
      minWidth: resizing.minWidth,
      maxWidth: resizing.maxWidth,
      minHeight: resizing.minHeight,
      maxHeight: resizing.maxHeight,
      orthogonalResizing: resizing.orthogonal,
      restrictedResizing: resizing.restricted,
      autoScrollOnResizing: resizing.autoScroll,
      preserveAspectRatio: resizing.preserveAspectRatio,

      rotatable: rotating.enabled,
      rotateGrid: rotating.grid,
    }

    return options
  }

  @Decorator.hook()
  createTransformManager() {
    return new TransformManager(this.graph)
  }

  @Decorator.hook()
  createHighlightManager() {
    return new HighlightManager(this.graph)
  }

  @Decorator.hook()
  createBackgroundManager() {
    return new BackgroundManager(this.graph)
  }

  @Decorator.hook()
  createClipboard() {
    return new Clipboard()
  }

  @Decorator.hook()
  createClipboardManager() {
    return new ClipboardManager(this.graph)
  }

  @Decorator.hook()
  createSnapline() {
    return new Snapline({ graph: this.graph, ...this.options.snapline })
  }

  @Decorator.hook()
  createSnaplineManager() {
    return new SnaplineManager(this.graph)
  }

  @Decorator.hook()
  createSelection() {
    return new Selection({ graph: this.graph, ...this.options.selecting })
  }

  @Decorator.hook()
  createSelectionManager() {
    return new SelectionManager(this.graph)
  }

  @Decorator.hook()
  allowRubberband(e: JQuery.MouseDownEvent) {
    return true
  }

  @Decorator.hook()
  createHistoryManager() {
    return new HistoryManager({ graph: this.graph, ...this.options.history })
  }

  @Decorator.hook()
  createScroller() {
    if (this.options.scroller.enabled) {
      return new Scroller({ graph: this.graph, ...this.options.scroller })
    }
    return null
  }

  @Decorator.hook()
  createScrollerManager() {
    return new ScrollerManager(this.graph)
  }

  @Decorator.hook()
  allowPanning(e: JQuery.MouseDownEvent) {
    return true
  }

  @Decorator.hook()
  createMiniMap() {
    const { enabled, ...options } = this.options.minimap
    if (enabled) {
      const scroller = this.graph.scroller.widget
      if (scroller == null) {
        throw new Error('Minimap requires scroller be enabled.')
      } else {
        return new MiniMap({
          scroller,
          ...options,
        })
      }
    }
    return null
  }

  @Decorator.hook()
  createMiniMapManager() {
    return new MiniMapManager(this.graph)
  }

  @Decorator.hook()
  createKeyboard() {
    return new Keyboard({ graph: this.graph, ...this.options.keyboard })
  }

  @Decorator.hook()
  createMouseWheel() {
    return new MouseWheel({ graph: this.graph, ...this.options.mousewheel })
  }

  @Decorator.hook()
  createPrintManager() {
    return new PrintManager(this.graph)
  }

  @Decorator.hook()
  createFormatManager() {
    return new FormatManager(this.graph)
  }

  protected allowMultiEdges(edge: Edge) {
    const multi = this.options.connecting.multi

    if (typeof multi !== 'function') {
      return !!multi
    }

    return FunctionExt.call(multi, this.graph, {
      edge,
      sourceCell: edge.getSourceCell(),
      targetCell: edge.getTargetCell(),
      sourcePort: edge.getSourcePortId(),
      targetPort: edge.getTargetPortId(),
    })
  }

  protected allowDanglingEdge(edge: Edge) {
    const dangling = this.options.connecting.dangling

    if (typeof dangling !== 'function') {
      return !!dangling
    }

    return FunctionExt.call(dangling, this.graph, {
      edge,
      sourceCell: edge.getSourceCell(),
      targetCell: edge.getTargetCell(),
      sourcePort: edge.getSourcePortId(),
      targetPort: edge.getTargetPortId(),
    })
  }

  validateEdge(
    edge: Edge,
    type: Edge.TerminalType,
    initialTerminal: Edge.TerminalData,
  ) {
    if (!this.allowMultiEdges(edge)) {
      const source = edge.getSource() as Edge.TerminalCellData
      const target = edge.getTarget() as Edge.TerminalCellData

      if (source.cell && target.cell) {
        const sourceCell = edge.getSourceCell()
        if (sourceCell) {
          const connectedEdges = this.model.getConnectedEdges(sourceCell, {
            outgoing: true,
          })

          const sameEdges = connectedEdges.filter((link) => {
            const s = link.getSource() as Edge.TerminalCellData
            const t = link.getTarget() as Edge.TerminalCellData
            return (
              s &&
              s.cell === source.cell &&
              (!s.port || s.port === source.port) &&
              t &&
              t.cell === target.cell &&
              (!t.port || t.port === target.port)
            )
          })

          if (sameEdges.length > 1) {
            return false
          }
        }
      }
    }

    if (!this.allowDanglingEdge(edge)) {
      const sourceId = edge.getSourceCellId()
      const targetId = edge.getTargetCellId()
      if (!(sourceId && targetId)) {
        return false
      }
    }

    const validate = this.options.connecting.validateEdge
    if (validate) {
      return FunctionExt.call(validate, this.graph, {
        edge,
        type,
        previous: initialTerminal,
      })
    }

    return true
  }

  validateMagnet(
    cellView: CellView,
    magnet: Element,
    e: JQuery.MouseDownEvent,
  ) {
    if (magnet.getAttribute('magnet') !== 'passive') {
      const validate = this.options.connecting.validateMagnet
      if (validate) {
        return FunctionExt.call(validate, this.graph, {
          e,
          magnet,
          view: cellView,
          cell: cellView.cell,
        })
      }
      return true
    }
    return false
  }

  getDefaultEdge(sourceView: CellView, sourceMagnet: Element) {
    let edge: Edge | undefined | null | void

    const create = this.options.connecting.createEdge
    if (create) {
      edge = FunctionExt.call(create, this.graph, {
        sourceMagnet,
        sourceView,
        sourceCell: sourceView.cell,
      })
    }

    if (edge == null) {
      edge = new StandardEdge()
    }

    return edge as Edge
  }

  validateConnection(
    sourceView: CellView | null | undefined,
    sourceMagnet: Element | null | undefined,
    targetView: CellView | null | undefined,
    targetMagnet: Element | null | undefined,
    terminalType: Edge.TerminalType,
    edgeView?: EdgeView,
  ) {
    const validate = this.options.connecting.validateConnection
    return validate
      ? FunctionExt.call(validate, this.graph, {
          edgeView,
          sourceView,
          sourceMagnet,
          targetView,
          targetMagnet,
          sourceCell: sourceView ? sourceView.cell : null,
          targetCell: targetView ? targetView.cell : null,
          edge: edgeView ? edgeView.cell : null,
          type: terminalType,
        })
      : true
  }

  getRestrictArea(view?: NodeView): Rectangle.RectangleLike | null {
    const restrict = this.options.translating.restrict

    if (typeof restrict === 'function') {
      return FunctionExt.call(restrict, this.graph, view!)
    }

    if (restrict === true) {
      return this.graph.transform.getGraphArea()
    }

    return restrict || null
  }

  @Decorator.after()
  onViewUpdated(
    view: CellView,
    flag: number,
    options: Renderer.RequestViewUpdateOptions,
  ) {
    if (flag & Renderer.FLAG_INSERT || options.mounting) {
      return
    }
    this.graph.renderer.requestConnectedEdgesUpdate(view, options)
  }

  @Decorator.after()
  onViewPostponed(
    view: CellView,
    flag: number,
    options: Renderer.UpdateViewOptions,
  ) {
    return this.graph.renderer.forcePostponedViewUpdate(view, flag)
  }

  @Decorator.hook()
  getCellView(
    cell: Cell,
  ): null | undefined | typeof CellView | (new (...args: any[]) => CellView) {
    return null
  }

  @Decorator.hook(true)
  createCellView(cell: Cell) {
    const options = { interacting: this.options.interacting }

    const ctor = this.getCellView(cell)
    if (ctor) {
      return new ctor(cell, options)
    }

    const view = cell.view
    if (view != null && typeof view === 'string') {
      const def = CellView.registry.get(view)
      if (def) {
        return new def(cell, options)
      }

      return CellView.registry.onNotFound(view)
    }

    if (cell.isNode()) {
      return new NodeView(cell, options)
    }

    if (cell.isEdge()) {
      return new EdgeView(cell, options)
    }

    return null
  }

  @Decorator.hook()
  getHTMLComponent(node: HTML): HTMLElement | string | null | undefined {
    let ret = node.getHTML()
    if (typeof ret === 'string') {
      ret = HTML.componentRegistry.get(ret) || ret
    }

    if (typeof ret === 'function') {
      return FunctionExt.call(ret, this.graph, node)
    }

    return ret
  }

  @Decorator.hook()
  onEdgeLabelRendered(args: Hook.OnEdgeLabelRenderedArgs) {}

  @Decorator.hook()
  onPortRendered(args: Hook.OnPortRenderedArgs) {}

  @Decorator.hook()
  onToolItemCreated(args: Hook.OnToolItemCreatedArgs) {}
}

export namespace Hook {
  type CreateManager<T> = (this: Graph) => T
  type CreateManagerWidthNode<T> = (this: Graph, node: Node) => T
  type CreateManagerWidthOptions<T, Options> = (
    this: Graph,
    options: Options,
  ) => T

  export interface OnEdgeLabelRenderedArgs {
    edge: Edge
    label: Edge.Label
    container: Element
    selectors: Markup.Selectors
  }

  export interface OnPortRenderedArgs {
    node: Node
    port: PortManager.Port
    container: Element
    selectors?: Markup.Selectors
    labelContainer: Element
    labelSelectors?: Markup.Selectors
    contentContainer: Element
    contentSelectors?: Markup.Selectors
  }

  export interface OnToolItemCreatedArgs {
    name: string
    cell: Cell
    view: CellView
    tool: View
  }

  export interface IHook {
    createView: CreateManager<GraphView>
    createModel: CreateManager<Model>
    createRenderer: CreateManager<Renderer>
    createDefsManager: CreateManager<DefsManager>
    createGridManager: CreateManager<GridManager>
    createCoordManager: CreateManager<CoordManager>
    createHighlightManager: CreateManager<HighlightManager>
    createBackgroundManager: CreateManager<BackgroundManager>

    createTransform: CreateManagerWidthNode<Transform | null>
    createTransformManager: CreateManager<TransformManager>

    createClipboard: CreateManager<Clipboard>
    createClipboardManager: CreateManager<ClipboardManager>

    createSnapline: CreateManager<Snapline>
    createSnaplineManager: CreateManager<SnaplineManager>

    createSelection: CreateManager<Selection>
    createSelectionManager: CreateManager<SelectionManager>
    allowRubberband: (e: JQuery.MouseDownEvent) => boolean

    createHistoryManager: CreateManagerWidthOptions<
      HistoryManager,
      HistoryManager.Options
    >

    createScroller: CreateManager<Scroller | null>
    createScrollerManager: CreateManager<ScrollerManager>
    allowPanning: (e: JQuery.MouseDownEvent) => boolean

    createMiniMap: CreateManager<MiniMap | null>
    createMiniMapManager: CreateManager<MiniMapManager>

    createKeyboard: CreateManager<Keyboard>
    createMouseWheel: CreateManager<MouseWheel>
    createPrintManager: CreateManager<PrintManager>
    createFormatManager: CreateManager<FormatManager>

    createCellView(this: Graph, cell: Cell): CellView | null | undefined

    getCellView(
      this: Graph,
      cell: Cell,
    ): null | undefined | typeof CellView | (new (...args: any[]) => CellView)

    getHTMLComponent(
      this: Graph,
      node: HTML,
    ): HTMLElement | string | null | undefined

    onViewUpdated: (
      this: Graph,
      view: CellView,
      flag: number,
      options: Renderer.RequestViewUpdateOptions,
    ) => void

    onViewPostponed: (
      this: Graph,
      view: CellView,
      flag: number,
      options: Renderer.UpdateViewOptions,
    ) => boolean

    onEdgeLabelRendered(this: Graph, args: OnEdgeLabelRenderedArgs): void

    onPortRendered(this: Graph, args: OnPortRenderedArgs): void

    onToolItemCreated(this: Graph, args: OnToolItemCreatedArgs): void
  }
}
