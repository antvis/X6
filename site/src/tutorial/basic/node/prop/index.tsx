import React from 'react'
import { Graph, Color } from '@antv/x6'
import { Button } from 'antd'
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

const commands = [
  {
    key: 'prop',
    label: 'prop',
  },
  {
    key: 'attr',
    label: 'attr',
  },
]

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

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
      x: 160,
      y: 180,
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
    })

    graph.centerContent()
    this.graph = graph
  }

  change = (command: string) => {
    const nodes = this.graph.getNodes()
    switch (command) {
      case 'prop':
        nodes.forEach((node) => {
          const width = 100 + Math.floor(Math.random() * 50)
          const height = 40 + Math.floor(Math.random() * 10)
          node.prop('size', { width, height })
        })
        break
      case 'attr':
        nodes.forEach((node) => {
          const color = Color.random().toHex()
          node.attr('body/fill', color)
        })
        break
      default:
        break
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="node-prop-app ">
        <div className="app-btns">
          <Button.Group>
            {commands.map((item) => (
              <Button onClick={() => this.change(item.key)} key={item.key}>
                {item.label}
              </Button>
            ))}
          </Button.Group>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
