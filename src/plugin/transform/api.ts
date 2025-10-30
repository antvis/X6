import { Graph } from '../../graph'
import { Node } from '../../model'
import { TransformImplEventArgs } from './transform'
import { Transform } from './index'

declare module '../../graph/graph' {
  interface Graph {
    createTransformWidget: (node: Node) => Graph
    clearTransformWidgets: () => Graph
  }
}

declare module '../../graph/events' {
  interface EventArgs extends TransformImplEventArgs {}
}

Graph.prototype.createTransformWidget = function (node) {
  const transform = this.getPlugin('transform') as Transform
  if (transform) {
    transform.createWidget(node)
  }
  return this
}

Graph.prototype.clearTransformWidgets = function () {
  const transform = this.getPlugin('transform') as Transform
  if (transform) {
    transform.clearWidgets()
  }
  return this
}
