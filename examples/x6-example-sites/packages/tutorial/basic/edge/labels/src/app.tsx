import React from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6/es/index.css'
import './app.css'

export default class Example extends React.Component {
  static noLayout = true
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const hello = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const world = graph.addNode({
      x: 200,
      y: 240,
      width: 100,
      height: 40,
      label: 'World',
    })

    const edge = graph.addEdge({
      source: hello,
      target: world,
    })

    edge.setLabels({
      attrs: { text: { text: 'edge' } },
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
