import { MouseHandler } from '../handler-mouse'
import { MouseEventEx } from '../../common'

export class SelectHandler extends MouseHandler {
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
    return (
      this.graph.isEnabled() &&
      this.isEnabled() &&
      this.isOnCell(e) &&
      !this.isConsumed(e) &&
      !this.isMultiTouchEvent(e)
    )
  }
}
