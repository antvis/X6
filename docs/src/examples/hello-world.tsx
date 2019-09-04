import React from 'react'
import { Graph, DomEvent } from '../../../src'

export class HelloWorld extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.insertNode({ data: 'Hello', x: 20, y: 20, width: 80, height: 30 })
      const node2 = graph.insertNode({ data: 'World', x: 200, y: 150, width: 80, height: 30 })
      graph.insertEdge({ data: 'Edge Label', sourceNode: node1, targetNode: node2 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        ref={this.refContainer}
        className="graph-container" />
    )
  }
}
