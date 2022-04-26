import React from 'react'
import { Graph } from '@antv/x6-next'
import { Node, Registry } from '@antv/x6-core'
import { Path } from '@antv/x6-geometry'
import { Button } from 'antd'
import data from './data'
import '../index.less'

Registry.Connector.registry.register(
  'algo-connector',
  (s, e) => {
    const offset = 4
    const deltaY = Math.abs(e.y - s.y)
    const control = Math.floor((deltaY / 3) * 2)

    const v1 = { x: s.x, y: s.y + offset + control }
    const v2 = { x: e.x, y: e.y - offset - control }

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `,
    )
  },
  true,
)

Node.registry.register(
  'perf-node',
  {
    width: 144,
    height: 28,
    markup: [
      {
        tagName: 'rect',
      },
      {
        tagName: 'image',
      },
      {
        tagName: 'text',
      },
    ],
    attrs: {
      rect: {
        rx: 10,
        ry: 10,
        refWidth: '100%',
        refHeight: '100%',
        fill: '#FFF',
        stroke: '#5f95ff',
        strokeWidth: 1,
        pointerEvents: 'visiblePainted',
      },
      image: {
        x: 8,
        y: 8,
        width: 16,
        height: 16,
        xlinkHref:
          'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ',
      },
      text: {
        x: 30,
        y: 20,
        text: 'SCQL 归一化',
      },
    },
  },
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
      connecting: {
        connector: 'algo-connector',
        connectionPoint: 'anchor',
        anchor: 'center',
      },
    })
    this.graph = graph
  }

  add = () => {
    data.nodes.forEach((node: any, i) => {
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
    // data.edges.forEach((edge: any) => {
    //   edge.attrs = {
    //     line: {
    //       stroke: '#ccc',
    //       strokeWidth: 1,
    //     },
    //   }
    // })
    data.edges = []

    const start = performance.now()
    this.graph.fromJSON(data)
    console.log('total', performance.now() - start)
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
