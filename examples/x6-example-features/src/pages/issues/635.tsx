import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
    })

    graph.addEdge({
      source: { x: 300, y: 240 },
      target: { x: 460, y: 240 },
      attrs: {
        line: {
          strokeWidth: 8,
          // stroke: '#13C2C1',
          stroke: {
            type: 'linearGradient',
            stops: [
              { offset: '0%', color: '#13C2C1' },
              { offset: '100%', color: '#3366FF' },
            ],
          },
          fill: 'none',
          targetMarker: {
            name: 'block',
            size: 15,
            fill: '#6ED7D8',
            offset: 0,
          },
        },
      },
      tools: ['target-arrowhead'],
    })

    graph.addEdge({
      source: { x: 240, y: 40 },
      target: { x: 40, y: 160 },
      connector: 'smooth',
      attrs: {
        line: {
          strokeWidth: 8,
          // stroke: '#13C2C1',
          stroke: {
            type: 'linearGradient',
            stops: [
              { offset: '0%', color: '#13C2C1' },
              { offset: '100%', color: '#3366FF' },
            ],
          },
          fill: 'none',
          targetMarker: {
            name: 'block',
            size: 15,
            fill: '#6ED7D8',
            offset: 0,
          },
        },
      },
      tools: ['target-arrowhead'],
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
