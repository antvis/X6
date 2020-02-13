import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      // resize: {
      //   enabled: true,
      //   // centered: true,
      //   // livePreview: true,
      // },
      // rotate: { enabled: true },
      // nodeLabelsMovable: true,
      // edgeLabelsMovable: true,
      // dropEnabled: true,
      folding: { enabled: true },
    })

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        x: 40,
        y: 40,
        width: 160,
        height: 120,
        alternateBounds: { x: 0, y: 0, width: 100, height: 40 },
      })

      graph.addNode({
        x: 40,
        y: 40,
        width: 80,
        height: 30,
        parent: node1,
        label: 'Child',
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
