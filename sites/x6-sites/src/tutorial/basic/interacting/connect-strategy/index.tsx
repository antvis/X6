import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

Graph.registerEdgeTool('circle-target-arrowhead', {
  inherit: 'target-arrowhead',
  tagName: 'circle',
  attrs: {
    r: 4,
    fill: '#fff',
    stroke: '#8f8f8f',
    'stroke-width': 1,
    cursor: 'move',
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        allowEdge: true,
        highlight: true,
        connectNodeStrategy: 'closest',
        connectEdgeStrategy: 'closest',
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                targetMarker: null,
              },
            },
            tools: ['circle-target-arrowhead'],
          })
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'className',
          args: {
            className: 'x6-available-node',
          },
        },
      },
    })

    graph.addNode({
      shape: 'rect',
      width: 100,
      height: 40,
      x: 60,
      y: 200,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addNode({
      shape: 'rect',
      width: 100,
      height: 40,
      x: 160,
      y: 20,
      label: 'Click Me',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
          magnet: true,
        },
      },
    })

    graph.addEdge({
      source: [260, 200],
      target: [400, 200],
      vertices: [
        [260, 240],
        [400, 240],
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: null,
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
      <div className="connect-strategy-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
