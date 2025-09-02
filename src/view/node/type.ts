import type { Dom } from '../../common'
import type { Point, Rectangle } from '../../geometry'
import type { Graph } from '../../graph'
import type { Node } from '../../model/node'
import type { CellView } from '../cell'
import type { EdgeView } from '../edge'
import type { MarkupSelectors } from '../markup'
import type { NodeView } from '.'

export interface NodeViewOptions extends CellView.Options {}

export interface NodeViewPortCache {
  portElement: Element
  portSelectors?: MarkupSelectors | null
  portLabelElement?: Element
  portLabelSelectors?: MarkupSelectors | null
  portContentElement?: Element
  portContentSelectors?: MarkupSelectors | null
}

export interface NodeViewMagnetEventArgs {
  magnet: Element
}

export interface NodeViewMouseEventArgs<E> {
  e: E
  node: Node
  cell: Node
  view: NodeView
  port?: string
}
export interface NodeViewPositionEventArgs<E>
  extends NodeViewMouseEventArgs<E>,
    CellView.PositionEventArgs {}

export interface NodeViewTranslateEventArgs<E>
  extends NodeViewPositionEventArgs<E> {}

export interface NodeViewResizeEventArgs<E>
  extends NodeViewPositionEventArgs<E> {}

export interface NodeViewRotateEventArgs<E>
  extends NodeViewPositionEventArgs<E> {}

export interface NodeViewEventArgs {
  'node:click': NodeViewPositionEventArgs<Dom.ClickEvent>
  'node:dblclick': NodeViewPositionEventArgs<Dom.DoubleClickEvent>
  'node:contextmenu': NodeViewPositionEventArgs<Dom.ContextMenuEvent>
  'node:mousedown': NodeViewPositionEventArgs<Dom.MouseDownEvent>
  'node:mousemove': NodeViewPositionEventArgs<Dom.MouseMoveEvent>
  'node:mouseup': NodeViewPositionEventArgs<Dom.MouseUpEvent>
  'node:mouseover': NodeViewMouseEventArgs<Dom.MouseOverEvent>
  'node:mouseout': NodeViewMouseEventArgs<Dom.MouseOutEvent>
  'node:mouseenter': NodeViewMouseEventArgs<Dom.MouseEnterEvent>
  'node:mouseleave': NodeViewMouseEventArgs<Dom.MouseLeaveEvent>
  'node:mousewheel': NodeViewPositionEventArgs<Dom.EventObject> &
    CellView.MouseDeltaEventArgs

  'node:port:click': NodeViewPositionEventArgs<Dom.ClickEvent>
  'node:port:dblclick': NodeViewPositionEventArgs<Dom.DoubleClickEvent>
  'node:port:contextmenu': NodeViewPositionEventArgs<Dom.ContextMenuEvent>
  'node:port:mousedown': NodeViewPositionEventArgs<Dom.MouseDownEvent>
  'node:port:mousemove': NodeViewPositionEventArgs<Dom.MouseMoveEvent>
  'node:port:mouseup': NodeViewPositionEventArgs<Dom.MouseUpEvent>
  'node:port:mouseover': NodeViewMouseEventArgs<Dom.MouseOverEvent>
  'node:port:mouseout': NodeViewMouseEventArgs<Dom.MouseOutEvent>
  'node:port:mouseenter': NodeViewMouseEventArgs<Dom.MouseEnterEvent>
  'node:port:mouseleave': NodeViewMouseEventArgs<Dom.MouseLeaveEvent>

  'node:customevent': NodeViewPositionEventArgs<Dom.MouseDownEvent> & {
    name: string
  }

  'node:unhandled:mousedown': NodeViewPositionEventArgs<Dom.MouseDownEvent>

  'node:highlight': {
    magnet: Element
    view: NodeView
    node: Node
    cell: Node
    options: CellView.HighlightOptions
  }
  'node:unhighlight': NodeViewEventArgs['node:highlight']

  'node:magnet:click': NodeViewPositionEventArgs<Dom.MouseUpEvent> &
    NodeViewMagnetEventArgs
  'node:magnet:dblclick': NodeViewPositionEventArgs<Dom.DoubleClickEvent> &
    NodeViewMagnetEventArgs
  'node:magnet:contextmenu': NodeViewPositionEventArgs<Dom.ContextMenuEvent> &
    NodeViewMagnetEventArgs

  'node:move': NodeViewPositionEventArgs<Dom.MouseMoveEvent>
  'node:moving': NodeViewPositionEventArgs<Dom.MouseMoveEvent>
  'node:moved': NodeViewPositionEventArgs<Dom.MouseUpEvent>

  'node:embed': NodeViewPositionEventArgs<Dom.MouseMoveEvent> & {
    currentParent: Node | null
  }
  'node:embedding': NodeViewPositionEventArgs<Dom.MouseMoveEvent> & {
    currentParent: Node | null
    candidateParent: Node | null
  }
  'node:embedded': NodeViewPositionEventArgs<Dom.MouseUpEvent> & {
    currentParent: Node | null
    previousParent: Node | null
  }
}

export type EventDataMousemove = EventDataMoving | EventDataMagnet

export interface EventDataMagnet {
  action: 'magnet'
  targetMagnet: Element
  edgeView?: EdgeView
}

export interface EventDataMoving {
  action: 'move'
  targetView: NodeView
}

export interface EventDataMovingTargetNode {
  moving: boolean
  offset: Point.PointLike
  restrict?: Rectangle.RectangleLike | null
  embedding?: boolean
  candidateEmbedView?: NodeView | null
  cell?: Node
  graph?: Graph
}
