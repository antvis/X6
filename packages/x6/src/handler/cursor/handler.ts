import { MouseHandler } from '../mouse-handler'
import { MouseEventEx } from '../mouse-event'

export class CursorHandler extends MouseHandler {
  mouseMove(e: MouseEventEx, sender?: any) {
    if (this.shouldUpdateCursor(e)) {
      this.setMovableCursor(e)
    }
  }

  protected shouldUpdateCursor(e: MouseEventEx) {
    return (
      this.graph.isAutoUpdateCursor() &&
      !this.isConsumed(e) &&
      !this.isMouseDown() &&
      (this.graph.isCellsMovable() || this.graph.isCellsCloneable()) &&
      this.isOnCell(e)
    )
  }

  protected setMovableCursor(e: MouseEventEx) {
    let cursor = this.getCursorForEvent(e)
    if (
      cursor == null &&
      this.graph.isEnabled() &&
      this.graph.isCellsMovable() &&
      this.graph.isCellMovable(e.getCell())
    ) {
      cursor = 'move'
    }

    // Sets the cursor on the original source state under the mouse
    // instead of the event source state which can be the parent
    if (cursor != null && e.state != null) {
      e.state.setCursor(cursor)
    }
  }

  protected getCursorForEvent(e: MouseEventEx): string | null {
    return this.graph.getCellCursor(e.getCell())
  }
}
