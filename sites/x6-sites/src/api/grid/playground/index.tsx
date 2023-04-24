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
      grid: {
        visible: true,
      },
      background: {
        color: '#F2F7FA',
      },
      mousewheel: true,
    })

    const source = this.graph.addNode({
      x: 40,
      y: 40,
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
      x: 200,
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
      <div className="grid-app">
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
