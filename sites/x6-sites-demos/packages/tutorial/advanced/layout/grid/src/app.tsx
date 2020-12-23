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

    const gridLayout = new Layout({
      type: 'grid',
      begin: [10, 10],
      width: 480,
      height: 260,
      sortBy: 'label',
      rows: 3,
      cols: 7,
    })

    const model = gridLayout.layout(data)
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
