import { Util } from '../global'
import { ObjectExt } from '../util'
import { Rectangle } from '../geometry'
import { Nilable, KeyValue } from '../types'
import { Cell, Edge, Node, Model } from '../model'
import { CellView, NodeView, EdgeView } from '../view'
import { Edge as StandardEdge } from '../shape/standard/edge'
import {
  Router,
  Connector,
  NodeAnchor,
  EdgeAnchor,
  ConnectionPoint,
  ConnectionStrategy,
} from '../registry'
import { Widget } from '../addon/common'
import { Hook } from './hook'
import { Graph } from './graph'
import { GraphView } from './view'
import { GridManager } from './grid'
import { HistoryManager } from './history'
import { PanningManager } from './panning'
import { SnaplineManager } from './snapline'
import { ScrollerManager } from './scroller'
import { SelectionManager } from './selection'
import { ClipboardManager } from './clipboard'
import { HighlightManager } from './highlight'
import { BackgroundManager } from './background'
import { MiniMapManager } from './minimap'
import { Keyboard } from './keyboard'
import { MouseWheel } from './mousewheel'
import { Renderer } from './renderer'

export namespace Options {
  interface Common extends Partial<Hook.IHook> {
    container: HTMLElement
    model?: Model

    x: number
    y: number
    width: number
    height: number
    autoResize?: boolean | Element | Document

    background?: false | BackgroundManager.Options

    scaling: {
      min?: number
      max?: number
    }

    /**
     * The sorting type to use when rendering the views in this graph.
     *
     * - `exact` - render views according to their z-index. Views with
     *   different z-index are rendered in order, and views with the
     *   same z-index are rendered in the order in which they were added.
     *   This is by far the slowest option, present mainly for backwards
     *   compatibility.
     *
     * - `approx` - render views according to their z-index. Views with
     *   different z-index are rendered in order, but the ordering of views
     *   with the same z-index is indeterminate. Similar in functionality
     *   to the `exact` option, but much faster.
     *
     * - `none` - render views in an indeterminate order. (Note that this
     *   setting disables `toFront`/`toBack` methods.)
     */
    sorting: GraphView.SortType

    /**
     * Specify if the grapg uses asynchronous rendering to display cells.
     * This is very useful for adding a large number of cells into the graph.
     * The rendering performance boost is significant and it doesn't block
     * the UI. However, asynchronous rendering brings about some caveats:
     *
     * - The views of freshly added cells may not have yet been added to
     *   this graph's DOM.
     * - Some views may have been removed from the DOM by
     *   `graph.options.checkView` function.
     * - Views already present in the DOM may not have been updated to
     *   reflect changes made in this graph since the last render.
     *
     * For the methods that truly need a to refer to a CellView, one way to
     * prevent inconsistencies is to rely on the 'render:done' graph event.
     * This event signals that all scheduled updates are done and that the
     * state of cell views is consistent with the state of the cell models.
     *
     * Alternatively, you may trigger a manual update immediately before a
     * sensitive function call:
     *
     * - `graph.renderer.requireView()` - bring a single view into the DOM
     *    and update it.
     * - `graph.renderer.dumpViews()` - bring all views into the DOM and
     *    update them.
     * - `graph.renderer.updateViews()` - update all views.
     */
    async: boolean

    frozen: boolean

    /**
     * A callback function that is used to determine whether a given view
     * should be shown in an `async` graph. If the function returns `true`,
     * the view is attached to the DOM; if it returns `false`, the view is
     * detached from the DOM.
     */
    checkView?: Nilable<Renderer.CheckViewFn>

    /**
     * When defined as a number, it denotes the required mousemove events
     * before a new edge is created from a magnet. When defined as keyword
     * 'onleave', the edge is created when the pointer leaves the magnet
     * DOM element.
     */
    magnetThreshold: number | 'onleave'

    /**
     * Number of required mousemove events before the first mousemove
     * event will be triggered.
     */
    moveThreshold: number

    /**
     * Allowed number of mousemove events after which the click event
     * will be still triggered.
     */
    clickThreshold: number

