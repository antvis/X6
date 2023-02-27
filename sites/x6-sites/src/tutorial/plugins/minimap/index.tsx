import * as React from 'react'
import { Graph } from '@antv/x6'
import { MiniMap } from '@antv/x6-plugin-minimap'
import { Scroller } from '@antv/x6-plugin-scroller'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 400,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Scroller({
        enabled: true,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      }),
    )
    this.graph.use(
      new MiniMap({
        container: this.minimapContainer,
        width: 200,
        height: 160,
        padding: 10,
      }),
    )

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
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
      shape: 'circle',
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
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

    // this.graph.zoomTo(1.8)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div className="minimap-app">
        <div className="app-content" ref={this.refContainer} />
        <div className="app-minimap" ref={this.refMiniMapContainer} />
      </div>
    )
  }
}
