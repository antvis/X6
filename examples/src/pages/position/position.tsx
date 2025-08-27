import React from 'react'
import { Button } from 'antd'
import { Graph, Scroller } from '../../../../src'
import '../index.less'

export default class Example extends React.Component {
  private container1: HTMLDivElement
  private container2: HTMLDivElement

  private graph1: Graph
  private graph2: Graph
  private scroller: Scroller
  componentDidMount() {
    this.graph1 = new Graph({
      container: this.container1,
      width: 600,
      height: 400,
      grid: true,
    })

    this.graph2 = new Graph({
      container: this.container2,
      width: 600,
      height: 400,
      grid: true,
    })

    this.scroller = new Scroller()
    this.graph2.use(this.scroller)

    const data = [
      {
        id: '1',
        shape: 'rect',
        x: 0,
        y: 0,
        width: 160,
        height: 60,
        label: '1',
        attrs: {
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
          },
        },
      },
      {
        id: '2',
        shape: 'rect',
        x: 440,
        y: 0,
        width: 160,
        height: 60,
        label: '2',
        attrs: {
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
          },
        },
      },
      {
        id: '3',
        shape: 'rect',
        x: 440,
        y: 340,
        width: 160,
        height: 60,
        label: '3',
        attrs: {
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
          },
        },
      },
      {
        id: '4',
        shape: 'rect',
        x: 0,
        y: 340,
        width: 160,
        height: 60,
        label: '4',
        attrs: {
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
          },
        },
      },
      {
        id: '5',
        shape: 'rect',
        x: 220,
        y: 170,
        width: 160,
        height: 60,
        label: '5',
        attrs: {
          body: {
            stroke: '#ffa940',
            fill: '#ffd591',
          },
        },
        zIndex: 2,
      },
      {
        id: '6',
        shape: 'rect',
        x: 120,
        y: 60,
        width: 300,
        height: 150,
        label: '6',
        attrs: {
          body: {
            stroke: '#ffa940',
            fill: '#ffd591',
          },
        },
      },
    ]

    this.graph1.fromJSON(data)
    this.graph2.fromJSON(data)
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.container1 = container
  }
  refContainer2 = (container: HTMLDivElement) => {
    this.container2 = container
  }

  onZoom = (factor: number, options?: any) => {
    this.graph1.zoom(factor, options)
    this.scroller.zoom(factor, options)
  }

  onZoomTo = (factor: number, options?: any) => {
    this.graph1.zoomTo(factor, options)
    this.scroller.zoomTo(factor, options)
  }

  onZoomToRect = () => {
    this.graph1.zoomToRect({
      x: 120,
      y: 60,
      width: 300,
      height: 150,
    })
    this.scroller.zoomToRect({
      x: 120,
      y: 60,
      width: 300,
      height: 150,
    })
  }

  onZoomToFit = () => {
    this.graph1.zoomToFit()
    this.scroller.zoomToFit()
  }

  onCenterPoint = () => {
    this.graph1.centerPoint(100, 50)
    this.scroller.centerPoint(100, 50)
  }

  onCenter = () => {
    this.graph1.center()
    this.scroller.center()
  }

  onCenterContent = () => {
    this.graph1.centerContent()
    this.scroller.centerContent()
  }

  onCenterCell = () => {
    const cell1 = this.graph1.getCellById('1')
    const cell2 = this.graph2.getCellById('1')
    this.graph1.centerCell(cell1)
    this.scroller.centerCell(cell2)
  }

  onPositionPoint = () => {
    this.graph1.positionPoint({ x: 50, y: 60 }, 100, 100)
    this.scroller.positionPoint({ x: 50, y: 60 }, 100, 100)
  }

  onPositionRect = () => {
    const r = {
      x: 0,
      y: 0,
      width: 160,
      height: 60,
    }
    this.graph1.positionRect(r, 'top')
    this.scroller.positionRect(r, 'top')
  }

  onPositionContent = () => {
    this.graph1.positionContent('center')
    this.scroller.positionContent('center')
  }

  onPositionCell = () => {
    const cell1 = this.graph1.getCellById('1')
    const cell2 = this.graph2.getCellById('1')
    this.graph1.positionCell(cell1, 'center')
    this.scroller.positionCell(cell2, 'center')
  }

  render() {
    return (
      <div>
        <div className="x6-graph-wrap" style={{ display: 'flex' }}>
          <div ref={this.refContainer1} className="x6-graph" />
          <div ref={this.refContainer2} className="x6-graph" />
        </div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'wrap',
            flexShrink: 0,
            padding: '24px 48px',
          }}
        >
          <Button onClick={() => this.onZoom(0.1)}>ZoomIn</Button>
          <Button onClick={() => this.onZoom(-0.1)}>ZoomOut</Button>
          <Button
            onClick={() => this.onZoom(0.1, { center: { x: 300, y: 200 } })}
          >
            ZoomIn At [300, 200]
          </Button>
          <Button
            onClick={() => this.onZoom(-0.1, { center: { x: 300, y: 200 } })}
          >
            ZoomOut At [300, 200]
          </Button>
          <Button onClick={() => this.onZoomTo(1.5)}>ZoomTo</Button>
          <Button
            onClick={() => this.onZoomTo(1.5, { center: { x: 200, y: 100 } })}
          >
            ZoomTo At [200, 100]
          </Button>
          <Button onClick={() => this.onZoomToRect()}>ZoomToRect</Button>
          <Button onClick={() => this.onZoomToFit()}>ZoomToFit</Button>
          <Button onClick={() => this.onCenterPoint()}>CenterPoint</Button>
          <Button onClick={() => this.onCenter()}>Center</Button>
          <Button onClick={() => this.onCenterContent()}>CenterContent</Button>
          <Button onClick={() => this.onCenterCell()}>CenterCell</Button>
          <Button onClick={() => this.onPositionPoint()}>PositionPoint</Button>
          <Button onClick={() => this.onPositionRect()}>PositionRect</Button>
          <Button onClick={() => this.onPositionContent()}>
            PositionContent
          </Button>
          <Button onClick={() => this.onPositionCell()}>PositionCell</Button>
        </div>
      </div>
    )
  }
}
