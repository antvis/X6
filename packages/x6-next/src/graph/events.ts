import { Model, CellView } from '@antv/x6-core'
import { Dom } from '@antv/x6-common'

interface CommonEventArgs<E> {
  e: E
}

interface PositionEventArgs<E> extends CommonEventArgs<E> {
  x: number
  y: number
}

export interface EventArgs
  extends Omit<Model.EventArgs, 'sorted' | 'updated' | 'reseted'>,
    CellView.EventArgs {
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

  'tools:event': { name: string }
  'tools:remove'?: null
  'tools:hide'?: null
  'tools:show'?: null

  // 'render:done': {
  //   stats: {
  //     priority: number
  //     updatedCount: number
  //   }
  //   options: Renderer.UpdateViewsAsyncOptions
  // }

  scale: { sx: number; sy: number; ox: number; oy: number }
  resize: { width: number; height: number }
  translate: { tx: number; ty: number }
  freeze: { key?: string }
  unfreeze: { key?: string }
}
