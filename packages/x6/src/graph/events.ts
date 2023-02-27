import { Dom } from '@antv/x6-common'
import { Model } from '../model'
import { CellView } from '../view'
import { Scheduler } from '../renderer/scheduler'

interface CommonEventArgs<E> {
  e: E
}

interface PositionEventArgs<E> extends CommonEventArgs<E> {
  x: number
  y: number
}

export interface EventArgs
  extends Omit<Model.EventArgs, 'sorted' | 'updated' | 'reseted'>,
    CellView.EventArgs,
    Scheduler.EventArgs {
  'model:sorted'?: Model.EventArgs['sorted']
  'model:updated': Model.EventArgs['updated']
  'model:reseted': Model.EventArgs['reseted']

  'blank:click': PositionEventArgs<Dom.ClickEvent>
  'blank:dblclick': PositionEventArgs<Dom.DoubleClickEvent>
  'blank:contextmenu': PositionEventArgs<Dom.ContextMenuEvent>
  'blank:mousedown': PositionEventArgs<Dom.MouseDownEvent>
  'blank:mousemove': PositionEventArgs<Dom.MouseMoveEvent>
  'blank:mouseup': PositionEventArgs<Dom.MouseUpEvent>
  'blank:mouseout': CommonEventArgs<Dom.MouseOutEvent>
  'blank:mouseover': CommonEventArgs<Dom.MouseOverEvent>
  'graph:mouseenter': CommonEventArgs<Dom.MouseEnterEvent>
  'graph:mouseleave': CommonEventArgs<Dom.MouseLeaveEvent>
  'blank:mousewheel': PositionEventArgs<Dom.EventObject> & {
    delta: number
  }

  scale: { sx: number; sy: number; ox: number; oy: number }
  resize: { width: number; height: number }
  translate: { tx: number; ty: number }
}
