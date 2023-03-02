import { Graph, Node } from '@antv/x6'
import { TransformImpl } from './transform'
import { Transform } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    createWidget: (node: Node) => Graph
    clearWidget: () => Graph
  }
}

declare module '@antv/x6/lib/graph/events' {
  interface EventArgs extends TransformImpl.EventArgs {}
}

Graph.prototype.createWidget = function (node) {
  const transform = this.getPlugin('transform') as Transform
  if (transform) {
    transform.createTransform(node)
  }
  return this
}

Graph.prototype.clearWidget = function () {
  const transform = this.getPlugin('transform') as Transform
  if (transform) {
    transform.clearWidgets()
  }
  return this
}
