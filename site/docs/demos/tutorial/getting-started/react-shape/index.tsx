import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Dropdown } from 'antd'

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

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.react-shape-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.react-shape-app .app-content {
  flex: 1;
  height: 280px;
  margin-right: 8px;
  margin-left: 8px;
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1);
}
.react-shape-app .custom-react-node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #8f8f8f;
  border-radius: 6px;
}
.react-shape-app .custom-react-node span {
  display: inline-block;
  width: 100%;
  height: 100%;
}
`)
