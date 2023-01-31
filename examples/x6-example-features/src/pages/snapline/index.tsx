import React from 'react'
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import '../index.less'
import { SNAP_PORT_RECT } from './port-node'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const snapline = new Snapline({
      enabled: true,
      sharp: true,
      byPort: false,
    })
    graph.use(snapline)

    graph.addNode({
      shape: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      shape: 'circle',
      x: 250,
      y: 80,
      width: 50,
      height: 50,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      shape: 'ellipse',
      x: 350,
      y: 150,
      width: 80,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    graph.addNode({
      shape: SNAP_PORT_RECT,
      x: 400,
      y: 250,
      width: 80,
      height: 40,
      ports: [
        { id: 'port2', group: 'right' },
        { id: 'port3', group: 'right' },
        { id: 'port4', group: 'bottom' },
        { id: 'port5', group: 'bottom' },
        { id: 'port6', group: 'bottom' },
        { id: 'port7', group: 'absolute', args: { x: -10, y: 10 } },
      ],
    })

    graph.addNode({
      shape: SNAP_PORT_RECT,
      x: 400,
      y: 350,
      width: 100,
      height: 60,
      ports: [
        { id: 'port1', group: 'left' },
        { id: 'port2', group: 'left' },
        { id: 'port3', group: 'left' },
        { id: 'port4', group: 'left' },
      ],
    })

    graph.addNode({
      shape: SNAP_PORT_RECT,
      x: 400,
      y: 500,
      width: 100,
      height: 60,
      ports: [
        { id: 'port1', group: 'top' },
        { id: 'port2', group: 'top' },
        { id: 'port3', group: 'top' },
        { id: 'port4', group: 'top' },
      ],
    })
    graph.addNode({
      x: 200,
      y: 500,
      width: 100,
      height: 60,
      angle: 45,
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
      ],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
