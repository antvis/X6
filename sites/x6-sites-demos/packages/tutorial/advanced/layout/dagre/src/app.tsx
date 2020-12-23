import React from 'react'
import { Graph } from '@antv/x6'
import { Layout } from '@antv/layout'
import data from './data'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const dagreLayout = new Layout({
      type: 'dagre',
      rankdir: 'LR',
      align: 'UL',
      ranksep: 30,
      nodesep: 15,
      controlPoints: true,
    })
    const model = dagreLayout.layout(data)

    graph.fromJSON(model)
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
