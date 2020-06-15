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
    })

    const data = {
      // 节点
      nodes: [
        {
          id: 'node1',
          x: 100,
          y: 100,
          width: 80,
          height: 40,
          label: 'hello',
        },
        {
          id: 'node2',
          x: 240,
          y: 300,
          width: 80,
          height: 40,
          label: 'world',
        },
      ],
      // 边
      edges: [
        {
          source: 'node1',
          target: 'node2',
        },
      ],
    }

    graph.fromJSON(data)
    console.log(graph.toJSON())
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
