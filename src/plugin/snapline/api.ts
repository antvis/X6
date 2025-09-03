import { Graph } from '../../graph'
import type { Snapline } from './index'
import type { SnaplineFilter } from './type'

declare module '../../graph/graph' {
  interface Graph {
    isSnaplineEnabled: () => boolean
    enableSnapline: () => Graph
    disableSnapline: () => Graph
    toggleSnapline: (enabled?: boolean) => Graph
    hideSnapline: () => Graph
    setSnaplineFilter: (filter?: SnaplineFilter) => Graph
    isSnaplineOnResizingEnabled: () => boolean
    enableSnaplineOnResizing: () => Graph
    disableSnaplineOnResizing: () => Graph
    toggleSnaplineOnResizing: (enableOnResizing?: boolean) => Graph
    isSharpSnapline: () => boolean
    enableSharpSnapline: () => Graph
    disableSharpSnapline: () => Graph
    toggleSharpSnapline: (sharp?: boolean) => Graph
    getSnaplineTolerance: () => number | undefined
    setSnaplineTolerance: (tolerance: number) => Graph
  }
}

Graph.prototype.isSnaplineEnabled = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    return snapline.isEnabled()
  }
  return false
}

Graph.prototype.enableSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.enable()
  }
  return this
}

Graph.prototype.disableSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.disable()
  }
  return this
}

Graph.prototype.toggleSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.toggleEnabled()
  }
  return this
}

Graph.prototype.hideSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.hide()
  }
  return this
}

Graph.prototype.setSnaplineFilter = function (filter?: SnaplineFilter) {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.setFilter(filter)
  }
  return this
}

Graph.prototype.isSnaplineOnResizingEnabled = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    return snapline.isOnResizingEnabled()
  }
  return false
}

Graph.prototype.enableSnaplineOnResizing = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.enableOnResizing()
  }
  return this
}

Graph.prototype.disableSnaplineOnResizing = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.disableOnResizing()
  }
  return this
}

Graph.prototype.toggleSnaplineOnResizing = function (
  enableOnResizing?: boolean,
) {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.toggleOnResizing(enableOnResizing)
  }
  return this
}

Graph.prototype.isSharpSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    return snapline.isSharp()
  }
  return false
}

Graph.prototype.enableSharpSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.enableSharp()
  }
  return this
}

Graph.prototype.disableSharpSnapline = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.disableSharp()
  }
  return this
}

Graph.prototype.toggleSharpSnapline = function (sharp?: boolean) {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.toggleSharp(sharp)
  }
  return this
}

Graph.prototype.getSnaplineTolerance = function () {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    return snapline.getTolerance()
  }
}

Graph.prototype.setSnaplineTolerance = function (tolerance: number) {
  const snapline = this.getPlugin('snapline') as Snapline
  if (snapline) {
    snapline.setTolerance(tolerance)
  }
  return this
}
