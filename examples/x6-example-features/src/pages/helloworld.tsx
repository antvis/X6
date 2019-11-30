import React from 'react'
import { Graph } from '@antv/x6'
import styles from './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.addNode({ data: 'Hello', x: 60, y: 60, width: 80, height: 30 })
      const node2 = graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 30 })
      graph.addEdge({ data: 'Edge Label', source: node1, target: node2 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className={styles.graph} />
  }
}
