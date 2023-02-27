import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Button } from 'antd'
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
          label: {
            position: 'top',
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
          label: {
            position: 'top',
          },
        },
      },
    },
  },
  true,
)

const commands = [
  {
    key: 'addPort',
    label: 'addPort',
  },
  {
    key: 'removePort',
    label: 'removePort',
  },
  {
    key: 'updatePort',
    label: 'updatePort',
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

    graph.addNode({
      id: '1',
      shape: 'custom-node-width-port',
      x: 150,
      y: 100,
      label: 'hello',
    })

    graph.centerContent()
    this.graph = graph
  }

  change = (command: string) => {
    const node = this.graph.getCellById('1') as Node
    const ports = node.getPorts()
    let color: string
    switch (command) {
      case 'addPort':
        node.addPort({
          group: 'top',
          attrs: {
            text: {
              text: `${ports.length + 1}`,
            },
          },
        })
        break
      case 'removePort':
        if (ports.length) {
          node.removePortAt(ports.length - 1)
        }
        break
      case 'updatePort':
        color = Color.random().toHex()
        ports.forEach((port) => {
          node.portProp(port.id!, 'attrs/circle/stroke', color)
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
      <div className="dynamic-app">
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