    /**
     * Prevent the default context menu from being displayed.
     */
    preventDefaultContextMenu:
      | boolean
      | ((this: Graph, { view }: { view: CellView | null }) => boolean)

    preventDefaultDblClick: boolean

    preventDefaultMouseDown: boolean

    /**
     * Prevents default action when an empty graph area is clicked.
     * Setting the option to `false` will make the graph pannable
     * inside a container on touch devices.
     *
     * It defaults to `true`.
     */
    preventDefaultBlankAction: boolean

    interacting: CellView.Interacting

    /**
     * Guard the graph from handling a UI event. Returns `true` if you want
     * to prevent the graph from handling the event evt, `false` otherwise.
     * This is an advanced option that can be useful if you have your own
     * logic for handling events.
     */
    guard: (e: JQuery.TriggeredEvent, view?: CellView | null) => boolean
  }

  export interface ManualBooleans {
    rotating: boolean | Partial<Rotating>
    resizing: boolean | Partial<Resizing>
    embedding: boolean | Partial<Embedding>
    selecting: boolean | Partial<SelectionManager.Options>
    snapline: boolean | Partial<SnaplineManager.Options>
    panning: boolean | Partial<PanningManager.Options>
    clipboard: boolean | Partial<ClipboardManager.Options>
    history: boolean | Partial<HistoryManager.CommonOptions>
    scroller: boolean | Partial<ScrollerManager.Options>
    minimap: boolean | Partial<MiniMapManager.Options>
    keyboard: boolean | Partial<Omit<Keyboard.Options, 'graph'>>
    mousewheel: boolean | Partial<Omit<MouseWheel.Options, 'graph'>>
    knob: boolean | Partial<Knob>
  }

  export interface Manual extends Partial<Common>, Partial<ManualBooleans> {
    grid?:
      | boolean
      | number
      | (Partial<GridManager.CommonOptions> & GridManager.DrawGridOptions)
    connecting?: Partial<Connecting>
    translating?: Partial<Translating>
    transforming?: Partial<Transforming>
    highlighting?: Partial<Highlighting>
  }

  export interface Definition extends Common {
    grid: GridManager.Options
    connecting: Connecting
    rotating: Rotating
    resizing: Resizing
    translating: Translating
    transforming: Transforming
    highlighting: Highlighting
    embedding: Embedding
    panning: PanningManager.Options
    selecting: SelectionManager.Options
    snapline: SnaplineManager.Options
    clipboard: ClipboardManager.Options
    history: HistoryManager.CommonOptions
    scroller: ScrollerManager.Options
    minimap: MiniMapManager.Options
    keyboard: Omit<Keyboard.Options, 'graph'>
    mousewheel: Omit<MouseWheel.Options, 'graph'>
    knob: Knob
  }
}

export namespace Options {
  type OptionItem<T, S> = S | ((this: Graph, arg: T) => S)

  export function parseOptionGroup<
    K extends KeyValue,
    S extends KeyValue = KeyValue,
    T = any,
  >(graph: Graph, arg: T, options: S): K {
    const result: any = {}
    Object.keys(options || {}).forEach((key) => {
      const val = options[key]
      result[key] = typeof val === 'function' ? val.call(graph, arg) : val
    })
    return result
  }

  type NodeAnchorOptions =
    | string
    | NodeAnchor.NativeItem
    | NodeAnchor.ManaualItem
  type EdgeAnchorOptions =
    | string
    | EdgeAnchor.NativeItem
    | EdgeAnchor.ManaualItem
  type ConnectionPointOptions =
    | string
    | ConnectionPoint.NativeItem
    | ConnectionPoint.ManaualItem

  export interface Connecting {
    /**
     * Snap edge to the closest node/port in the given radius on dragging.
     */
    snap: boolean | { radius: number }

    /**
     * @deprecated
     * When set to `false`, edges can not be pinned to the graph meaning a
     * source/target of a edge can be a point on the graph.
     */
    dangling:
      | boolean
      | ((
          this: Graph,
          args: {
            edge: Edge
            sourceCell?: Cell | null
            targetCell?: Cell | null
            sourcePort?: string
            targetPort?: string
          },
        ) => boolean)

