import { DomEvent } from '../dom'
import { Cell } from '../core/cell'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class EditingAccessor extends BaseGraph {
  @hook()
  isCellEditable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsEditable() &&
      !this.isCellLocked(cell) &&
      style.editable !== false
    )
  }

  @hook()
  getEditingContent(cell: Cell, e?: Event) {
    const content = this.getLabel(cell)
    if (content != null) {
      if (typeof content === 'string') {
        return content
      }
      return content.outerHTML
    }

    return null
  }

  startEditing(e?: MouseEvent) {
    this.startEditingAtCell(null, e)
    return this
  }

  stopEditing(cancel: boolean = false) {
    this.cellEditor.stopEditing(cancel)
    this.trigger('cell:edited', { cancel })
    return this
  }

  startEditingAtCell(
    cell: Cell | null = this.getSelectedCell(),
    e?: MouseEvent,
  ) {
    if (e == null || !DomEvent.isMultiTouchEvent(e)) {
      if (cell != null && this.isCellEditable(cell)) {
        this.cellEditor.startEditing(cell, e)
        this.trigger('cell:editing', { cell, e })
      }
    }
    return this
  }

  /**
   * Returns true if the given cell is currently being edited.
   */
  isEditing(cell?: Cell) {
    if (this.cellEditor != null) {
      const editingCell = this.cellEditor.getEditingCell()
      return cell == null ? editingCell != null : cell === editingCell
    }

    return false
  }

  updateLabel(cell: Cell, label: string, e?: Event) {
    this.editingManager.updateLabel(cell, label, e)
    return this
  }
}
