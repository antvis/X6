import React from 'react'
import { Graph, Shape } from '@antv/x6'
import styles from './index.less'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html() {
    const div = document.createElement('div')
    div.className = styles['custom-html']
    return div
  },
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
      shape: 'custom-html',
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
      <div className={styles.app}>
        <div className={styles['app-content']} ref={this.refContainer} />
      </div>
    )
  }
}
