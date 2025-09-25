import React from 'react'
import { Graph } from '@antv/x6'

export class SegmentsExample extends React.Component {
  private container = React.createRef<HTMLDivElement>()

  componentDidMount() {
    const graph = new Graph({
      container: this.container.current,
      width: 800,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'rect',
      position: { x: 60, y: 40 },
      size: { width: 100, height: 60 },
    })

    const target = graph.addNode({
      shape: 'rect',
      position: { x: 650, y: 450 },
      size: { width: 100, height: 60 },
    })

    graph.addEdge({
      source,
      target,
      router: 'orth',
      tools: [
        {
          name: 'segments',
        },
      ],
      attrs: {
        connection: {
          stroke: '#333333',
          strokeWidth: 3,
        },
      },
    })
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.container} className="x6-graph" />
      </div>
    )
  }
}
