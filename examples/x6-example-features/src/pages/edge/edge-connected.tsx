import React from 'react'
import { Edge, Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      connecting: {
        dangling: true,
        createEdge() {
          return new Edge()
        },
      },
    })

    graph.addNode({
      shape: 'rect',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      label: 'source',
      ports: [
        {
          id: 'a',
        },
      ],
      attrs: {
        body: {
          magnet: true,
        },
      },
    })

    graph.addNode({
      shape: 'rect',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      ports: [
        {
          id: 'b',
        },
      ],
      attrs: {
        body: {
          magnet: true,
        },
      },
    })

    graph.addNode({
      shape: 'rect',
      x: 520,
      y: 60,
      width: 160,
      height: 60,
      ports: [
        {
          id: 'c',
        },
      ],
      attrs: {
        body: {
          magnet: true,
        },
      },
    })

    graph.on('edge:connected', (args) => {
      console.log(args)
    })
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
