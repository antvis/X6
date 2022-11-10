import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { Scroller } from '@antv/x6-plugin-scroller'
import { Selection } from '@antv/x6-plugin-selection'
import { MiniMap } from '@antv/x6-plugin-minimap'
import { Export } from '@antv/x6-plugin-export'
import '../index.less'
import './index.less'
export default class Example extends React.Component {
  private graph: Graph
  private graphContainer: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private scroller: Scroller
  private selection: Selection
  private exportInstance: Export

  componentDidMount() {
    this.graph = new Graph({
      container: this.graphContainer,
      width: 800,
      height: 500,
      background: {
        color: '#f5f5f5',
      },
      grid: {
        visible: true,
      },
      mousewheel: {
        enabled: true,
        // fixed: false,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
      },
    })

    this.scroller = new Scroller({
      enabled: true,
      pageVisible: true,
      pageBreak: true,
      pannable: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown'],
      },
    })
    this.selection = new Selection({
      enabled: true,
      rubberband: true,
      modifiers: 'shift',
    })
    const minimap = new MiniMap({
      container: this.minimapContainer,
      width: 300,
      height: 200,
      padding: 10,
    })
    this.exportInstance = new Export()

    this.graph.use(this.scroller)
    this.graph.use(this.selection)
    this.graph.use(minimap)
    this.graph.use(this.exportInstance)

    const rect = this.graph.addNode({
      shape: 'rect',
      x: 300,
      y: 300,
      width: 90,
      height: 60,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 2 },
        text: { text: 'rect', fill: 'white' },
      },
      ports: [{}],
    })

    const circle = this.graph.addNode({
      shape: 'circle',
      x: 400,
      y: 400,
      width: 40,
      height: 40,
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 2, stroke: '#4B4A67' },
        text: { text: 'circle', fill: 'white' },
      },
    })

    this.graph.addEdge({
      source: rect,
      target: circle,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.graphContainer = container
  }

  refMinimap = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  onCenterClick = () => {
    this.scroller.center()
  }

  onCenterContentClick = () => {
    this.scroller.centerContent()
  }

  onZoomOutClick = () => {
    this.scroller.zoom(-0.2)
  }

  onZoomInClick = () => {
    this.scroller.zoom(0.2)
  }

  onZoomToFitClick = () => {
    this.scroller.zoomToFit()
  }

  onDownload = () => {
    this.exportInstance.exportPNG('scroller')
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Scroller</h1>
        <div className="x6-graph-tools">
          <Button onClick={this.onCenterClick}>Center</Button>
          <Button onClick={this.onCenterContentClick}>Center Content</Button>
          <Button onClick={this.onZoomOutClick}>Zoom Out</Button>
          <Button onClick={this.onZoomInClick}>Zoom In</Button>
          <Button onClick={this.onZoomToFitClick}>Zoom To Fit</Button>
          <Button onClick={this.onDownload}>Download</Button>
        </div>
        <div
          ref={this.refMinimap}
          style={{
            position: 'absolute',
            right: '50%',
            top: 40,
            marginRight: -720,
            width: 300,
            height: 200,
            boxShadow: '0 0 10px 1px #e9e9e9',
          }}
        />
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
