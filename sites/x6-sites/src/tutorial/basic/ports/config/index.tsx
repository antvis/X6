import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

Graph.registerNode(
  'custom-node-width-port',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-node-width-port',
      x: 40,
      y: 40,
      label: 'hello',
      ports: {
        items: [
          {
            id: 'port_1',
            group: 'bottom',
          },
          {
            id: 'port_2',
            group: 'bottom',
          },
        ],
      },
    })

    const target = graph.addNode({
      shape: 'custom-node-width-port',
      x: 160,
      y: 180,
      label: 'world',
      ports: {
        items: [
          {
            id: 'port_3',
            group: 'top',
          },
          {
            id: 'port_4',
            group: 'top',
          },
        ],
      },
    })

    graph.addEdge({
      source: { cell: source, port: 'port_2' },
      target: { cell: target, port: 'port_3' },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="config-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
