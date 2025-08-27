import React from 'react'
import { Graph } from '../../../../src'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'rect',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      label: 'source',
    })

    const target = graph.addNode({
      shape: 'rect',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      label: 'target',
    })

    graph.addEdge({
      source,
      target,
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
