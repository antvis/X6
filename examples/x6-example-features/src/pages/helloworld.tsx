import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        x: 60,
        y: 60,
        width: 80,
        height: 30,
        label: 'Hello',
      })
      const node2 = graph.addNode({
        x: 240,
        y: 240,
        width: 80,
        height: 30,
        label: 'World',
      })
      graph.addEdge({ label: 'Edge Label', source: node1, target: node2 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
