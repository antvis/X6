import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      connecting: {
        connector: 'smooth',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: 'source',
    })

    const target = graph.addNode({
      x: 350,
      y: 150,
      width: 80,
      height: 40,
      label: 'target',
    })

    graph.addEdge({
      source,
      target,
      labels: [
        {
          position: 0.3,
          attrs: {
            label: {
              text: 'edge1',
            },
          },
        },
        {
          position: 0.6,
          attrs: {
            label: {
              text: 'edge2',
            },
          },
        },
      ],
    })

    graph.on('cell:dblclick', ({ cell, e }) => {
      cell.addTools([
        {
          name: cell.isEdge() ? 'edge-editor' : 'node-editor',
          args: {
            event: e,
          },
        },
      ])
    })
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
