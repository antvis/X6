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
      source: { x: 100, y: 100 },
      target: { x: 400, y: 100 },
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
    })

    graph.addEdge({
      source: { x: 100, y: 200 },
      target: { x: 400, y: 220 },
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
