import React, { useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

Graph.registerNode(
  'custom-rect',
  {
    inherit: 'rect',
    width: 200,
    height: 40,
    attrs: {
      body: {
        rx: 10, // 圆角矩形
        ry: 10,
        strokeWidth: 1,
        stroke: '#5755a1',
        fill: '#5755a1',
      },
      label: {
        textAnchor: 'left',
        refX: 20,
        fill: '#fff',
        fontSize: 18,
      },
    },
  },
  true,
)

export const CustomNodeExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
      grid: true,
    })

    graph.addNode({
      x: 100,
      y: 60,
      shape: 'custom-rect',
      label: 'Custom Rect',
    })

    return () => {
      graph.dispose()
    }
  }, [])

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
