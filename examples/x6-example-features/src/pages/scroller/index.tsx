import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import '../index.less'
import './index.less'
import '../../../../../packages/x6/src/addon/scroller/index.less'
import '../../../../../packages/x6/src/addon/minimap/index.less'

export default class Example extends React.Component {
  private graphContainer: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private scroller: any

  componentDidMount() {
    const graph = new Graph({
      container: this.graphContainer,
      width: 800,
      height: 800,
      grid: {
        visible: true,
      },
      scroller: {
        enabled: true,
        width: 600,
        height: 400,
        pageVisible: true,
        pageBreak: false,
        panning: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 300,
        height: 200,
        padding: 10,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    this.scroller = graph.scroller.widget

    const rect = graph.addNode({
      type: 'rect',
      x: 300,
      y: 300,
      width: 90,
      height: 60,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 2 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const circle = graph.addNode({
      type: 'circle',
      x: 400,
      y: 400,
      width: 90,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 2, stroke: '#4B4A67' },
        text: { text: 'circle', fill: 'white' },
      },
    })

    graph.addEdge({
      type: 'edge',
      source: rect,
      target: circle,
    })

    this.scroller.center()
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
