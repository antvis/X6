import React from 'react'
import { Graph, DomEvent } from '../../../src'

export class HelloWorld extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container)
    const parent = graph.getDefaultParent()!

    graph.getModel().batchUpdate(() => {
      const v1 = graph.insertNode(parent, null, 'Hello,', 20, 20, 80, 30)
      const v2 = graph.insertNode(parent, null, 'World!', 200, 150, 80, 30)
      graph.insertEdge(parent, null, '', v1, v2)
    })

    console.log(graph)
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
