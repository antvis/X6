import type { Dom, KeyValue } from '../../common'
import type { Point } from '../../geometry'
import type { Cell, Edge } from '../../model'
import type { CellView } from '../cell'
import type {
  CellViewHighlightOptions,
  CellViewMouseDeltaEventArgs,
  CellViewOptions,
  CellViewPositionEventArgs,
} from '../cell/type'
import type { EdgeView } from '.'

export interface EdgeViewOptions extends CellViewOptions {}

export interface EdgeViewMouseEventArgs<E> {
  e: E
  edge: Edge
  cell: Edge
  view: EdgeView
}

export interface EdgeViewPositionEventArgs<E>
  extends EdgeViewMouseEventArgs<E>,
    CellViewPositionEventArgs {}

export interface EdgeViewEventArgs {
  'edge:click': EdgeViewPositionEventArgs<Dom.ClickEvent>
  'edge:dblclick': EdgeViewPositionEventArgs<Dom.DoubleClickEvent>
  'edge:contextmenu': EdgeViewPositionEventArgs<Dom.ContextMenuEvent>
  'edge:mousedown': EdgeViewPositionEventArgs<Dom.MouseDownEvent>
  'edge:mousemove': EdgeViewPositionEventArgs<Dom.MouseMoveEvent>
  'edge:mouseup': EdgeViewPositionEventArgs<Dom.MouseUpEvent>
  'edge:mouseover': EdgeViewMouseEventArgs<Dom.MouseOverEvent>
  'edge:mouseout': EdgeViewMouseEventArgs<Dom.MouseOutEvent>
  'edge:mouseenter': EdgeViewMouseEventArgs<Dom.MouseEnterEvent>
  'edge:mouseleave': EdgeViewMouseEventArgs<Dom.MouseLeaveEvent>
  'edge:mousewheel': EdgeViewPositionEventArgs<Dom.EventObject> &
    CellViewMouseDeltaEventArgs

  'edge:customevent': EdgeViewPositionEventArgs<Dom.MouseDownEvent> & {
    name: string
  }

  'edge:unhandled:mousedown': EdgeViewPositionEventArgs<Dom.MouseDownEvent>

  'edge:connected': {
    e: Dom.MouseUpEvent
    edge: Edge
    view: EdgeView
    isNew: boolean
    type: Edge.TerminalType
    previousCell?: Cell | null
    previousView?: CellView | null
    previousPort?: string | null
    previousPoint?: Point.PointLike | null
    previousMagnet?: Element | null
    currentCell?: Cell | null
    currentView?: CellView | null
    currentPort?: string | null
    currentPoint?: Point.PointLike | null
    currentMagnet?: Element | null
  }

  'edge:highlight': {
    magnet: Element
    view: EdgeView
    edge: Edge
    cell: Edge
    options: CellViewHighlightOptions
  }
  'edge:unhighlight': EdgeViewEventArgs['edge:highlight']

  'edge:move': EdgeViewPositionEventArgs<Dom.MouseMoveEvent>
  'edge:moving': EdgeViewPositionEventArgs<Dom.MouseMoveEvent>
  'edge:moved': EdgeViewPositionEventArgs<Dom.MouseUpEvent>
}

export type MousemoveEventData = {}

export interface EventDataEdgeDragging {
  action: 'drag-edge'
  moving: boolean
  x: number
  y: number
}

export type EventDataValidateConnectionArgs = [
  CellView | null | undefined, // source view
  Element | null | undefined, // source magnet
  CellView | null | undefined, // target view
  Element | null | undefined, // target magnet
  Edge.TerminalType,
  EdgeView,
]

export interface EventDataArrowheadDragging {
  action: 'drag-arrowhead'
  x: number
  y: number
  isNewEdge: boolean
  terminalType: Edge.TerminalType
  fallbackAction: 'remove' | 'revert'
  initialMagnet: Element | null
  initialTerminal: Edge.TerminalData
  getValidateConnectionArgs: (
    cellView: CellView,
    magnet: Element | null,
  ) => EventDataValidateConnectionArgs
  zIndex?: number | null
  pointerEvents?: string | null
  /**
   * Current event target.
   */
  currentTarget?: Element
  /**
   * Current view under pointer.
   */
  currentView?: CellView | null
  /**
   * Current magnet under pointer.
   */
  currentMagnet?: Element | null
  closestView?: CellView | null
  closestMagnet?: Element | null
  marked?: KeyValue<Element[]> | null
  options?: KeyValue
}

export interface EventDataLabelDragging {
  action: 'drag-label'
  index: number
  positionAngle: number
  positionArgs?: Edge.LabelPositionOptions | null
  stopPropagation: true
}
