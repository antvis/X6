import { Graph } from '../../graph'
import type { Cell } from '../../model'
import type { Clipboard } from './index'
import type {
  ClipboardImplCopyOptions,
  ClipboardImplPasteOptions,
  ClipboardOptions,
} from './type'

declare module '../../graph/graph' {
  interface Graph {
    isClipboardEnabled: () => boolean
    enableClipboard: () => Graph
    disableClipboard: () => Graph
    toggleClipboard: (enabled?: boolean) => Graph
    isClipboardEmpty: (options?: ClipboardOptions) => boolean
    getCellsInClipboard: () => Cell[]
    cleanClipboard: () => Graph
    copy: (cells: Cell[], options?: ClipboardImplCopyOptions) => Graph
    cut: (cells: Cell[], options?: ClipboardImplCopyOptions) => Graph
    paste: (options?: ClipboardImplPasteOptions, graph?: Graph) => Cell[]
  }
}

declare module '../../graph/events' {
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

Graph.prototype.isClipboardEmpty = function (options?: ClipboardOptions) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    return clipboard.isEmpty(options)
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
  options?: ClipboardImplCopyOptions,
) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.copy(cells, options)
  }
  return this
}

Graph.prototype.cut = function (
  cells: Cell[],
  options?: ClipboardImplCopyOptions,
) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    clipboard.cut(cells, options)
  }
  return this
}

Graph.prototype.paste = function (
  options?: ClipboardImplPasteOptions,
  graph?: Graph,
) {
  const clipboard = this.getPlugin('clipboard') as Clipboard
  if (clipboard) {
    return clipboard.paste(options, graph)
  }
  return []
}
