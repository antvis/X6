import React, { useEffect, useRef } from 'react'
import { Graph, Edge, EdgeView } from '@antv/x6'
import '../index.less'

const Example: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  const getPortCoord = () => {
    const port = document.getElementById('side-port')!
    const bbox = port.getBoundingClientRect()
    const center = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 }
    return graphRef.current?.clientToLocal(center).toJSON()
  }

  const setupEdge = (edge: Edge, trigger?: boolean) => {
    const updateConnectionPoint = () => {
      const coord = getPortCoord()
      if (coord) {
        edge.setSource(coord)
      }
    }
    graphRef.current?.on('scale', updateConnectionPoint)
    graphRef.current?.on('translate', updateConnectionPoint)

    if (trigger) {
      updateConnectionPoint()
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
      mousewheel: true,
    })

    graphRef.current = graph

    graph.addNode({
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

    graph.addNode({
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

    const edge = graph.addEdge({
      source: [0, 0],
      target: { cell: 'rect1' },
    })

    setupEdge(edge, true)

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  const startConnect = () => {
    if (!graphRef.current) return

    const source = getPortCoord()
    if (!source) return

    const target = { ...source }
    const edge = graphRef.current.addEdge({ source, target })
    const view = graphRef.current.findView(edge) as EdgeView

    let dragging = false
    let data: any

    const onMouseMove = (e: MouseEvent) => {
      const evt = e as any
      if (!dragging) {
        data = view.prepareArrowheadDragging('target', { ...source })
        view.setEventData(evt, data)
        graphRef.current?.view.undelegateEvents()
        dragging = true
      }

      view.setEventData(evt, data)
      const pos = graphRef.current?.clientToLocal(e.clientX, e.clientY)
      if (pos) {
        data = view.onMouseMove(evt, pos.x, pos.y)
      }
    }

    const onMouseUp = (e: MouseEvent) => {
      const evt = e as any
      const pos = graphRef.current?.clientToLocal(e.clientX, e.clientY)
      if (pos) {
        view.setEventData(evt, data)
        view.onMouseUp(evt, pos.x, pos.y)
      }
      data = null
      dragging = false

      setupEdge(edge)
      graphRef.current?.view.delegateEvents()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

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
          onMouseDown={startConnect}
        />
      </div>
      <div className="x6-graph-wrap" style={{ width: 800, padding: 0 }}>
        <div ref={containerRef} className="x6-graph" />
      </div>
    </div>
  )
}

export default Example
