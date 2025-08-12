import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

Graph.registerNode(
  'custom-node-with-port',
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
        in: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        out: {
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
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        padding: 3,
        attrs: {
          strokeWidth: 3,
          stroke: '#52c41a',
        },
      },
    }

    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,

        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          })
        },

        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },

        validateConnection({ sourceMagnet, targetMagnet }) {
          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    })

    const source = graph.addNode({
      shape: 'custom-node-with-port',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    const target = graph.addNode({
      shape: 'custom-node-with-port',
      x: 140,
      y: 240,
      width: 100,
      height: 40,
      label: 'target',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'hello',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out-2' },
      target: { cell: target.id, port: 'in-1' },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'source-arrowhead',
        },
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: 'red',
            },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-arrowhead-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
