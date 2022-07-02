import { Dom, Nilable } from '@antv/x6-common'
import { Rectangle } from '@antv/x6-geometry'
import { View, CellView, NodeView, EdgeView } from '../view'
import { Model, Cell, Node, Edge } from '../model'
import {
  Router,
  Connector,
  NodeAnchor,
  EdgeAnchor,
  ConnectionPoint,
} from '../registry'
import { Renderer } from '../renderer'
import { HighlightManager } from '../renderer/highlight'

export namespace Options {
  export interface Common {
    container: HTMLElement
    model?: Model

    moveThreshold: 0
    clickThreshold: number
    magnetThreshold: number | 'onleave'
    preventDefaultDblClick: boolean
    preventDefaultContextMenu: boolean
    preventDefaultMouseDown: boolean
    preventDefaultBlankAction: boolean

    interacting: CellView.Interacting

    getGraphArea: () => Rectangle
    getGridSize: () => number
    guard: (e: Dom.EventObject, view?: CellView | null) => boolean
    onToolItemCreated: (args: {
      name: string
      cell: Cell
      view: CellView
      tool: View
    }) => void
  }
  export interface ManualBooleans {
    embedding: boolean | Partial<Embedding>
  }
  export interface Manual extends Partial<Common>, Partial<ManualBooleans> {
    connecting?: Partial<Connecting>
    translating?: Partial<Translating>
    highlighting?: Partial<Highlighting>
  }
  export interface Definition extends Common {
    embedding: Embedding
    connecting: Connecting
    translating: Translating
    highlighting: Highlighting
  }
}

export namespace Options {
  type OptionItem<T, S> = S | ((this: Renderer, arg: T) => S)

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
     * Specify whether connect to point on the graph is allowed.
     */
    allowBlank?:
      | boolean
      | ((this: Renderer, args: ValidateConnectionArgs) => boolean)

    /**
     * When set to `false`, edges can not be connected to the same node,
     * meaning the source and target of the edge can not be the same node.
     */
    allowLoop:
      | boolean
      | ((this: Renderer, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether connect to node(not the port on the node) is allowed.
     */
    allowNode:
      | boolean
      | ((this: Renderer, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether connect to edge is allowed.
     */
    allowEdge:
      | boolean
      | ((this: Renderer, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether connect to port is allowed.
     */
    allowPort:
      | boolean
      | ((this: Renderer, args: ValidateConnectionArgs) => boolean)

    /**
     * Specify whether more than one edge connected to the same source and
     * target node is allowed.
     */
    allowMulti?:
      | boolean
      | 'withPort'
      | ((this: Renderer, args: ValidateConnectionArgs) => boolean)

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

    /**
     * Check whether to add a new edge to the graph when user clicks
     * on an a magnet.
     */
    validateMagnet?: (
      this: Renderer,
      args: {
        cell: Cell
        view: CellView
        magnet: Element
        e: Dom.MouseDownEvent | Dom.MouseEnterEvent
      },
    ) => boolean

    createEdge?: (
      this: Renderer,
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
      this: Renderer,
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
    validateConnection: (
      this: Renderer,
      args: ValidateConnectionArgs,
    ) => boolean
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
      | ((this: Renderer, args: { node: Node; view: NodeView }) => Cell[])

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
      this: Renderer,
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
