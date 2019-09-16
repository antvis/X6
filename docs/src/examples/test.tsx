import React from 'react'
import { Graph, DomEvent } from '../../../src'

export class Test extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container, {
      dropEnabled: true,
      rubberband: true,
      guide: true,
      rotate: true,
    })

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        data: 'Source',
        x: 60, y: 60, width: 80, height: 30,
      })

      const node2 = graph.addNode({
        data: 'Target',
        x: 240, y: 240, width: 80, height: 30,
      })

      graph.addEdge({ data: 'Label', sourceNode: node1, targetNode: node2 })

      graph.addNode({ data: 'X6', x: 300, y: 120, width: 120, height: 60 })

      // graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 30 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div>
        <div
          ref={this.refContainer}
          className="graph-container big" />
      </div>

    )
  }
}
