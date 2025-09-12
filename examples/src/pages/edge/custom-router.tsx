import React from 'react'
import { Graph, Point } from '@antv/x6'
import { routerRegistry } from '@antv/x6'
import '../index.less'

routerRegistry.register(
  'random',
  (vertices, args, view) => {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (var i = 0; i < BOUNCES; i++) {
      const sourceCorner = view.sourceBBox.getCenter()
      const targetCorner = view.targetBBox.getCenter()
      const randomPoint = Point.random(
        sourceCorner.x,
        targetCorner.x,
        sourceCorner.y,
        targetCorner.y,
      )
      points.push(randomPoint)
    }

    return points
  },
  true,
)

export class CustomRouterExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 600,
      grid: 10,
    })

    const source = graph.addNode({
      x: 50,
      y: 50,
      width: 120,
      height: 80,
      attrs: { label: { text: 'Source' } },
    })

    const target = graph.addNode(
      source.clone().translate(600, 400).attr('label/text', 'Target'),
    )

    graph.addEdge({
      source,
      target,
      router: {
        name: 'random',
        args: {
          bounces: 10,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
