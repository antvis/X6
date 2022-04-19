import React from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6-react-shape'
import { Button } from 'antd'
import data from './data'
import '../index.less'

Graph.registerReactComponent(
  'custom',
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #5f95ff',
      backgroundColor: '#fff',
      borderRadius: '10px',
    }}
  >
    <div>
      <img
        src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ"
        alt=""
        style={{ width: 16, height: 16 }}
      />
    </div>
    <div>SCQL 归一化</div>
  </div>,
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1600,
      height: 1000,
      grid: true,
      async: false,
    })
    this.graph = graph
  }

  add = () => {
    data.nodes.forEach((node: any, i) => {
      node.shape = 'react-shape'
      node.component = 'custom'
      node.width = 144
      node.height = 28
      node.ports = {
        groups: {
          top: {
            position: 'top',
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
          right: {
            position: 'right',
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
          bottom: {
            position: 'bottom',
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
          left: {
            position: 'left',
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
          stroke: '#ccc',
          strokeWidth: 1,
        },
      }
    })

    const start = performance.now()
    this.graph.fromJSON(data)
    console.log('time：', performance.now() - start)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <Button onClick={this.add}>addNodesWithPorts</Button>
      </div>
    )
  }
}
