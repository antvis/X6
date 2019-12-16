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
        x: 60,
        y: 60,
        width: 80,
        height: 30,
        label: 'NodeLabelsMovable',
      })

      graph.addNode({
        x: 0.5,
        y: 1,
        width: 0,
        height: 0,
        relative: true,
        parent: node1,
        label: 'Label 1',
      })

      graph.addNode({
        x: 0.5,
        y: 0,
        width: 0,
        height: 0,
        parent: node1,
        relative: true,
        label: 'Label 2',
      })

      const node2 = graph.addNode({
        x: 240,
        y: 240,
        width: 80,
        height: 30,
        label:
          'Wrapping and clipping is enabled only if the cell is collapsed, otherwise the label is truncated if there is no manual offset.', // tslint:disable-line
        alternateBounds: { x: 0, y: 0, width: 80, height: 30 },
      })

      graph.addNode({
        x: 0.5,
        y: 1,
        width: 0,
        height: 0,
        relative: true,
        parent: node2,
        label: 'Label 1',
      })

      graph.addNode({
        x: 0.5,
        y: 0,
        width: 0,
        height: 0,
        relative: true,
        parent: node2,
        label: 'Label 2',
      })

      graph.addEdge({
        source: node1,
        target: node2,
        label: 'edgeLabelsMovable',
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
