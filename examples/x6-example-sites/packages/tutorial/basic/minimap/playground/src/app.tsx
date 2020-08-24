import * as React from 'react'
import { Graph } from '@antv/x6'
import { SimpleNodeView } from './view'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 400,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 200,
        height: 160,
        padding: 10,
        graphOptions: {
          async: true,
          getCellView(cell) {
            if (cell.isNode()) {
              return SimpleNodeView
            }
          },
          createCellView(cell) {
            if (cell.isEdge()) {
              return null
            }
          },
        },
      },
    })

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })

    this.graph.zoomTo(1.8)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
        <div className="app-minimap" ref={this.refMiniMapContainer} />
      </div>
    )
  }
}
