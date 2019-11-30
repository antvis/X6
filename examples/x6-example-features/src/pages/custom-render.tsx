import React from 'react'
import { Graph } from '@antv/x6'
import styles from './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        data: 'Custom',
        x: 60,
        y: 60,
        width: 80,
        height: 30,
        render(elem, cell) {
          const rect = elem.querySelector('rect') as SVGRectElement
          rect.style.stroke = '#ff0000'
          rect.style.strokeWidth = '2'
        },
      })
      const node2 = graph.addNode({ data: 'Render', x: 240, y: 240, width: 80, height: 30 })
      graph.addEdge({
        data: 'Custom Render',
        source: node1,
        target: node2,
        render(elem) { },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className={styles.graph} />
  }
}
