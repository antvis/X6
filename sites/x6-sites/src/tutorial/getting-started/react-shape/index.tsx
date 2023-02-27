import React from 'react'
import { Graph, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Dropdown } from 'antd'
import './index.less'

const CustomComponent = ({ node }: { node: Node }) => {
  const label = node.prop('label')
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'copy',
            label: '复制',
          },
          {
            key: 'paste',
            label: '粘贴',
          },
          {
            key: 'delete',
            label: '删除',
          },
        ],
      }}
      trigger={['contextMenu']}
    >
      <div className="custom-react-node">{label}</div>
    </Dropdown>
  )
}

register({
  shape: 'custom-react-node',
  width: 100,
  height: 40,
  component: CustomComponent,
})

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'custom-react-node',
      x: 40,
      y: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'custom-react-node',
      x: 160,
      y: 180,
      label: 'world',
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data)
    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-shape-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
