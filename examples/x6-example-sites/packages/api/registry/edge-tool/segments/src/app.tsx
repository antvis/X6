import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      onToolItemCreated({ tool }) {
        const handle = tool as any
        const options = handle.options
        if (options && options.index % 2 === 1) {
          tool.setAttrs({ fill: 'red' }, handle.handleElem)
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
        name: 'segments',
        args: {
          snapRadius: 20,
          attrs: {
            handle: {
              fill: '#444',
            },
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#3c4260',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: {
        name: 'segments',
        args: {
          snapRadius: 20,
          attrs: {
            handle: {
              fill: '#444',
            },
          },
        },
      },
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
