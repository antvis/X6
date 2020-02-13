import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      folding: {
        enabled: false,
      },
      connection: {
        enabled: true,
      },
      edgeStyle: {
        edge: 'elbow',
      },
      isPort(cell) {
        const geo = this.getCellGeometry(cell)
        return geo != null ? geo.relative : false
      },
    })

    graph.batchUpdate(() => {
      const hello = graph.addNode({
        x: 20,
        y: 80,
        width: 100,
        height: 60,
        label: 'Hello',
        connectable: false,
      })

      const port1 = graph.addNode({
        parent: hello,
        x: 1,
        y: 0.25,
        width: 10,
        height: 10,
        shape: 'ellipse',
        relative: true,
        offset: [-5, -5],
      })

      const port2 = graph.addNode({
        parent: hello,
        x: 1,
        y: 0.75,
        width: 10,
        height: 10,
        shape: 'ellipse',
        relative: true,
        offset: [-5, -5],
      })

      const target1 = graph.addNode({
        x: 200,
        y: 30,
        width: 80,
        height: 30,
        label: 'World',
      })
      const target2 = graph.addNode({
        x: 200,
        y: 150,
        width: 80,
        height: 30,
        label: 'World',
      })

      graph.addEdge({ source: port1, target: target1 })
      graph.addEdge({ source: port2, target: target2 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
