import { Export, Graph, MiniMap, Scroller, Selection } from '@antv/x6'
import { Button } from 'antd'
import React, { useEffect, useRef } from 'react'
import '../../index.less'
import './index.less'

export const ScrollerExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const minimapContainerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const scrollerRef = useRef<Scroller | null>(null)
  const exportRef = useRef<Export | null>(null)

  useEffect(() => {
    if (!containerRef.current || !minimapContainerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 500,
      background: {
        color: '#f5f5f5',
      },
      grid: {
        visible: true,
      },
      panning: false,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
      },
    })

    const scroller = new Scroller({
      pageVisible: true,
      pageBreak: true,
      pannable: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown'],
      },
    })
    const selection = new Selection({
      rubberband: true,
      modifiers: 'shift',
    })
    const minimap = new MiniMap({
      container: minimapContainerRef.current,
      width: 300,
      height: 200,
      padding: 10,
    })
    const exportInstance = new Export()

    graph.use(scroller)
    graph.use(selection)
    graph.use(minimap)
    graph.use(exportInstance)

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

    graphRef.current = graph
    scrollerRef.current = scroller
    exportRef.current = exportInstance

    return () => {
      graph.dispose()
      graphRef.current = null
      scrollerRef.current = null
      exportRef.current = null
    }
  }, [])

  const onCenterClick = () => {
    scrollerRef.current?.center()
  }

  const onCenterContentClick = () => {
    scrollerRef.current?.centerContent()
  }

  const onZoomOutClick = () => {
    scrollerRef.current?.zoom(-0.2)
  }

  const onZoomInClick = () => {
    scrollerRef.current?.zoom(0.2)
  }

  const onZoomToFitClick = () => {
    scrollerRef.current?.zoomToFit()
  }

  const onDownload = () => {
    exportRef.current?.exportPNG('scroller')
  }

  return (
    <div className="x6-graph-wrap">
      <h1>Scroller</h1>
      <div className="x6-graph-tools">
        <Button onClick={onCenterClick}>Center</Button>
        <Button onClick={onCenterContentClick}>Center Content</Button>
        <Button onClick={onZoomOutClick}>Zoom Out</Button>
        <Button onClick={onZoomInClick}>Zoom In</Button>
        <Button onClick={onZoomToFitClick}>Zoom To Fit</Button>
        <Button onClick={onDownload}>Download</Button>
      </div>
      <div
        ref={minimapContainerRef}
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
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
