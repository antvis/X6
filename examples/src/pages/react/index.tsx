import React from 'react'
import { register } from '@antv/x6-react-shape'
import { Graph, Node } from '@antv/x6'
import '../index.less'
import './index.less'

const NodeComponent = ({ node }: { node: Node }) => {
  const data = node.getData()

  return (
    <div className="react-algo-node">
      <img
        src="https://gw.alipayobjects.com/zos/bmw-prod/d9f3b597-3a2e-49c3-8469-64a1168ed779.svg"
        alt=""
      />
      <span>{data.name}</span>
    </div>
  )
}

register({
  shape: 'algo-node-1',
  width: 144,
  height: 28,
  effect: ['data'],
  component: NodeComponent,
})

export class ReactExample extends React.Component {
  private container!: HTMLDivElement
  private count = 0

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const node = graph.addNode({
      shape: 'algo-node-1',
      x: 80,
      y: 80,
      data: {
        name: '逻辑回归',
      },
    })

    const update = () => {
      node.setData({ name: `逻辑回归 ${(this.count += 1)}` })
      setTimeout(update, 1000)
    }

    update()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
