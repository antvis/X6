import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      tooltip: true,
      htmlLabels: true,
      nodeLabelsMovable: true,
    })

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        data: 'NodeLabelsMovable',
        x: 60,
        y: 60,
        width: 80,
        height: 30,
      })

      graph.addNode({
        parent: node1,
        data: 'Label 1',
        x: 0.5,
        y: 1,
        width: 0,
        height: 0,
        relative: true,
      })

      graph.addNode({
        parent: node1,
        data: 'Label 2',
        x: 0.5,
        y: 0,
        width: 0,
        height: 0,
        relative: true,
      })

      const node2 = graph.addNode({
        data:
          'Wrapping and clipping is enabled only if the cell is collapsed, otherwise the label is truncated if there is no manual offset.', // tslint:disable-line
        x: 240,
        y: 240,
        width: 80,
        height: 30,
        alternateBounds: { x: 0, y: 0, width: 80, height: 30 },
      })

      graph.addNode({
        parent: node2,
        data: 'Label 1',
        x: 0.5,
        y: 1,
        width: 0,
        height: 0,
        relative: true,
      })

      graph.addNode({
        parent: node2,
        data: 'Label 2',
        x: 0.5,
        y: 0,
        width: 0,
        height: 0,
        relative: true,
      })

      graph.addEdge({
        data: 'edgeLabelsMovable',
        source: node1,
        target: node2,
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
