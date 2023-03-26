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
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: [
        {
          name: 'button-remove',
          args: {
            x: '100%',
            y: 0,
            offset: { x: -10, y: 10 },
          },
        },
      ],
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
          name: 'button-remove',
          args: {
            x: 0,
            y: 0,
            offset: { x: 10, y: 10 },
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
      <div className="button-remove-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
