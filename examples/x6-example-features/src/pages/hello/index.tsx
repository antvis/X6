import React from 'react'
import { Graph, Node } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
    })
    const rect1 = graph.addNode({
      x: 60,
      y: 60,
      width: 100,
      height: 100,
      label: 'hhh',
    })
    const rect2 = graph.addNode({
      x: 360,
      y: 260,
      width: 100,
      height: 100,
      label: 'mmm',
    })
    graph.addEdge({
      source: rect1,
      target: rect2
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
