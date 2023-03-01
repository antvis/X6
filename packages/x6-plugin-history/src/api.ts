import { Graph, KeyValue } from '@antv/x6'
import { History } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    isHistoryEnabled: () => boolean
    enableHistory: () => Graph
    disableHistory: () => Graph
    toggleHistory: (enabled?: boolean) => Graph
    undo: (options?: KeyValue) => Graph
    redo: (options?: KeyValue) => Graph
    undoAndCancel: (options?: KeyValue) => Graph
    canUndo: () => boolean
    canRedo: () => boolean
    getHistoryStackSize: () => number
    getUndoSize: () => number
    getRedoSize: () => number
    getUndoRemainSize: () => number
    cleanHistory: (options?: KeyValue) => Graph
  }
}

declare module '@antv/x6/lib/graph/events' {
  interface EventArgs {
    'history:undo': History.Args
    'history:redo': History.Args
    'history:cancel': History.Args
    'history:add': History.Args
    'history:clean': History.Args<null>
    'history:change': History.Args<null>
    'history:batch': { cmd: History.Command; options: KeyValue }
  }
}

Graph.prototype.isHistoryEnabled = function () {
  const history = this.getPlugin('history') as History
  if (history) {
    return history.isEnabled()
  }
  return false
}

Graph.prototype.enableHistory = function () {
  const history = this.getPlugin('history') as History
  if (history) {
    history.enable()
  }
  return this
}

Graph.prototype.disableHistory = function () {
  const history = this.getPlugin('history') as History
  if (history) {
    history.disable()
  }
  return this
}

Graph.prototype.toggleHistory = function (enabled?: boolean) {
  const history = this.getPlugin('history') as History
  if (history) {
    history.toggleEnabled(enabled)
  }
  return this
}

Graph.prototype.undo = function (options?: KeyValue) {
  const history = this.getPlugin('history') as History
  if (history) {
    history.undo(options)
  }
  return this
}

Graph.prototype.redo = function (options?: KeyValue) {
  const history = this.getPlugin('history') as History
  if (history) {
    history.redo(options)
  }
  return this
}

Graph.prototype.undoAndCancel = function (options?: KeyValue) {
  const history = this.getPlugin('history') as History
  if (history) {
    history.cancel(options)
  }
  return this
}

Graph.prototype.canUndo = function () {
  const history = this.getPlugin('history') as History
  if (history) {
    return history.canUndo()
  }
  return false
}

Graph.prototype.canRedo = function () {
  const history = this.getPlugin('history') as History
  if (history) {
    return history.canRedo()
  }
  return false
}

Graph.prototype.cleanHistory = function (options?: KeyValue) {
  const history = this.getPlugin('history') as History
  if (history) {
    history.clean(options)
  }
  return this
}

Graph.prototype.getHistoryStackSize = function () {
  const history = this.getPlugin('history') as History
  return history.getSize()
}

Graph.prototype.getUndoSize = function () {
  const history = this.getPlugin('history') as History
  return history.getUndoSize()
}

Graph.prototype.getRedoSize = function () {
  const history = this.getPlugin('history') as History
  return history.getRedoSize()
}

Graph.prototype.getUndoRemainSize = function () {
  const history = this.getPlugin('history') as History
  return history.getUndoRemainSize()
}
