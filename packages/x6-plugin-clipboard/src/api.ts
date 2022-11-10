import { Graph, Cell } from '@antv/x6'
import { Clipboard } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    isClipboardEnabled: () => void
    enableClipboard: () => Graph
    disableClipboard: () => Graph
    toggleClipboard: (enabled?: boolean) => Graph
    isClipboardEmpty: () => boolean
    getCellsInClipboard: () => Cell[]
    cleanClipboard: () => Graph
    copy: (cells: Cell[], options?: Clipboard.CopyOptions) => Graph
    cut: (cells: Cell[], options?: Clipboard.CopyOptions) => Graph
    paste: (options?: Clipboard.PasteOptions, graph?: Graph) => Cell[]
  }
}

declare module '@antv/x6/lib/graph/events' {
  interface EventArgs {
    'clipboard:changed': { cells: Cell[] }
  }
}

Graph.prototype.isClipboardEnabled = function () {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    return clipboard.isEnabled()
  }
  return false
}

Graph.prototype.enableClipboard = function () {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.enable()
  }
  return this
}

Graph.prototype.disableClipboard = function () {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.disable()
  }
  return this
}

Graph.prototype.toggleClipboard = function (enabled?: boolean) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.toggleEnabled(enabled)
  }

  return this
}

Graph.prototype.isClipboardEmpty = function () {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    return clipboard.isEmpty()
  }
  return true
}

Graph.prototype.getCellsInClipboard = function () {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    return clipboard.getCellsInClipboard()
  }
  return []
}

Graph.prototype.cleanClipboard = function () {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.clean()
  }
  return this
}

Graph.prototype.copy = function (
  cells: Cell[],
  options?: Clipboard.CopyOptions,
) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.copy(cells, options)
  }
  return this
}

Graph.prototype.cut = function (
  cells: Cell[],
  options?: Clipboard.CopyOptions,
) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.cut(cells, options)
  }
  return this
}

Graph.prototype.paste = function (
  options?: Clipboard.PasteOptions,
  graph?: Graph,
) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    return clipboard.paste(options, graph)
  }
  return []
}
