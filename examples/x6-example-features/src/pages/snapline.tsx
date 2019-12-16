import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      guide: {
        enabled: true,
        dashed: true,
        horizontal: {
          dashed: false,
          stroke: '#ff0000',
        },
      },
      rubberband: true,
    })

    graph.batchUpdate(() => {
      graph.addNode({ label: 'Hello', x: 60, y: 60, width: 80, height: 70 })
      graph.addNode({ label: 'World', x: 240, y: 240, width: 80, height: 40 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
