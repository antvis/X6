import React from 'react'
import { Graph } from '@antv/x6'
import { Settings } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      background: { color: '#f0f0f0' },
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'Grid',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onBackgroundChanged = (options: Graph.BackgroundManager.Options) => {
    this.graph.drawBackground(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onBackgroundChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
