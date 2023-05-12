import React from 'react'
import { Graph, EdgeView, NodeView } from '@antv/x6'
import { animateAlongEdge, animateAlongNode, clearAnimation } from './animation'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private animate = false

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const source = graph.addNode({
      id: 'source',
      shape: 'rect',
      x: 80,
      y: 250,
      width: 160,
      height: 60,
    })

    const target = graph.addNode({
      id: 'target',
      shape: 'rect',
      x: 520,
      y: 250,
      width: 160,
      height: 60,
    })

    graph.addEdge({
      id: 'edge',
      source,
      target,
    })

    document.addEventListener('click', () => {
      if (this.animate) {
        this.animate = false
        clearAnimation()
      } else {
        this.animate = true
        this.play(graph)
      }
    })
  }

  play(graph: Graph) {
    const sourceNodeView = graph.findViewByCell(
      graph.getCellById('source'),
    ) as NodeView
    const targetNodeView = graph.findViewByCell(
      graph.getCellById('target'),
    ) as NodeView
    const edgeView = graph.findViewByCell(graph.getCellById('edge')) as EdgeView

    animateAlongNode(sourceNodeView, 'M 0 30 L 0 0 L 160 0 L 160 30')
    animateAlongNode(sourceNodeView, 'M 0 30 L 0 60 L 160 60 L 160 30', () => {
      animateAlongEdge(edgeView, () => {
        animateAlongNode(targetNodeView, 'M 0 0 L 160 0 L 160 60 L 0 60')
      })
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
