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
      grid: {
        visible: true,
      },
    })

    const source = this.graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      x: 200,
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

  onGridChanged = (options: any) => {
    this.graph.drawGrid(options)
  }

  onGridSizeChanged = (size: number) => {
    this.graph.setGridSize(size)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings
            onChange={this.onGridChanged}
            onGridSizeChange={this.onGridSizeChanged}
          />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
