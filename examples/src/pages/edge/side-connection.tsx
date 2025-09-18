import React from 'react'
import { Graph, Edge, EdgeView } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container!: HTMLDivElement
  private graph!: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
      mousewheel: true,
    })

    this.graph.addNode({
      id: 'rect1',
      x: 100,
      y: 50,
      width: 100,
      height: 40,
      attrs: {
        body: { fill: 'lightgray' },
        label: { text: 'rect', magnet: true },
      },
    })

    this.graph.addNode({
      id: 'rect2',
      x: 200,
      y: 240,
      width: 100,
      height: 40,
      attrs: {
        body: { fill: 'lightgray' },
        label: { text: 'rect', magnet: true },
      },
    })

    const edge = this.graph.addEdge({
      source: [0, 0],
      target: { cell: 'rect1' },
    })

    this.setupEdge(edge, true)
  }

  getPortCoord() {
    const port = document.getElementById('side-port')!
    const bbox = port.getBoundingClientRect()
    const center = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 }
    return this.graph.clientToLocal(center).toJSON()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  setupEdge(edge: Edge, trigger?: boolean) {
    const updateConnectionPoint = () => {
      edge.setSource(this.getPortCoord())
    }
    this.graph.on('scale', updateConnectionPoint)
    this.graph.on('translate', updateConnectionPoint)

    if (trigger) {
      updateConnectionPoint()
    }
  }

  startConnect = () => {
    const source = this.getPortCoord()
    const target = { ...source }
    const edge = this.graph.addEdge({ source, target })
    const view = this.graph.findView(edge) as EdgeView

    let dragging = false
    let data: any

    const onMouseMove = (e: MouseEvent) => {
      const evt = e as any
      if (!dragging) {
        data = view.prepareArrowheadDragging('target', { ...source })
        view.setEventData(evt, data)
        this.graph.view.undelegateEvents()
        dragging = true
      }

      view.setEventData(evt, data)
      const pos = this.graph.clientToLocal(e.clientX, e.clientY)
      data = view.onMouseMove(evt, pos.x, pos.y)
    }

    const onMouseUp = (e: MouseEvent) => {
      const evt = e as any
      const pos = this.graph.clientToLocal(e.clientX, e.clientY)
      view.setEventData(evt, data)
      view.onMouseUp(evt, pos.x, pos.y)
      data = null
      dragging = false

      this.setupEdge(edge)
      this.graph.view.delegateEvents()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: 840,
          height: 600,
          margin: '32px auto',
          flexDirection: 'row',
        }}
      >
        <div style={{ flex: 1, background: '#f5f5f5', position: 'relative' }}>
          <div
            id="side-port"
            style={{
              position: 'absolute',
              right: 0,
              top: 120,
              zIndex: 9,
              marginRight: -8,
              cursor: 'pointer',
              border: '2px solid #873bf4',
              background: '#fff',
              borderRadius: 16,
              width: 16,
              height: 16,
            }}
            onMouseDown={this.startConnect}
          />
        </div>
        <div className="x6-graph-wrap" style={{ width: 800, padding: 0 }}>
          <div ref={this.refContainer} className="x6-graph" />
        </div>
      </div>
    )
  }
}
