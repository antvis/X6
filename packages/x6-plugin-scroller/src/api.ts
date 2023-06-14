import { Graph } from '@antv/x6'
import { Scroller } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    lockScroller: () => Graph
    unlockScroller: () => Graph
    updateScroller: () => Graph
    getScrollbarPosition: () => { left: number; top: number }
    setScrollbarPosition: (left?: number, top?: number) => Graph
  }
  interface EventArgs {
    'graph:scroll': { scrollLeft: number; scrollTop: number }
  }
}

Graph.prototype.lockScroller = function () {
  const scroller = this.getPlugin('scroller') as Scroller
  if (scroller) {
    scroller.lockScroller()
  }
  return this
}

Graph.prototype.unlockScroller = function () {
  const scroller = this.getPlugin('scroller') as Scroller
  if (scroller) {
    scroller.unlockScroller()
  }
  return this
}

Graph.prototype.updateScroller = function () {
  const scroller = this.getPlugin('scroller') as Scroller
  if (scroller) {
    scroller.updateScroller()
  }
  return this
}

Graph.prototype.getScrollbarPosition = function () {
  const scroller = this.getPlugin('scroller') as Scroller
  if (scroller) {
    return scroller.getScrollbarPosition()
  }
  return {
    left: 0,
    top: 0,
  }
}

Graph.prototype.setScrollbarPosition = function (left?: number, top?: number) {
  const scroller = this.getPlugin('scroller') as Scroller
  if (scroller) {
    scroller.setScrollbarPosition(left, top)
  }
  return this
}
