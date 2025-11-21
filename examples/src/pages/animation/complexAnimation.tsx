import { Graph } from '@antv/x6'
import React from 'react'
import '../index.less'

export class ComplexAnimationExample extends React.Component {
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

    const ball = graph.addNode({
      shape: 'circle',
      x: -25,
      y: 50,
      width: 50,
      height: 50,
      attrs: {
        label: {
          text: 'ball',
          fontSize: 20,
          stroke: '#8f8f8f',
        },
        body: {
          fill: '#FFFFFF',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    ball.animate(
      { angle: 360 },
      {
        delay: 1000,
        duration: 1000,
        fill: 'forwards',
      },
    )

    ball.animate(
      { 'position/x': 550 },
      {
        delay: 1000,
        duration: 1000,
        fill: 'forwards',
      },
    )

    ball.animate(
      { 'position/y': 350 },
      {
        delay: 1000,
        duration: 1000,
        fill: 'forwards',
      },
    )

    ball.animate(
      { 'attrs/body/fill': '#FFFF00' },
      {
        delay: 3000,
        duration: 500,
      },
    )

    graph.addNode({
      shape: 'ellipse',
      x: 400,
      y: 50,
      width: 35,
      height: 20,
      attrs: {
        label: {
          text: 'u.f.o.',
          fontSize: 10,
          stroke: '8f8f8f',
        },
        body: {
          fill: '#FFFFFF',
          stroke: '#8f8f8f',
          strokeWidth: 1,
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
