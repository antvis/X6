import React from 'react'
import { Button } from 'antd'
import { Graph, NodeView } from '@antv/x6'
import '../index.less'
import './index.less'

class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    return this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body',
    })
  }

  protected renderPorts() {}

  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#31d0c6',
      },
    })
  }
}

export default class Example extends React.Component {
  private graph: Graph
  private graphContainer: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private scroller: any

  componentDidMount() {
    const graph = new Graph({
      container: this.graphContainer,
      width: 800,
      height: 500,
      resizing: true,
      background: {
        color: '#f5f5f5',
      },
      grid: {
        visible: true,
      },
      scroller: {
        enabled: true,
        // width: 600,
        // height: 400,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 300,
        height: 200,
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
      mousewheel: {
        enabled: true,
        // fixed: false,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
      },
    })

    this.scroller = graph.scroller.widget

    const rect = graph.addNode({
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

    rect.on('removed', () => {
      console.log('rect was removed')
    })

    const circle = graph.addNode({
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

    graph.addEdge({
      source: rect,
      target: circle,
    })

    // graph.removeCell(rect)

    // graph.centerContent()
    // graph.resize(300, 200)
    // graph.zoomToFit()
    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.graphContainer = container
  }

  refMinimap = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  onCenterClick = () => {
    this.graph.center()
    // this.graph.center({ padding: { left: 300 } })
    // this.graph.centerPoint(0, 0)
    // this.graph.positionPoint({ x: 0, y: 0 }, 100, 100)
  }

  onCenterContentClick = () => {
    this.graph.centerContent()
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
