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

    graph.addNode({
      x: 60,
      y: 50,
      width: 180,
      height: 100,
      label: 'Port Label Position',
      ports: {
        groups: {
          in: {
            position: 'top',
            label: {
              position: 'top',
            },
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
          out: {
            position: 'bottom',
            label: {
              position: 'bottom',
            },
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
            group: 'in',
            attrs: {
              text: { text: 'in1' },
            },
          },
          {
            id: 'port2',
            group: 'in',
            attrs: {
              text: { text: 'in2' },
            },
          },
          {
            id: 'port3',
            group: 'in',
            attrs: {
              text: { text: 'in3' },
            },
          },
          {
            id: 'port4',
            group: 'out',
            attrs: {
              text: { text: 'out1' },
            },
          },
          {
            id: 'port5',
            group: 'out',
            attrs: {
              text: { text: 'out2' },
            },
          },
        ],
      },
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
