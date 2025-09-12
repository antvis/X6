import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 300,
      y: 300,
      width: 100,
      height: 40,
      label: 'world',
    })

    graph.addNode({
      shape: 'circle',
      x: 100 - 5,
      y: 200 - 5,
      width: 10,
      height: 10,
      attrs: { body: { fill: '#31d0c6', stroke: '#fe854f' } },
    })

    graph.addNode({
      shape: 'circle',
      x: 300 - 5,
      y: 120 - 5,
      width: 10,
      height: 10,
      attrs: { body: { fill: '#31d0c6', stroke: '#fe854f' } },
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      router: {
        name: 'orth',
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
