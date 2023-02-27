import React from 'react'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Progress } from 'antd'
import './index.less'

const NodeComponent = () => {
  return (
    <div className="react-node">
      <Progress type="circle" percent={30} width={80} />
    </div>
  )
}

register({
  shape: 'custom-basic-react-node',
  width: 100,
  height: 100,
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

    graph.addNode({
      shape: 'custom-basic-react-node',
      x: 60,
      y: 100,
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-basic-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
