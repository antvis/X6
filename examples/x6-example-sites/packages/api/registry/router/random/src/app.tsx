import React from 'react'
import { Graph, Point } from '@antv/x6'
import '@antv/x6/es/index.css'
import './app.css'

Graph.registerRouter(
  'random',
  (vertices, args, view) => {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (let i = 0; i < BOUNCES; i += 1) {
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

export default class Example extends React.Component {
  static noLayout = true
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      attrs: { label: { text: 'Source' } },
    })

    const target = graph.addNode(
      source.clone().translate(300, 200).attr('label/text', 'Target'),
    )

    graph.addEdge({
      source,
      target,
      router: {
        name: 'random',
        args: {
          bounces: 3,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
