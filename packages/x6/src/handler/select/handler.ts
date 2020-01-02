import { MouseHandler } from '../mouse-handler'
import { MouseEventEx } from '../mouse-event'

export class SelectCellHandler extends MouseHandler {
  mouseDown(e: MouseEventEx, sender: any) {
    if (this.canHandle(e)) {
      const cell = this.getCell(e)
      // Select cell which was not selected immediately
      if (cell !== null && !this.graph.isCellSelected(cell)) {
        this.graph.selectionManager.selectCellForEvent(cell, e.getEvent())
      }
    }
  }

  protected canHandle(e: MouseEventEx) {
    return this.isValid(e) && this.isOnCell(e) && !this.isMultiTouchEvent(e)
  }
}
