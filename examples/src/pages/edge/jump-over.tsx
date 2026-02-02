import React, { useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

const Example: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 1000,
      height: 600,
    })

    const rect = graph.createNode({
      x: 100,
      y: 50,
      width: 70,
      height: 30,
      attrs: {
        body: { fill: 'lightgray' },
        label: { text: 'rect', magnet: true },
      },
    })

    for (let i = 0; i < 6; i++) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)

      const edge = graph.createEdge({
        source,
        target,
      })

      if (i % 2 === 0) {
        edge.prop('connector', {
          name: 'jumpover',
          args: { type: 'gap' },
        })
        edge.attr('line/stroke', 'red')
      }

      graph.addEdge(edge)
    }

    const crossRectA = rect.clone().position(16, 100)
    graph.addNode(crossRectA)

    const crossRectB = rect.clone().position(16, 200)
    graph.addNode(crossRectB)

    graph.addEdge({
      source: crossRectA,
      target: crossRectB,
      connector: { name: 'jumpover' },
      attrs: {
        line: {
          stroke: 'red',
        },
      },
      vertices: [
        { x: 700, y: 190 },
        { x: 700, y: 280 },
      ],
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

export default Example
