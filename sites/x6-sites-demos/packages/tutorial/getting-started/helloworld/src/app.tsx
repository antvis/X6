import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
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
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
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
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data)
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
