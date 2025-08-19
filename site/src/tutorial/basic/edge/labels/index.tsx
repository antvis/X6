import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
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
    })

    const source = graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 220,
      label: 'world',
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
      labels: [
        {
          attrs: {
            label: {
              text: '40%',
              stroke: '#aaa',
            },
          },
          position: 0.4,
        },
        {
          attrs: {
            label: {
              text: '60%',
              stroke: '#aaa',
            },
          },
          position: 0.6,
        },
      ],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="labels-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
