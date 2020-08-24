import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      height: 200,
      container: this.container,
      grid: true,
    })

    const rect = graph.addNode({
      x: 160,
      y: 50,
      width: 180,
      height: 100,
      label: 'Connect To Port',
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
          },
          {
            id: 'port3',
            group: 'group1',
          },
        ],
      },
    })

    graph.addEdge({
      source: { x: 40, y: 100 },
      target: { cell: rect, port: 'port1' },
    })

    graph.addEdge({
      source: { x: 40, y: 100 },
      target: { cell: rect, port: 'port2' },
    })

    graph.addEdge({
      source: { x: 40, y: 100 },
      target: { cell: rect, port: 'port3' },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div ref={this.refContainer}></div>
      </div>
    )
  }
}
