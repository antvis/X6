import { Cell } from '../core/cell'
import { Rectangle, Overlay, Anchor } from '../struct'
import { MouseEventEx } from '../common'
import { Align, VAlign } from '../types'

export interface EventArgs {
  refresh?: null
  root?: null
  size: Rectangle
  selectionChanged: {
    added?: Cell[] | null
    removed?: Cell[] | null
  }

  addCells: {
    cells: Cell[]
    parent: Cell
    index: number
    sourceNode?: Cell | null
    targetNode?: Cell | null
  }
  cellsAdded: {
    cells: Cell[]
    parent: Cell
    index: number
    sourceNode?: Cell | null
    targetNode?: Cell | null
    absolute: boolean
  }
  removeCells: {
    cells: Cell[]
    includeEdges: boolean
  }
  cellsRemoved: {
    cells: Cell[]
  }
  connectCell: {
    edge: Cell
    terminal?: Cell | null
    isSource: boolean
    previous?: Cell | null
    anchor?: Anchor | null
  }
  cellConnected: {
    edge: Cell
    terminal?: Cell | null
    isSource: boolean
    previous?: Cell | null
    anchor?: Anchor | null
  }
  collapseCells: {
    cells: Cell[]
    collapsed: boolean
    recurse: boolean
  }
  cellsCollapsed: {
    cells: Cell[]
    collapsed: boolean
    recurse: boolean
  }
  splitEdge: {
    edge: Cell
    newEdge: Cell
    cells: Cell[]
    dx: number
    dy: number
  }
  flipEdge: { edge: Cell }
  toggleCells: {
    show: boolean
    includeEdges: boolean
    cells: Cell[]
  }
  resizeCells: {
    cells: Cell[]
    bounds: Rectangle[]
  }
  cellsResized: {
    cells: Cell[]
    bounds: Rectangle[]
  }
  updateCellSize: {
    cell: Cell
    ignoreChildren: boolean
  }
  addOverlay: {
    cell: Cell
    overlay: Overlay
  }
  removeOverlay: {
    cell: Cell
    overlay: Overlay
  }
  removeOverlays: {
    cell: Cell
    overlays: Overlay[]
  }
  moveCells: {
    cells: Cell[]
    dx: number
    dy: number
    clone: boolean
    target?: Cell | null
    e?: MouseEvent | null
  }
  cellsMoved: {
    cells: Cell[]
    dx: number
    dy: number
    disconnect: boolean
  }
  alignCells: {
    cells: Cell[]
    align: Align | VAlign
  }
  orderCells: {
    cells: Cell[]
    toBack: boolean
  }
  cellsOrdered: {
    cells: Cell[]
    toBack: boolean
  }
  groupCells: {
    cells: Cell[]
    group: Cell
    border: number
  }
  ungroupCells: {
    cells: Cell[]
  }
  removeCellsFromParent: {
    cells: Cell[]
  }
  startEditing: {
    cell: Cell
    e?: MouseEvent | null
  }
  editingStarted: {
    cell: Cell
    e?: MouseEvent | null
  }
  editingStopped: {
    cancel: boolean
  }

  pan: {
    panX: number
    panY: number
  }

  fireMouseEvent: {
    e: MouseEventEx
    eventName: 'mouseDown' | 'mouseMove' | 'mouseUp'
    sender: any
  }

  gesture: {
    e: MouseEvent
    cell?: Cell | null
  }

  escape: {
    e: KeyboardEvent
  }

  click: {
    e: MouseEvent
    cell?: Cell | null
  }

  dblclick: {
    e: MouseEvent
    cell?: Cell | null
  }

  tapAndHold: {
    e: MouseEvent
  }
}
