import React from 'react'
import { Graph } from '@antv/x6'
import data from './data'
import { Button } from 'antd'
import './index.less'
import { register } from '@antv/x6-react-shape'

const NodeComponent = () => {
  return (
    <div className="react-node">
      <img
        src="https://gw.alipayobjects.com/zos/bmw-prod/d9f3b597-3a2e-49c3-8469-64a1168ed779.svg"
        alt=""
      />
      <span>深度学习</span>
    </div>
  )
}

register({
  shape: 'perf-node-v2',
  width: 144,
  height: 28,
  effect: ['width'],
  component: NodeComponent,
})

export default class Canvas extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: false,
      connecting: {
        connector: 'algo-connector-v2',
        connectionPoint: 'anchor',
        anchor: 'center',
      },
    })
    this.graph = graph
    document.getElementById('add-btn')?.addEventListener('click', () => {
      this.add()
    })
  }

  add = () => {
    data.nodes.forEach((node: any, i) => {
      node.ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: 'gray',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: 'gray',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: 'gray',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: 'gray',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          {
            group: 'top',
            id: i + `_port_top`,
          },
          {
            group: 'right',
            id: i + `_port_right`,
          },
          {
            group: 'bottom',
            id: i + `_port_bottom`,
          },
          {
            group: 'left',
            id: i + `_port_left`,
          },
        ],
      }
    })
    data.edges.forEach((edge: any) => {
      edge.attrs = {
        line: {
          stroke: '#c5c5c5',
          strokeWidth: 1,
        },
      }
    })
    this.graph.fromJSON(data)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <Button id="add-btn">add</Button>
      </div>
    )
  }
}
