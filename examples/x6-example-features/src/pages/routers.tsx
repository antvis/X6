import React from 'react'
import { Graph, Style } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)
    const style: Style = {
      startArrow: 'classic',
      endArrow: 'classic',
      labelBackgroundColor: '#fff',
    }
    graph.addEdge({
      label: 'straight line',
      sourcePoint: { x: 40, y: 32 * 2 },
      targetPoint: { x: 240, y: 32 * 2 },
      style: {
        ...style,
      },
    })

    graph.addEdge({
      label: 'curved line',
      sourcePoint: { x: 320, y: 32 * 2 },
      targetPoint: { x: 520, y: 32 * 2 },
      points: [[420, 32 * 3]],
      style: {
        ...style,
        curved: true,
      },
    })

    graph.addEdge({
      label: 'horizontal elbow',
      sourcePoint: { x: 40, y: 32 * 4 },
      targetPoint: { x: 240, y: 32 * 6 },
      style: {
        ...style,
        edge: 'elbow',
      },
    })

    graph.addEdge({
      label: 'vertical elbow',
      sourcePoint: { x: 320, y: 32 * 4 },
      targetPoint: { x: 520, y: 32 * 6 },
      style: {
        ...style,
        edge: 'elbow',
        elbow: 'vertical',
      },
    })

    graph.addEdge({
      label: 'entity relation',
      sourcePoint: { x: 40, y: 32 * 8 },
      targetPoint: { x: 240, y: 32 * 10 },
      style: {
        ...style,
        edge: 'er',
      },
    })

    graph.addEdge({
      label: 'orth',
      sourcePoint: { x: 320, y: 32 * 8 },
      targetPoint: { x: 520, y: 32 * 10 },
      style: {
        ...style,
        edge: 'orth',
      },
    })

    graph.addEdge({
      label: 'segment',
      sourcePoint: { x: 40, y: 32 * 12 },
      targetPoint: { x: 240, y: 32 * 16 },
      points: [
        [80, 32 * 12],
        [120, 32 * 13],
        [160, 32 * 14],
        [200, 32 * 15],
      ],
      style: {
        ...style,
        edge: 'segment',
      },
    })

    const node1 = graph.addNode({
      label: 'Loop',
      x: 320,
      y: 32 * 13 - 15,
      width: 80,
      height: 30,
    })

    const node2 = graph.addNode({
      label: 'Loop',
      x: 440,
      y: 32 * 13 - 15,
      width: 80,
      height: 30,
    })

    graph.addEdge({
      source: node1,
      target: node1,
      style: {
        ...style,
        edge: 'loop',
        curved: true,
      },
    })

    graph.addEdge({
      source: node2,
      target: node2,
      style: {
        ...style,
        edge: 'loop',
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
