import React from 'react'
import { Graph, EdgeView, Vector } from '../../../../src'
import '../index.less'

export class SendTokenExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
    })

    const rect2 = graph.addNode({
      x: 280,
      y: 40,
      width: 100,
      height: 40,
    })

    const edge = graph.addEdge({
      source: rect1,
      target: rect2,
    })

    const view = graph.findViewByCell(edge) as EdgeView
    const token = Vector.create('circle', { r: 6, fill: 'green' })

    view.on('view:render', () => {
      view.sendToken(token.node, {
        duration: 2000,
        reversed: false,
        repeatCount: 'indefinite',
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap" style={{ height: 500 }}>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
