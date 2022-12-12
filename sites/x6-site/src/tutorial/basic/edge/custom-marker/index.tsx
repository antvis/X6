import React from 'react'
import { Graph } from '@antv/x6'
import styles from './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: [100, 140],
      target: [400, 140],
      label: 'custom-marker',
      attrs: {
        line: {
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: '#D94111',
            strokeWidth: 2,
            fill: '#90C54C',
            d: 'M 20 -10 0 0 20 10 Z',
          },
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
