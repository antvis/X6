import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const child1 = graph.addNode({
      x: 100,
      y: 80,
      width: 120,
      height: 60,
      label: 'Child\n(inside)',
      zIndex: 10,
      attrs: {
        body: {
          stroke: 'none',
          fill: '#3199FF',
        },
        label: {
          fill: '#fff',
        },
      },
    })

    const child2 = graph.createNode({
      x: 360,
      y: 80,
      width: 120,
      height: 60,
      label: 'Child\n(outside)',
      zIndex: 10,
      attrs: {
        body: {
          stroke: 'none',
          fill: '#47C769',
        },
        label: {
          fill: '#fff',
        },
      },
    })

    const parent = graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 160,
      zIndex: 1,
      label: 'Parent\n(try to move me)',
      attrs: {
        label: { refY: 130 },
        body: {
          fill: '#fffbe6',
        },
      },
    })

    parent.addChild(child1)
    parent.addChild(child2)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