    /**
     * @deprecated
     * When set to `false`, an node may not have more than one edge with the
     * same source and target node.
     */
    multi:
      | boolean
      | ((
          this: Graph,
          args: {
            edge: Edge
            sourceCell?: Cell | null
            targetCell?: Cell | null
            sourcePort?: string
            targetPort?: string
          },
        ) => boolean)

    /**
     * Specify whether connect to point on the graph is allowed.
     */
    allowBlank?:
      | boolean
      | ((this: Graph, args: ValidateConnectionArgs) => boolean)

    /**
     * When set to `false`, edges can not be connected to the same node,
     * meaning the source and target of the edge can not be the same node.
     */
    allowLoop:
      | boolean
      | ((this: Graph, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether connect to node(not the port on the node) is allowed.
     */
    allowNode:
      | boolean
      | ((this: Graph, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether connect to edge is allowed.
     */
    allowEdge:
      | boolean
      | ((this: Graph, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether connect to port is allowed.
     */
    allowPort:
      | boolean
      | ((this: Graph, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether more than one edge connected to the same source and
     * target node is allowed.
     */
    allowMulti?:
      | boolean
      | 'withPort'
      | ((this: Graph, args: ValidateConnectionArgs) => boolean)

    /**
     * Highlights all the available magnets or nodes when a edge is
     * dragging(reconnecting). This gives a hint to the user to what
     * other nodes/ports this edge can be connected. What magnets/cells
     * are available is determined by the `validateConnection` function.
     */
    highlight: boolean

    anchor: NodeAnchorOptions
    sourceAnchor?: NodeAnchorOptions
    targetAnchor?: NodeAnchorOptions
    edgeAnchor: EdgeAnchorOptions
    sourceEdgeAnchor?: EdgeAnchorOptions
    targetEdgeAnchor?: EdgeAnchorOptions

    connectionPoint: ConnectionPointOptions
    sourceConnectionPoint?: ConnectionPointOptions
    targetConnectionPoint?: ConnectionPointOptions

    router: string | Router.NativeItem | Router.ManaualItem
    connector: string | Connector.NativeItem | Connector.ManaualItem
    strategy?:
      | string
      | ConnectionStrategy.NativeItem
      | ConnectionPoint.ManaualItem
      | null

    /**
     * Check whether to add a new edge to the graph when user clicks
     * on an a magnet.
     */
    validateMagnet?: (
      this: Graph,
      args: {
        cell: Cell
        view: CellView
        magnet: Element
        e: JQuery.MouseDownEvent | JQuery.MouseEnterEvent
      },
    ) => boolean

    createEdge?: (
      this: Graph,
      args: {
        sourceCell: Cell
        sourceView: CellView
        sourceMagnet: Element
      },
    ) => Nilable<Edge> | void

    /**
     * Custom validation on stop draggin the edge arrowhead(source/target).
     * If the function returns `false`, the edge is either removed(edges
     * which are created during the interaction) or reverted to the state
     * before the interaction.
     */
    validateEdge?: (
      this: Graph,
      args: {
        edge: Edge
        type: Edge.TerminalType
        previous: Edge.TerminalData
      },
    ) => boolean

    /**
     * Check whether to allow or disallow the edge connection while an
     * arrowhead end (source/target) being changed.
     */
    validateConnection: (this: Graph, args: ValidateConnectionArgs) => boolean
  }

  export interface ValidateConnectionArgs {
    type?: Edge.TerminalType | null
    edge?: Edge | null
    edgeView?: EdgeView | null
    sourceCell?: Cell | null
    targetCell?: Cell | null
    sourceView?: CellView | null
    targetView?: CellView | null
    sourcePort?: string | null
    targetPort?: string | null
    sourceMagnet?: Element | null
    targetMagnet?: Element | null
  }

  export interface TransformingRaw extends Widget.Options {}

  export type Transforming = {
    [K in keyof TransformingRaw]?: OptionItem<Node, TransformingRaw[K]>
  }

  export interface KnobRaw extends Widget.Options {
    enabled?: boolean
  }

  export type Knob = {
    [K in keyof KnobRaw]?: OptionItem<Node, KnobRaw[K]>
  }

  export interface Translating {
    /**
     * Restrict the translation (movement) of nodes by a given bounding box.
     * If set to `true`, the user will not be able to move nodes outside the
     * boundary of the graph area.
     */
    restrict:
      | boolean
      | OptionItem<CellView, Rectangle.RectangleLike | number | null>
  }

  export interface RotatingRaw {
    enabled?: boolean
    grid?: number
  }

  export type Rotating = {
    [K in keyof RotatingRaw]?: OptionItem<Node, RotatingRaw[K]>
  }

  export interface ResizingRaw {
    enabled?: boolean
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    orthogonal?: boolean
    restrict?: boolean | number
    /**
     * **Deprecation Notice:** resizing option `restricted` is deprecated and
     * will be moved in next major release. Use `restrict` instead.
     *
     * @deprecated
     */
    restricted?: boolean | number
    autoScroll?: boolean
    preserveAspectRatio?: boolean
    allowReverse?: boolean
  }

  export type Resizing = {
    [K in keyof ResizingRaw]?: OptionItem<Node, ResizingRaw[K]>
  }

  export interface Embedding {
    enabled?: boolean

    /**
     * Determines the way how a cell finds a suitable parent when it's dragged
     * over the graph. The cell with the highest z-index (visually on the top)
     * will be chosen.
     */
    findParent?:
      | 'bbox'
      | 'center'
      | 'topLeft'
      | 'topRight'
      | 'bottomLeft'
      | 'bottomRight'
      | ((this: Graph, args: { node: Node; view: NodeView }) => Cell[])

    /**
     * If enabled only the node on the very front is taken into account for the
     * embedding. If disabled the nodes under the dragged view are tested one by
     * one (from front to back) until a valid parent found.
     */
    frontOnly?: boolean

    /**
     * Check whether to allow or disallow the node embedding while it's being
     * translated. By default, all nodes can be embedded into all other nodes.
     */
    validate: (
      this: Graph,
      args: {
        child: Node
        parent: Node
        childView: CellView
        parentView: CellView
      },
    ) => boolean
  }

  /**
   * Configure which highlighter to use (and with which options) for
   * each type of interaction.
   */
  export interface Highlighting {
    /**
     * The default highlighter to use (and options) when none is specified
     */
    default: HighlightManager.Options
    /**
     * When a cell is dragged over another cell in embedding mode.
     */
    embedding?: HighlightManager.Options | null
    /**
     * When showing all nodes to which a valid connection can be made.
     */
    nodeAvailable?: HighlightManager.Options | null
    /**
     * When showing all magnets to which a valid connection can be made.
     */
    magnetAvailable?: HighlightManager.Options | null
    /**
     * When a valid edge connection can be made to an node.
     */
    magnetAdsorbed?: HighlightManager.Options | null
  }
}

export namespace Options {
  export function get(options: Partial<Manual>) {
    const {
      grid,
      panning,
      selecting,
      embedding,
      snapline,
      resizing,
      rotating,
      knob,
      clipboard,
      history,
      scroller,
      minimap,
      keyboard,
      mousewheel,
      ...others
    } = options

    // size
    // ----
    const container = options.container
    if (container != null) {
      if (others.width == null) {
        others.width = container.clientWidth
      }

      if (others.height == null) {
        others.height = container.clientHeight
      }
    } else {
      throw new Error(
        `Ensure the container of the graph is specified and valid`,
      )
    }

    const result = ObjectExt.merge({}, defaults, others) as Options.Definition

    // grid
    // ----
    const defaultGrid: GridManager.CommonOptions = { size: 10, visible: false }
    if (typeof grid === 'number') {
      result.grid = { size: grid, visible: false }
    } else if (typeof grid === 'boolean') {
      result.grid = { ...defaultGrid, visible: grid }
    } else {
      result.grid = { ...defaultGrid, ...grid }
    }

    // booleas
    // -------
    const booleas: (keyof Options.ManualBooleans)[] = [
      'panning',
      'selecting',
      'embedding',
      'snapline',
      'resizing',
      'rotating',
      'knob',
      'clipboard',
      'history',
      'scroller',
      'minimap',
      'keyboard',
      'mousewheel',
    ]

    booleas.forEach((key) => {
      const val = options[key]
      if (typeof val === 'boolean') {
        result[key].enabled = val
      } else {
        result[key] = {
          ...result[key],
          ...(val as any),
        }
      }
    })

    // background
    // ----------
    if (
      result.background &&
      result.scroller.enabled &&
      result.scroller.background == null
    ) {
      result.scroller.background = result.background
      delete result.background
    }

    return result
  }
}

export namespace Options {
  export const defaults: Partial<Definition> = {
    x: 0,
    y: 0,
    grid: {
      size: 10,
      visible: false,
    },
    scaling: {
      min: 0.01,
      max: 16,
    },
    background: false,
    highlighting: {
      default: {
        name: 'stroke',
        args: {
          padding: 3,
        },
      },
      nodeAvailable: {
        name: 'className',
        args: {
          className: Util.prefix('available-node'),
        },
      },
      magnetAvailable: {
        name: 'className',
        args: {
          className: Util.prefix('available-magnet'),
        },
      },
    },
    connecting: {
      snap: false,
      multi: true,
      // TODO: Unannotation the next line when the `multi` option was removed in the next major version.
      // allowMulti: true,
      dangling: true,
      // TODO: Unannotation the next line when the `dangling` option was removed in the next major version.
      // allowBlank: true,
      allowLoop: true,
      allowNode: true,
      allowEdge: false,
      allowPort: true,
      highlight: false,

      anchor: 'center',
      edgeAnchor: 'ratio',
      connectionPoint: 'boundary',
      strategy: null,
      router: 'normal',
      connector: 'normal',

      validateConnection(this: Graph, { type, sourceView, targetView }) {
        const view = type === 'target' ? targetView : sourceView
        return view != null
      },

      createEdge() {
        return new StandardEdge()
      },
    },
    transforming: {
      clearAll: true,
      clearOnBlankMouseDown: true,
    },
    resizing: {
      enabled: false,
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_SAFE_INTEGER,
      maxHeight: Number.MAX_SAFE_INTEGER,
      orthogonal: true,
      restricted: false,
      autoScroll: true,
      preserveAspectRatio: false,
      allowReverse: true,
    },
    rotating: {
      enabled: false,
      grid: 15,
    },
    translating: {
      restrict: false,
    },
    knob: {
      enabled: false,
      clearAll: true,
      clearOnBlankMouseDown: true,
    },
    embedding: {
      enabled: false,
      findParent: 'bbox',
      frontOnly: true,
      validate: () => true,
    },
    selecting: {
      enabled: false,
      rubberband: false,
      rubberNode: true,
      rubberEdge: false, // next version will set to true
      pointerEvents: 'auto',
      multiple: true,
      multipleSelectionModifiers: ['ctrl', 'meta'],
      movable: true,
      strict: false,
      useCellGeometry: false,
      selectCellOnMoved: false,
      selectNodeOnMoved: false,
      selectEdgeOnMoved: false,
      content: null,
      handles: null,
    },
    panning: {
      enabled: false,
      eventTypes: ['leftMouseDown'],
    },
    snapline: {
      enabled: false,
    },
    clipboard: {
      enabled: false,
    },
    history: {
      enabled: false,
    },
    scroller: {
      enabled: false,
    },
    keyboard: {
      enabled: false,
    },
    mousewheel: {
      enabled: false,
      factor: 1.2,
      zoomAtMousePosition: true,
    },

    async: false,
    frozen: false,
    sorting: 'exact',

    moveThreshold: 0,
    clickThreshold: 0,
    magnetThreshold: 0,
    preventDefaultDblClick: true,
    preventDefaultMouseDown: false,
    preventDefaultContextMenu: true,
    preventDefaultBlankAction: true,
    interacting: {
      edgeLabelMovable: false,
    },
    guard: () => false,
  }
}
