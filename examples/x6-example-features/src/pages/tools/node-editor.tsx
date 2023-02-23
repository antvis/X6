import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    graph.on('cell:dblclick', ({ cell, e }) => {
      const isNode = cell.isNode()
      const name = cell.isNode() ? 'node-editor' : 'edge-editor'
      cell.removeTool(name)
      cell.addTools({
        name,
        args: {
          event: e,
          attrs: {
            backgroundColor: isNode ? '#EFF4FF' : '#FFF',
          },
        },
      })
    })

    const source = graph.addNode({
      x: 180,
      y: 60,
      width: 100,
      height: 40,
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                stroke: '#5F95FF',
                strokeWidth: 1,
                r: 4,
              },
            },
          },
        },
        items: [
          {
            id: 'port-1',
            group: 'bottom',
            tip: 'port-1-tip',
          },
        ],
      },
    })

    const target = graph.addNode({
      x: 320,
      y: 250,
      width: 100,
      height: 40,
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                stroke: '#5F95FF',
                strokeWidth: 1,
                r: 4,
              },
            },
          },
        },
        items: [
          {
            id: 'port-2',
            group: 'top',
            tip: 'port-2-tip',
          },
        ],
      },
    })

    graph.addEdge({
      source: { cell: source, port: 'port-1' },
      target: { cell: target, port: 'port-2' },
      attrs: {
        line: {
          stroke: '#A2B1C3',
          strokeWidth: 2,
        },
      },
      zIndex: -1,
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
