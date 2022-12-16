import React from 'react'
import { Graph, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Progress } from 'antd'
import styles from './index.less'

const NodeComponent = ({ node }: { node: Node }) => {
  const { progress } = node.getData()
  return (
    <div className={styles['react-node']}>
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
      <div className={styles.app}>
        <div className={styles['app-content']} ref={this.refContainer} />
      </div>
    )
  }
}
