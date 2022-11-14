import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 200,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 80,
      label: 'world',
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
