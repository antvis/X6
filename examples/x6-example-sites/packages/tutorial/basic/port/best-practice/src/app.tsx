import React from 'react'
import { Graph, Shape } from '@antv/x6'
import '@antv/x6/es/index.css'
import './app.css'

Shape.Rect.define({
  shape: 'my-rect',
  width: 180,
  height: 80,
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
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      height: 200,
      grid: {
        visible: true,
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
      shape: 'my-rect',
      label: 'In&Out Ports',
      ports: [
        {
          id: 'port1',
          group: 'in',
        },
        {
          id: 'port2',
          group: 'in',
        },
        {
          id: 'port3',
          group: 'in',
        },
        {
          id: 'port4',
          group: 'out',
        },
        {
          id: 'port5',
          group: 'out',
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
        <div ref={this.refContainer} />
      </div>
    )
  }
}
