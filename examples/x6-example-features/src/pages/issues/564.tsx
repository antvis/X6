import React from 'react'
import { Button } from 'antd'
import { Graph, NodeView, DataUri } from '@antv/x6'
import '../index.less'

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
      selecting: {
        enabled: true,
        rubberband: true,
        modifiers: 'shift',
      },
      scroller: {
        enabled: true,
        // width: 600,
        // height: 400,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        autoResize: true,
        // modifiers: 'shift',
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
      x: 40,
      y: 40,
      width: 90,
      height: 60,
    })

    rect.on('removed', () => {
      console.log('rect was removed')
    })

    const circle = graph.addNode({
      shape: 'circle',
      x: 160,
      y: 160,
      width: 40,
      height: 40,
    })

    graph.addEdge({
      source: rect,
      target: circle,
    })

    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.graphContainer = container
  }

  refMinimap = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  onResizeClick = () => {
    this.graph.resizeGraph(200, 150)
  }

  onCenterClick = () => {
    this.graph.center()
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

  onDownload = () => {
    this.graph.toPNG((datauri: string) => {
      DataUri.downloadDataUri(datauri, 'chart.png')
    })
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Scroller</h1>
        <div className="x6-graph-tools">
          <Button onClick={this.onResizeClick}>Resize</Button>
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
