import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private graphContainer1: HTMLDivElement
  private graphContainer2: HTMLDivElement

  componentDidMount() {
    const graph1 = new Graph({
      container: this.graphContainer1,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      scroller: true,
      autoResize: true,
    })

    const rect = graph1.addNode({
      x: 300,
      y: 300,
      width: 90,
      height: 60,
    })

    const circle = graph1.addNode({
      x: 400,
      y: 400,
      width: 40,
      height: 40,
    })

    graph1.addEdge({
      source: rect,
      target: circle,
    })

    const graph2 = new Graph({
      container: this.graphContainer2,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      autoResize: true,
    })

    const source = graph2.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 40,
    })

    const target = graph2.addNode({
      x: 120,
      y: 100,
      width: 80,
      height: 40,
    })

    graph2.addEdge({
      source,
      target,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.graphContainer1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.graphContainer2 = container
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className="x6-graph-wrap" style={{ display: 'flex' }}>
          <div
            ref={this.refContainer1}
            style={{ flex: 1, margin: '0 32px' }}
            className="x6-graph"
          />
        </div>
        <div className="x6-graph-wrap" style={{ display: 'flex' }}>
          <div
            ref={this.refContainer2}
            style={{ flex: 1, margin: '0 32px' }}
            className="x6-graph"
          />
        </div>
      </div>
    )
  }
}
