import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
      async: true,
    })

    graph.addNode({
      x: 120,
      y: 80,
      width: 100,
      height: 40,
      label: 'rect',
      zIndex: 10,
    })

    graph.addEdge({
      source: { x: 10, y: 10 },
      target: { x: 300, y: 200 },
      zIndex: 1,
    })
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
