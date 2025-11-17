import { Graph, Shape } from '@antv/x6'
import React from 'react'
import '../index.less'

export class EdgeAnimationExample extends React.Component {
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
      animation: [
        [
          { 'attrs/line/strokeDashoffset': -20 },
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
      animation: [
        [
          { 'attrs/marker/atConnectionRatio': 1 },
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
      animation: [
        [
          { 'attrs/line/strokeWidth': 4 },
          {
            duration: 1500,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out-back',
          },
        ],
        [
          'attrs/line/opacity',
          1,
          {
            duration: 1500,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out-back',
          },
        ],
      ],
    })

    graph.addEdge({
      source: { x: 60, y: 240 },
      target: { x: 240, y: 240 },
      vertices: [{ x: 160, y: 260 }],
      connector: { name: 'smooth' },
      attrs: {
        line: {
          stroke: '#7d8fff',
          strokeWidth: 2,
          opacity: 0.6,
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
