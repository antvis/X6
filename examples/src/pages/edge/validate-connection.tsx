import React, { useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

const ValidateConnectionExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 400,
      grid: true,
      connecting: {
        allowNode: false,
        allowEdge: true,
        allowLoop: false,
        allowBlank: false,
        allowMulti: 'withPort',
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
      width: 120,
      height: 64,
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addNode({
      x: 160,
      y: 240,
      width: 120,
      height: 64,
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addEdge({
      source: [360, 80],
      target: [560, 200],
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

export default ValidateConnectionExample
