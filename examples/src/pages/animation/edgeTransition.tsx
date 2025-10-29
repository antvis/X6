import { Graph, Shape, Timing } from '@antv/x6'
import React from 'react'
import '../index.less'

export class EdgeTransitionExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 650,
      height: 400,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 60, y: 60 },
      target: { x: 240, y: 60 },
      attrs: {
        line: {
          strokeDasharray: 5,
          strokeDashoffset: 0,
        },
      },
      transition: [
        [
          'attrs/line/strokeDashoffset',
          -20,
          {
            duration: 1000,
            iterations: Infinity,
          },
        ],
      ],
    })

    graph.addEdge({
      source: { x: 60, y: 120 },
      target: { x: 240, y: 120 },
      vertices: [{ x: 160, y: 140 }],
      connector: { name: 'smooth' },
      markup: [
        {
          tagName: 'circle',
          selector: 'marker',
          attrs: {
            stroke: 'none',
            r: 5,
          },
        },
        ...(Shape.Edge.getMarkup() as any[]),
      ],
      attrs: {
        line: {
          strokeDasharray: 5,
          strokeDashoffset: 0,
          stroke: '#9DADCE',
        },
        marker: {
          fill: '#C7D5F6',
          atConnectionRatio: 0,
        },
      },
      transition: [
        [
          'attrs/marker/atConnectionRatio',
          1,
          {
            duration: 2000,
            iterations: Infinity,
          },
        ],
      ],
    })

    graph.addEdge({
      source: { x: 60, y: 180 },
      target: { x: 240, y: 180 },
      vertices: [{ x: 160, y: 200 }],
      connector: { name: 'smooth' },
      attrs: {
        line: {
          stroke: '#7d8fff',
          strokeWidth: 2,
          opacity: 0.6,
          style: {
            filter: 'drop-shadow(0 0 2px #7d8fff)',
          },
        },
      },
      transition: [
        [
          'attrs/line/strokeWidth',
          4,
          {
            duration: 2500,
            iterations: Infinity,
            direction: 'alternate',
            timing: Timing.easeInOutBack,
          },
        ],
        [
          'attrs/line/opacity',
          1,
          {
            duration: 2500,
            iterations: Infinity,
            direction: 'alternate',
            timing: Timing.easeInOutBack,
          },
        ],
      ],
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
