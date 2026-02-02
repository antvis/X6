import React, { useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'

export const SegmentsExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'rect',
      position: { x: 60, y: 40 },
      size: { width: 100, height: 60 },
    })

    const target = graph.addNode({
      shape: 'rect',
      position: { x: 650, y: 450 },
      size: { width: 100, height: 60 },
    })

    graph.addEdge({
      source,
      target,
      router: 'orth',
      tools: [
        {
          name: 'segments',
        },
      ],
      attrs: {
        connection: {
          stroke: '#333333',
          strokeWidth: 3,
        },
      },
    })

    graphRef.current = graph

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
