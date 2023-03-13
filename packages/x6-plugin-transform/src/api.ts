import { Graph, Node } from '@antv/x6'
import { TransformImpl } from './transform'
import { Transform } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    createTransformWidget: (node: Node) => Graph
    clearTransformWidgets: () => Graph
  }
}

declare module '@antv/x6/lib/graph/events' {
  interface EventArgs extends TransformImpl.EventArgs {}
}

Graph.prototype.createTransformWidget = function (node) {
  const transform = this.getPlugin('transform') as Transform
  if (transform) {
    transform.clearWidgets()
    const widget = transform.createTransform(node)
    if (widget) {
      this.widgets.set(node, widget)
      widget.on('*', (name, args) => {
        this.trigger(name, args)
        this.graph.trigger(name, args)
      })
    }
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
