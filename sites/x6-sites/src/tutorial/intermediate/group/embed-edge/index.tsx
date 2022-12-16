import React from 'react'
import { Graph } from '@antv/x6'
import styles from './index.less'

Graph.registerNode(
  'custom-group-node',
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
  },
  true,
)
export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-group-node',
      x: 60,
      y: 100,
      label: 'Child\n(inner)',
      zIndex: 2,
    })

    const target = graph.addNode({
      shape: 'custom-group-node',
      x: 420,
      y: 80,
      label: 'Child\n(outer)',
      zIndex: 2,
    })

    const parent = graph.addNode({
      shape: 'custom-group-node',
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent\n(try to move me)',
    })

    parent.addChild(source)
    parent.addChild(target)

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 120, y: 60 },
        { x: 200, y: 100 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
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
