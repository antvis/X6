import { Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { View } from '../core/view'
import { Overlay, Anchor } from '../struct'
import { MouseEventEx } from '../handler'
import { Align, VAlign } from '../types'
import { IChange } from '../change'

export interface EventArgs {
  refresh?: null
  pan: {
    panX: number
    panY: number
  }
  scale: View.ScaleArgs
  translate: View.TranslateArgs
  scaleAndTranslate: View.ScaleAndTranslateArgs

  'model:changing': [IChange[]]
  'model:changed': [IChange[]]
  'root:changed'?: null

  'selection:changed': {
    added?: Cell[] | null
    removed?: Cell[] | null
    selected: Cell[]
  }

  'cells:adding': {
    cells: Cell[]
    parent: Cell
    index: number
    source?: Cell | null
    target?: Cell | null
  }

  'cells:added': {
    cells: Cell[]
    parent: Cell
    index: number
    source?: Cell | null
    target?: Cell | null
    absolute: boolean
  }

  'cells:removing': {
    cells: Cell[]
    includeEdges: boolean
  }

  'cells:removed': {
    cells: Cell[]
  }

  'cells:collapsing': {
    cells: Cell[]
    collapsed: boolean
    recurse: boolean
  }

  'cells:collapsed': {
    cells: Cell[]
    collapsed: boolean
    recurse: boolean
  }

  'cells:resizing': {
    cells: Cell[]
    bounds: Rectangle[]
  }

  'cells:resized': {
    cells: Cell[]
    bounds: Rectangle[]
  }

  'cells:showing': {
    cells: Cell[]
    visbile: boolean
  }

  'cells:showed': {
    cells: Cell[]
    visbile: boolean
  }

  'cells:moving': {
    cells: Cell[]
    dx: number
    dy: number
    clone: boolean
    target?: Cell | null
    e?: MouseEvent | null
  }

  'cells:moved': {
    cells: Cell[]
    dx: number
    dy: number
    disconnect: boolean
  }

  'cells:ordering': {
    cells: Cell[]
    toBack: boolean
  }

  'cells:ordered': {
    cells: Cell[]
    toBack: boolean
  }

  'cells:aligning': {
    cells: Cell[]
    align: Align | VAlign
  }

  'cells:aligned': {
    cells: Cell[]
    align: Align | VAlign
  }

  'cells:grouping': {
    cells: Cell[]
    group: Cell
    border: number
  }

  'cells:grouped': {
    cells: Cell[]
    group: Cell
    border: number
  }

  'cells:ungrouping': {
    cells: Cell[]
  }

  'cells:ungrouped': {
    cells: Cell[]
  }

  'cells:removedFromParent': {
    cells: Cell[]
  }

  'cell:editing': {
    cell: Cell
    e?: MouseEvent | null
  }

  'cell:edited': {
    cancel: boolean
  }

  'cell:connecting': {
    edge: Cell
    terminal?: Cell | null
    isSource: boolean
    previous?: Cell | null
    anchor?: Anchor | null
  }

  'cell:connected': {
    edge: Cell
    terminal?: Cell | null
    isSource: boolean
    previous?: Cell | null
    anchor?: Anchor | null
  }

  'edge:splitting': {
    edge: Cell
    newEdge: Cell
    cells: Cell[]
    dx: number
    dy: number
  }

  'edge:splitted': {
    edge: Cell
    newEdge: Cell
    cells: Cell[]
    dx: number
    dy: number
  }

  'edge:flipping': { edge: Cell }

  'edge:flipped': { edge: Cell }

  'overlay:added': {
    cell: Cell
    overlay: Overlay
  }

  'overlay:removed': {
    cell: Cell
    overlay: Overlay
  }

  'overlays:removed': {
    cell: Cell
    overlays: Overlay[]
  }

  mouseEvent: {
    e: MouseEventEx
    eventName: 'mouseDown' | 'mouseMove' | 'mouseUp'
    sender: any
  }

  gesture: {
    e: MouseEvent
    cell?: Cell | null
  }

  click: {
    e: MouseEvent
    cell?: Cell | null
  }

  dblclick: {
    e: MouseEvent
    cell?: Cell | null
  }

  escape: {
    e: KeyboardEvent
  }

  tapAndHold: {
    e: MouseEvent
  }
}
