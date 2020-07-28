import React from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6/es/index.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 240,
      y: 160,
      width: 100,
      height: 40,
      label: 'world',
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
      router: {
        name: 'er',
        args: { offset: 24 },
      },
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
