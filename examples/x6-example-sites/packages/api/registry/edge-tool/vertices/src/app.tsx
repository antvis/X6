import React from 'react'
import { Graph, Edge } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    let edge2: Edge
    const graph = new Graph({
      container: this.container,
      grid: true,
      onToolItemCreated({ name, cell, tool }) {
        if (name === 'vertices' && cell === edge2) {
          const options = (tool as any).options
          if (options && options.index % 2 === 1) {
            tool.setAttrs({ fill: 'red' })
          }
        }
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#3c4260',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
      tools: {
        name: 'vertices',
        args: {
          attrs: { fill: '#666' },
        },
      },
    })

    edge2 = graph.addEdge({
      source: { x: 60, y: 140 },
      target: { x: 380, y: 140 },
      vertices: [
        { x: 40, y: 180 },
        { x: 200, y: 140 },
        { x: 240, y: 180 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#7c68fc',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools('vertices', 'onhover')
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell.hasTools('onhover')) {
        cell.removeTools()
      }
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
