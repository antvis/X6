import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const parent = graph.addNode({
      id: '1',
      shape: 'rect',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      label: 'parent',
    })
    const child1 = graph.addNode({
      id: '2',
      shape: 'rect',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      label: 'child1',
    })

    const child2 = graph.addNode({
      id: '3',
      shape: 'rect',
      x: 520,
      y: 320,
      width: 160,
      height: 60,
      label: 'child2',
    })

    parent.addChild(child1)
    child1.addChild(child2)

    console.log(graph.toJSON())

    graph.fromJSON(graph.toJSON())

    graph.removeNode('1')
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
