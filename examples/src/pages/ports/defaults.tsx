import React, { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { Graph, Node } from '@antv/x6'
import '../index.less'

export const PortsDefaultsExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<Node | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 400,
      grid: true,
    })

    const rect = graph.addNode({
      shape: 'rect',
      x: 280,
      y: 120,
      width: 100,
      height: 150,
      label: 'Target',
      attrs: {
        rect: { stroke: '#31d0c6', strokeWidth: 2 },
      },
      ports: {
        groups: {
          left: {
            position: 'left',
          },
        },
      },
    })

    rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    const circle = graph.addNode({
      shape: 'circle',
      x: 100,
      y: 165,
      width: 60,
      height: 60,
      attrs: {
        circle: { cx: 8, cy: 8, r: 8 },
        text: { text: 'Source' },
      },
    })

    const ports = rect.getPorts()
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[0].id },
    })
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[1].id },
    })
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[2].id },
    })

    rectRef.current = rect

    return () => {
      graph.dispose()
      rectRef.current = null
    }
  }, [])

  const onAddPort = () => {
    rectRef.current?.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })
  }

  const onRemovePort = () => {
    const ports = rectRef.current?.getPorts()
    if (ports && ports.length) {
      rectRef.current?.removePortAt(ports.length - 1)
    }
  }

  return (
    <div className="x6-graph-wrap">
      <h1>Default Settings</h1>
      <div className="x6-graph-tools">
        <Button.Group>
          <Button onClick={onAddPort}>Add Port</Button>
          <Button onClick={onRemovePort}>Remove Port</Button>
        </Button.Group>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
