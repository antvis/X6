import { FunctionExt } from '../util'
import { CellView, EdgeView } from '../view'
import { Node } from '../model/node'
import { Edge } from '../model/edge'
import { Model } from '../model/model'
import { Widget } from '../addon/common'
import { MiniMap } from '../addon/minimap'
import { Snapline } from '../addon/snapline'
import { Scroller } from '../addon/scroller'
import { Selection } from '../addon/selection'
import { Clipboard } from '../addon/clipboard'
import { Transform } from '../addon/transform'
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

namespace Decorator {
  export function hook(nilable?: boolean, hookName?: string | null) {
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
          delete this.getNativeValue
          if (ret != null || nilable === true) {
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
  public getNativeValue: <T>() => T | null

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

  validateEdge(edge: Edge) {
    const options = this.options.connecting

    if (!options.multi) {
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

    if (!options.dangling) {
      const sourceId = edge.getSourceCellId()
      const targetId = edge.getTargetCellId()
      if (!(sourceId && targetId)) {
        return false
      }
    }

    const validate = this.options.connecting.validateEdge
    if (validate) {
      return validate.call(this.graph, edge)
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
        return validate.call(this.graph, cellView, magnet, e)
      }
      return true
    }
    return false
  }

  getDefaultEdge(cellView: CellView, magnet: Element) {
    const create = this.options.connecting.createEdge
    let edge: Edge | undefined
    if (create) {
      edge = create.call(this.graph, cellView, magnet)
    }
    if (edge == null) {
      edge = new Edge()
    }
    return edge!
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
      ? validate.call(
          this.graph,
          sourceView,
          sourceMagnet,
          targetView,
          targetMagnet,
          terminalType,
          edgeView,
        )
      : true
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
}

export namespace Hook {
  type CreateManager<T> = (this: Graph) => T
  type CreateManagerWidthNode<T> = (this: Graph, node: Node) => T
  type CreateManagerWidthOptions<T, Options> = (
    this: Graph,
    options: Options,
  ) => T

  export interface IHook {
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
  }
}
