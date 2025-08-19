import React from 'react'
import { Graph } from '@antv/x6'
import { Settings } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: { color: '#F2F7FA' },
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = this.graph.addNode({
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'Grid',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.graph.centerContent()
  }

  onBackgroundChanged = (options: Graph.BackgroundManager.Options) => {
    this.graph.drawBackground(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="background-app">
        <div className="app-side">
          <Settings onChange={this.onBackgroundChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
