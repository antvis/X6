import React from 'react'
import { Graph, DomEvent } from '../../../src'

export class Guide extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container, {
      guide: {
        enabled: true,
        dashed: true,
      },
      rubberband: true,
    })

    graph.batchUpdate(() => {
      graph.addNode({ data: 'Hello', x: 60, y: 60, width: 80, height: 70 })
      graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 40 })
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
          tabIndex={-1}
          className="graph-container big" />
      </div>
    )
  }
}
