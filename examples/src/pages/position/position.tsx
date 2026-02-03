import React, { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { Graph, Scroller } from '@antv/x6'
import '../index.less'

export const PositionExample: React.FC = () => {
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)
  const graphRef1 = useRef<Graph | null>(null)
  const graphRef2 = useRef<Graph | null>(null)
  const scrollerRef = useRef<Scroller | null>(null)

  useEffect(() => {
    if (!containerRef1.current || !containerRef2.current) return

    const graph1 = new Graph({
      container: containerRef1.current,
      width: 600,
      height: 400,
      grid: true,
    })

    const graph2 = new Graph({
      container: containerRef2.current,
      width: 600,
      height: 400,
      grid: true,
    })

    const scroller = new Scroller()
    graph2.use(scroller)

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

    graph1.fromJSON(data)
    graph2.fromJSON(data)

    graphRef1.current = graph1
    graphRef2.current = graph2
    scrollerRef.current = scroller

    return () => {
      graph1.dispose()
      graph2.dispose()
      graphRef1.current = null
      graphRef2.current = null
      scrollerRef.current = null
    }
  }, [])

  const onZoom = (factor: number, options?: any) => {
    graphRef1.current?.zoom(factor, options)
    scrollerRef.current?.zoom(factor, options)
  }

  const onZoomTo = (factor: number, options?: any) => {
    graphRef1.current?.zoomTo(factor, options)
    scrollerRef.current?.zoomTo(factor, options)
  }

  const onZoomToRect = () => {
    const rect = {
      x: 120,
      y: 60,
      width: 300,
      height: 150,
    }
    graphRef1.current?.zoomToRect(rect)
    scrollerRef.current?.zoomToRect(rect)
  }

  const onZoomToFit = () => {
    graphRef1.current?.zoomToFit()
    scrollerRef.current?.zoomToFit()
  }

  const onCenterPoint = () => {
    graphRef1.current?.centerPoint(100, 50)
    scrollerRef.current?.centerPoint(100, 50)
  }

  const onCenter = () => {
    graphRef1.current?.center()
    scrollerRef.current?.center()
  }

  const onCenterContent = () => {
    graphRef1.current?.centerContent()
    scrollerRef.current?.centerContent()
  }

  const onCenterCell = () => {
    const cell1 = graphRef1.current?.getCellById('1')
    const cell2 = graphRef2.current?.getCellById('1')
    if (cell1) graphRef1.current?.centerCell(cell1)
    if (cell2) scrollerRef.current?.centerCell(cell2)
  }

  const onPositionPoint = () => {
    graphRef1.current?.positionPoint({ x: 50, y: 60 }, 100, 100)
    scrollerRef.current?.positionPoint({ x: 50, y: 60 }, 100, 100)
  }

  const onPositionRect = () => {
    const r = {
      x: 0,
      y: 0,
      width: 160,
      height: 60,
    }
    graphRef1.current?.positionRect(r, 'top')
    scrollerRef.current?.positionRect(r, 'top')
  }

  const onPositionContent = () => {
    graphRef1.current?.positionContent('center')
    scrollerRef.current?.positionContent('center')
  }

  const onPositionCell = () => {
    const cell1 = graphRef1.current?.getCellById('1')
    const cell2 = graphRef2.current?.getCellById('1')
    if (cell1) graphRef1.current?.positionCell(cell1, 'center')
    if (cell2) scrollerRef.current?.positionCell(cell2, 'center')
  }

  return (
    <div>
      <div className="x6-graph-wrap" style={{ display: 'flex' }}>
        <div ref={containerRef1} className="x6-graph" />
        <div ref={containerRef2} className="x6-graph" />
      </div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'wrap',
          flexShrink: 0,
          padding: '24px 48px',
        }}
      >
        <Button onClick={() => onZoom(0.1)}>ZoomIn</Button>
        <Button onClick={() => onZoom(-0.1)}>ZoomOut</Button>
        <Button onClick={() => onZoom(0.1, { center: { x: 300, y: 200 } })}>
          ZoomIn At [300, 200]
        </Button>
        <Button onClick={() => onZoom(-0.1, { center: { x: 300, y: 200 } })}>
          ZoomOut At [300, 200]
        </Button>
        <Button onClick={() => onZoomTo(1.5)}>ZoomTo</Button>
        <Button onClick={() => onZoomTo(1.5, { center: { x: 200, y: 100 } })}>
          ZoomTo At [200, 100]
        </Button>
        <Button onClick={() => onZoomToRect()}>ZoomToRect</Button>
        <Button onClick={() => onZoomToFit()}>ZoomToFit</Button>
        <Button onClick={() => onCenterPoint()}>CenterPoint</Button>
        <Button onClick={() => onCenter()}>Center</Button>
        <Button onClick={() => onCenterContent()}>CenterContent</Button>
        <Button onClick={() => onCenterCell()}>CenterCell</Button>
        <Button onClick={() => onPositionPoint()}>PositionPoint</Button>
        <Button onClick={() => onPositionRect()}>PositionRect</Button>
        <Button onClick={() => onPositionContent()}>PositionContent</Button>
        <Button onClick={() => onPositionCell()}>PositionCell</Button>
      </div>
    </div>
  )
}
