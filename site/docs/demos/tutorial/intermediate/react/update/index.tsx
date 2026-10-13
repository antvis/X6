import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Progress } from 'antd'

const NodeComponent = ({ node }: { node: Node }) => {
  const { progress } = node.getData()
  return (
    <div className="react-node">
      <Progress type="circle" percent={progress} width={80} />
    </div>
  )
}

register({
  shape: 'custom-update-react-node',
  width: 100,
  height: 100,
  effect: ['data'],
  component: NodeComponent,
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const node = graph.addNode({
      shape: 'custom-update-react-node',
      x: 60,
      y: 100,
      data: {
        progress: 30,
      },
    })

    setInterval(() => {
      const { progress } = node.getData<{ progress: number }>()
      node.setData({
        progress: (progress + 10) % 100,
      })
    }, 1000)

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-update-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.react-update-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.react-update-app .app-content {
  flex: 1;
  height: 240px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.react-update-app .react-node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid #8f8f8f;
  border-radius: 6px;
}
`)
