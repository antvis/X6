import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

const data = {
  // 节点
  nodes: [
    {
      id: 'node1',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: 'Hello',
    },
    {
      id: 'node2',
      x: 160,
      y: 180,
      width: 80,
      height: 40,
      label: 'world',
      shape: 'ellipse',
    },
  ],
  // 边
  edges: [
    {
      source: 'node1',
      target: 'node2',
      attrs: {
        line: {
          stroke: 'orange',
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
      grid: true,
    })

    graph.fromJSON(data)
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
