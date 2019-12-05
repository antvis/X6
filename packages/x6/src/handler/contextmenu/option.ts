import { Cell } from '../../core/cell'
import { Graph } from '../../graph'

export interface ContextMenuOptions {
  enabled: boolean

  /**
   * Specifies is use left mouse button as context menu trigger.
   */
  isLeftButton: boolean

  /**
   * Specifies if cells should be selected if a contextmenu is
   * displayed for them.
   *
   * Default is `true`.
   */
  selectCellsOnContextMenu: boolean

  /**
   * Specifies if cells should be deselected if a contextmenu is
   * displayed for the diagram background.
   *
   * Default is `true`.
   */
  clearSelectionOnBackground: boolean

  show?: (this: Graph, args: ShowContextMenuArgs) => void
  hide?: (this: Graph) => void
}

export interface ShowContextMenuArgs {
  cell: Cell | null
  e: MouseEvent
  x: number
  y: number
}
