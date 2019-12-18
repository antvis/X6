import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      resize: {
        enabled: true,
        // centered: true,
        // livePreview: true,
      },
      rotate: { enabled: true },
      nodeLabelsMovable: true,
      edgeLabelsMovable: true,
      dropEnabled: true,
    })

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        x: 40,
        y: 40,
        width: 400,
        height: 300,
      })

      graph.addNode({
        x: 40,
        y: 40,
        width: 80,
        height: 30,
        parent: node1,
        label: 'Inner',
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
