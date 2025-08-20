import { ModifierKey } from '@antv/x6-common'
import { Cell } from '../../model'
import { Graph } from '../../graph'
import { Selection } from './index'
import type { SelectionImpl } from './selection'

declare module '../../graph/graph' {
  interface Graph {
    isSelectionEnabled: () => boolean
    enableSelection: () => Graph
    disableSelection: () => Graph
    toggleSelection: (enabled?: boolean) => Graph
    isMultipleSelection: () => boolean
    enableMultipleSelection: () => Graph
    disableMultipleSelection: () => Graph
    toggleMultipleSelection: (multiple?: boolean) => Graph
    isSelectionMovable: () => boolean
    enableSelectionMovable: () => Graph
    disableSelectionMovable: () => Graph
    toggleSelectionMovable: (movable?: boolean) => Graph
    isRubberbandEnabled: () => boolean
    enableRubberband: () => Graph
    disableRubberband: () => Graph
    toggleRubberband: (enabled?: boolean) => Graph
    isStrictRubberband: () => boolean
    enableStrictRubberband: () => Graph
    disableStrictRubberband: () => Graph
    toggleStrictRubberband: (strict?: boolean) => Graph
    setRubberbandModifiers: (modifiers?: string | ModifierKey[] | null) => Graph
    setSelectionFilter: (filter?: Selection.Filter) => Graph
    setSelectionDisplayContent: (content?: Selection.Content) => Graph
    isSelectionEmpty: () => boolean
    cleanSelection: (options?: Selection.SetOptions) => Graph
    resetSelection: (
      cells?: Cell | string | (Cell | string)[],
      options?: Selection.SetOptions,
    ) => Graph
    getSelectedCells: () => Cell[]
    getSelectedCellCount: () => number
    isSelected: (cell: Cell | string) => boolean
    select: (
      cells: Cell | string | (Cell | string)[],
      options?: Selection.AddOptions,
    ) => Graph
    unselect: (
      cells: Cell | string | (Cell | string)[],
      options?: Selection.RemoveOptions,
    ) => Graph
  }
}

declare module '../../graph/events' {
  interface EventArgs extends SelectionImpl.SelectionEventArgs {}
}

Graph.prototype.isSelectionEnabled = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isEnabled()
  }
  return false
}

Graph.prototype.enableSelection = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.enable()
  }
  return this
}

Graph.prototype.disableSelection = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.disable()
  }
  return this
}

Graph.prototype.toggleSelection = function (enabled?: boolean) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.toggleEnabled(enabled)
  }
  return this
}

Graph.prototype.isMultipleSelection = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isMultipleSelection()
  }
  return false
}

Graph.prototype.enableMultipleSelection = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.enableMultipleSelection()
  }
  return this
}

Graph.prototype.disableMultipleSelection = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.disableMultipleSelection()
  }
  return this
}

Graph.prototype.toggleMultipleSelection = function (multiple?: boolean) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.toggleMultipleSelection(multiple)
  }
  return this
}

Graph.prototype.isSelectionMovable = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isSelectionMovable()
  }
  return false
}

Graph.prototype.enableSelectionMovable = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.enableSelectionMovable()
  }
  return this
}

Graph.prototype.disableSelectionMovable = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.disableSelectionMovable()
  }
  return this
}

Graph.prototype.toggleSelectionMovable = function (movable?: boolean) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.toggleSelectionMovable(movable)
  }
  return this
}

Graph.prototype.isRubberbandEnabled = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isRubberbandEnabled()
  }
  return false
}

Graph.prototype.enableRubberband = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.enableRubberband()
  }
  return this
}

Graph.prototype.disableRubberband = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.disableRubberband()
  }
  return this
}

Graph.prototype.toggleRubberband = function (enabled?: boolean) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.toggleRubberband(enabled)
  }
  return this
}

Graph.prototype.isStrictRubberband = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isStrictRubberband()
  }
  return false
}

Graph.prototype.enableStrictRubberband = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.enableStrictRubberband()
  }
  return this
}

Graph.prototype.disableStrictRubberband = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.disableStrictRubberband()
  }
  return this
}

Graph.prototype.toggleStrictRubberband = function (strict?: boolean) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.toggleStrictRubberband(strict)
  }
  return this
}

Graph.prototype.setRubberbandModifiers = function (
  modifiers?: string | ModifierKey[] | null,
) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.setRubberbandModifiers(modifiers)
  }
  return this
}

Graph.prototype.setSelectionFilter = function (filter?: Selection.Filter) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.setSelectionFilter(filter)
  }
  return this
}

Graph.prototype.setSelectionDisplayContent = function (
  content?: Selection.Content,
) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.setSelectionDisplayContent(content)
  }
  return this
}

Graph.prototype.isSelectionEmpty = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isEmpty()
  }
  return true
}

Graph.prototype.cleanSelection = function (options?: Selection.SetOptions) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.clean(options)
  }
  return this
}

Graph.prototype.resetSelection = function (
  cells?: Cell | string | (Cell | string)[],
  options?: Selection.SetOptions,
) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.reset(cells, options)
  }
  return this
}

Graph.prototype.getSelectedCells = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.getSelectedCells()
  }
  return []
}

Graph.prototype.getSelectedCellCount = function () {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.getSelectedCellCount()
  }
  return 0
}

Graph.prototype.isSelected = function (cell: Cell | string) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    return selection.isSelected(cell)
  }
  return false
}

Graph.prototype.select = function (
  cells: Cell | string | (Cell | string)[],
  options?: Selection.AddOptions,
) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.select(cells, options)
  }
  return this
}

Graph.prototype.unselect = function (
  cells: Cell | string | (Cell | string)[],
  options?: Selection.RemoveOptions,
) {
  const selection = this.getPlugin('selection') as Selection
  if (selection) {
    selection.unselect(cells, options)
  }
  return this
}
