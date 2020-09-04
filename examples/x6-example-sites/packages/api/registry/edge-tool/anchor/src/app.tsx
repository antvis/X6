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
    })

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 80,
      height: 30,
      label: 'Target',
    })

    graph.addEdge({
      source: { cell: source.id, anchor: 'bottom' },
      target: { cell: target.id, anchor: 'top' },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'source-anchor',
        },
        {
          name: 'target-anchor',
          args: {
            attrs: {
              fill: 'red',
            },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
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
