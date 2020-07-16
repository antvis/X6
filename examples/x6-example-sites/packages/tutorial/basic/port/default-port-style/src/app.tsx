import React from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6/es/index.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      height: 200,
      container: this.container,
      grid: true,
    })

    graph.addNode({
      x: 60,
      y: 50,
      width: 180,
      height: 100,
      label: 'Port Style',
      ports: [
        {
          id: 'port1',
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
        {
          id: 'port2',
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
        {
          id: 'port3',
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
      ],
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
