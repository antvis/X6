import { Model } from '../model'
import { CellView } from '../view'
import { Selection } from '../addon/selection'
import { ClipboardManager } from './clipboard'
import { Renderer } from './renderer'

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
    Selection.SelectionEventArgs,
    ClipboardManager.ClipboardEventArgs {
  'model:sorted'?: Model.EventArgs['sorted']
  'model:updated': Model.EventArgs['updated']
  'model:reseted': Model.EventArgs['reseted']

  'blank:click': PositionEventArgs<JQuery.ClickEvent>
  'blank:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>
  'blank:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>
  'blank:mousedown': PositionEventArgs<JQuery.MouseDownEvent>
  'blank:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>
  'blank:mouseup': PositionEventArgs<JQuery.MouseUpEvent>
  'blank:mouseout': CommonEventArgs<JQuery.MouseOutEvent>
  'blank:mouseover': CommonEventArgs<JQuery.MouseOverEvent>
  'graph:mouseenter': CommonEventArgs<JQuery.MouseEnterEvent>
  'graph:mouseleave': CommonEventArgs<JQuery.MouseLeaveEvent>
  'blank:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> & {
    delta: number
  }

  'tools:event': { name: string }
  'tools:remove'?: null
  'tools:hide'?: null
  'tools:show'?: null

  'render:done': {
    stats: {
      priority: number
      updatedCount: number
    }
    options: Renderer.UpdateViewsAsyncOptions
  }

  scale: { sx: number; sy: number; ox: number; oy: number }
  resize: { width: number; height: number }
  translate: { tx: number; ty: number }
  freeze: { key?: string }
  unfreeze: { key?: string }
}
