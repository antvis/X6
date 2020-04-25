import React from 'react'
import { Button } from 'antd'
import { joint } from '@antv/x6'
import { Scroller } from '@antv/x6/es/research/addon/scroller'
import { MiniMap } from '@antv/x6/es/research/addon/minimap'
import '../../index.less'
import '../index.less'
import './index.less'
import '../../../../../../packages/x6/src/research/addon/scroller/index.less'
import '../../../../../../packages/x6/src/research/addon/minimap/index.less'

export default class Example extends React.Component {
  private graphContainer: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private scroller: Scroller

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.graphContainer,
      width: 800,
      height: 800,
      gridSize: 1,
    })

    const parentElem = this.graphContainer.parentElement!

    const scroller = (this.scroller = new Scroller({
      graph,
      autoResizePaper: true,
      padding: 50,
      cursor: 'grab',
    }))

    graph.on('blank:mousedown', ({ e }) => scroller.startPanning(e))

    scroller.$container.css({
      width: 400,
      height: 300,
    })

    parentElem.appendChild(scroller.container)

    graph.addNode({
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

    graph.addNode({
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

    scroller.center()

    new MiniMap({
      scroller,
      container: this.minimapContainer,
      width: 300,
      height: 200,
      padding: 10,
      zoom: { max: 2, min: 0.2 },
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
    this.scroller.zoom(-0.2, { min: 0.2 })
  }

  onZoomInClick = () => {
    this.scroller.zoom(0.2, { max: 2 })
  }

  onZoomToFitClick = () => {
    this.scroller.zoomToFit({
      minScale: 0.2,
      maxScale: 2,
    })
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
            marginRight: -540,
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
