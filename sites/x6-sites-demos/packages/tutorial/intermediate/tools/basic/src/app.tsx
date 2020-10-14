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
      x: 40,
      y: 40,
      width: 80,
      height: 30,
      label: 'Source',
      tools: ['button-remove'],
    })

    const target = graph.addNode({
      x: 160,
      y: 240,
      width: 80,
      height: 30,
      label: 'Target',
      tools: ['button-remove'],
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 80, y: 160 },
        { x: 200, y: 160 },
      ],
      tools: ['vertices', 'segments'],
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
