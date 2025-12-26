import type { Dom, KeyValue } from '../../common'
import type { Graph } from '../../graph'
import type { Cell } from '../../model'
import type { ViewEvents } from '../../types'
import type { EdgeViewEventArgs } from '../edge/type'
import type { FlagManagerActions } from '../flag'
import type { NodeViewEventArgs } from '../node/type'
import type { CellView } from '.'

export * from './type'

export interface CellViewOptions {
  graph: Graph
  priority: number
  isSvgElement: boolean
  rootSelector: string
  bootstrap: FlagManagerActions
  actions: KeyValue<FlagManagerActions>
  events?: ViewEvents | null
  documentEvents?: ViewEvents | null
}

type Interactable = boolean | ((this: Graph, cellView: CellView) => boolean)

interface InteractionMap {
  // edge
  edgeMovable?: Interactable
  edgeLabelMovable?: Interactable
  arrowheadMovable?: Interactable
  vertexMovable?: Interactable
  vertexAddable?: Interactable
  vertexDeletable?: Interactable
  useEdgeTools?: Interactable

  // node
  nodeMovable?: Interactable
  magnetConnectable?: Interactable
  stopDelegateOnDragging?: Interactable

  // general
  toolsAddable?: Interactable
}

export type CellViewInteractionNames = keyof InteractionMap

export type CellViewInteracting =
  | boolean
  | InteractionMap
  | ((this: Graph, cellView: CellView) => InteractionMap | boolean)

export interface CellViewHighlightOptions {
  highlighter?:
    | string
    | {
        name: string
        args: KeyValue
      }

  type?: 'embedding' | 'nodeAvailable' | 'magnetAvailable' | 'magnetAdsorbed'

  partial?: boolean
}

export interface CellViewPositionEventArgs {
  x: number
  y: number
}

export interface CellViewMouseDeltaEventArgs {
  delta: number
}

export interface CellViewMouseEventArgs<E> {
  e: E
  view: CellView
  cell: Cell
}

export interface CellViewMousePositionEventArgs<E>
  extends CellViewMouseEventArgs<E>,
    CellViewPositionEventArgs {}

export interface CellViewEventArgs
  extends NodeViewEventArgs,
    EdgeViewEventArgs {
  'cell:click': CellViewMousePositionEventArgs<Dom.ClickEvent>
  'cell:dblclick': CellViewMousePositionEventArgs<Dom.DoubleClickEvent>
  'cell:contextmenu': CellViewMousePositionEventArgs<Dom.ContextMenuEvent>
  'cell:mousedown': CellViewMousePositionEventArgs<Dom.MouseDownEvent>
  'cell:mousemove': CellViewMousePositionEventArgs<Dom.MouseMoveEvent>
  'cell:mouseup': CellViewMousePositionEventArgs<Dom.MouseUpEvent>
  'cell:mouseover': CellViewMouseEventArgs<Dom.MouseOverEvent>
  'cell:mouseout': CellViewMouseEventArgs<Dom.MouseOutEvent>
  'cell:mouseenter': CellViewMouseEventArgs<Dom.MouseEnterEvent>
  'cell:mouseleave': CellViewMouseEventArgs<Dom.MouseLeaveEvent>
  'cell:mousewheel': CellViewMousePositionEventArgs<Dom.EventObject> &
    CellViewMouseDeltaEventArgs
  'cell:customevent': CellViewMousePositionEventArgs<Dom.MouseDownEvent> & {
    name: string
  }
  'cell:highlight': {
    magnet: Element
    view: CellView
    cell: Cell
    options: CellViewHighlightOptions
  }
  'cell:unhighlight': CellViewEventArgs['cell:highlight']
  'view:render': { view: CellView }
}

type CellViewClass = typeof CellView

export interface CellViewDefinition extends CellViewClass {
  new <
    Entity extends Cell = Cell,
    Options extends CellViewOptions = CellViewOptions,
  >(
    cell: Entity,
    options: Partial<Options>,
  ): CellView
}
