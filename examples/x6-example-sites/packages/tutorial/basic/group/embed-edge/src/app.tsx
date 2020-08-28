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

    const source = graph.addNode({
      x: 80,
      y: 100,
      width: 80,
      height: 40,
      label: 'Child\n(source)',
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

    const target = graph.addNode({
      x: 280,
      y: 80,
      width: 80,
      height: 40,
      label: 'Child\n(target)',
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
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent\n(try to move me)',
      attrs: {
        label: { refY: 140 },
        body: {
          fill: '#fffbe6',
        },
      },
    })

    parent.addChild(source)
    parent.addChild(target)

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 120, y: 60 },
        { x: 200, y: 100 },
      ],
    })
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
