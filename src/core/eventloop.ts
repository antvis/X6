import { Cell } from './cell'
import { Graph } from "./graph";

export class EventLoop {
  protected lastEvent: MouseEvent
  protected eventSource: HTMLElement | null
  protected mouseMoveRedirect: null | ((e: MouseEvent) => void)
  protected mouseUpRedirect: null | ((e: MouseEvent) => void)
  protected ignoreMouseEvents: boolean

  protected lastTouchX: number = 0
  protected lastTouchY: number = 0
  protected lastTouchTime: number = 0
  protected lastTouchCell: Cell | null
  protected lastTouchEvent: MouseEvent
  protected fireDoubleClick: boolean
  protected doubleClickCounter: number = 0

  constructor(
    public graph: Graph,
  ) {

  }
}
