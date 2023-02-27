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
      connecting: {
        allowNode: false,
        allowBlank: false,
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
          // 节点上方的连接桩无法创建连线
          return magnet.getAttribute('port-group') !== 'top'
        },
        validateConnection({
          sourceCell,
          targetCell,
          sourceMagnet,
          targetMagnet,
        }) {
          // 不能连接自身
          if (sourceCell === targetCell) {
            return false
          }

          // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'top'
          ) {
            return false
          }
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'top'
          ) {
            return false
          }

          // 不能重复连线
          const edges = this.getEdges()
          const portId = targetMagnet.getAttribute('port')
          if (edges.find((edge) => edge.getTargetPortId() === portId)) {
            return false
          }

          return true
        },
      },
      highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 4,
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
    })

    graph.addNode({
      shape: 'custom-node-width-port',
      x: 40,
      y: 40,
      label: 'hello',
      ports: {
        items: [
          {
            id: 'port_1',
            group: 'top',
          },
          {
            id: 'port_2',
            group: 'top',
          },
          {
            id: 'port_3',
            group: 'bottom',
          },
          {
            id: 'port_4',
            group: 'bottom',
          },
        ],
      },
    })

    graph.addNode({
      shape: 'custom-node-width-port',
      x: 160,
      y: 180,
      label: 'world',
      ports: {
        items: [
          {
            id: 'port_5',
            group: 'top',
          },
          {
            id: 'port_6',
            group: 'top',
          },
          {
            id: 'port_7',
            group: 'bottom',
          },
          {
            id: 'port_8',
            group: 'bottom',
          },
        ],
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="validate-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
