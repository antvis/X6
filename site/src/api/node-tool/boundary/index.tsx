import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

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
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      tools: [
        {
          name: 'boundary',
          args: {
            padding: 5,
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2,
            },
          },
        },
      ],
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

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 100,
      height: 40,
      label: 'target',
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

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'boundary',
          args: {
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2,
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ node }) => {
      if (node === target) {
        node.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="boundary-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
