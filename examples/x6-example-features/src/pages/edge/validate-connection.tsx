import React from 'react'
import { Graph, Edge, EdgeView } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      connecting: {
        validateMagnet({ cell, magnet }) {
          let count = 0
          const connectionCount = magnet.getAttribute('connection-count')
          const max = connectionCount
            ? parseInt(connectionCount, 10)
            : Number.MAX_SAFE_INTEGER
          const outgoingEdges = graph.getOutgoingEdges(cell)
          if (outgoingEdges) {
            outgoingEdges.forEach((edge: Edge) => {
              const edgeView = graph.findViewByCell(edge) as EdgeView
              if (edgeView.sourceMagnet === magnet) {
                count += 1
              }
            })
          }
          return count < max
        },
      },
    })

    graph.addNode({
      shape: 'rect',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      label: 'source',
      ports: [
        {
          id: 'a',
          attrs: {
            circle: {
              magnet: true,
              connectionCount: 3, // 自定义属性，控制连接桩可连接多少条边
            },
          },
        },
        {
          id: 'b',
          attrs: {
            circle: {
              magnet: true,
              connectionCount: 0, // 自定义属性，控制连接桩可连接多少条边
            },
          },
        },
      ],
      attrs: {
        body: {
          magnet: true,
          connectionCount: 2, // 自定义属性，控制节点可连接多少条边
        },
      },
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
