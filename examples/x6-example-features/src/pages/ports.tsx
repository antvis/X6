import React from 'react'
import { Graph, Point } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      connection: {
        waypointsEnabled: true,
      },
      isPort(cell) {
        const geo = this.getCellGeometry(cell)
        return geo != null ? geo.relative : false
      },
      isCellFoldable() {
        return false
      },
      edgeStyle: {
        edge: 'elbow',
      },
    })

    graph.enableConnection()

    graph.batchUpdate(() => {
      const n1 = graph.addNode({
        data: 'Hello',
        x: 20,
        y: 80,
        width: 80,
        height: 30,
        style: {
          connectable: false,
        },
      })

      const n11 = graph.addNode({
        parent: n1,
        x: 1,
        y: 0,
        width: 10,
        height: 10,
      })
      n11.geometry!.offset = new Point(-5, -5)
      n11.geometry!.relative = true

      const n12 = graph.addNode({
        parent: n1,
        x: 1,
        y: 1,
        width: 10,
        height: 10,
      })
      n12.geometry!.offset = new Point(-5, -5)
      n12.geometry!.relative = true

      const n2 = graph.addNode({
        data: 'Port 1',
        x: 200,
        y: 20,
        width: 80,
        height: 30,
      })
      const n3 = graph.addNode({
        data: 'Port 2',
        x: 200,
        y: 150,
        width: 80,
        height: 30,
      })

      graph.addEdge({ source: n11, target: n2 })
      graph.addEdge({ source: n12, target: n3 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
