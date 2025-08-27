import React from 'react'
import { Graph, Edge, Line } from '../../../../src'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      mousewheel: true,
      grid: true,
      width: 1000,
      height: 600,
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 360,
      y: 280,
      width: 100,
      height: 40,
      label: 'world',
    })

    const total = 15
    const edges: Edge[] = []

    for (let i = 0; i < total; i += 1) {
      edges.push(
        graph.addEdge({
          source: rect1,
          target: rect2,
          connector: {
            name: 'smooth',
          },
        }),
      )
    }

    const update = () => {
      const bbox1 = rect1.getBBox()
      const bbox2 = rect2.getBBox()
      const line = new Line(bbox1.getCenter(), bbox2.getCenter())
      const mid = line.pointAt(0.5)
      const odd = total % 2 === 1
      const max = 0.2

      let split = Math.floor(total / 2)
      const factor = max / split
      for (let i = 0; i < split; i += 1) {
        const edge = edges[i]
        const vertice = line.pointAt(0.5 - (i + 1) * factor).rotate(90, mid)
        edge.setVertices([vertice])
      }

      if (odd) {
        const edge = edges[split]
        edge.removeConnector()
        split += 1
      }

      for (let i = split; i < total; i += 1) {
        const edge = edges[i]
        const vertice = line
          .pointAt(0.5 + (i - split + 1) * factor)
          .rotate(90, mid)
        edge.setVertices([vertice])
      }
    }

    graph.on('node:change:position', update)

    update()
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
