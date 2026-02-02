import React, { useEffect, useRef } from 'react'
import { Graph, Cell, Shape } from '@antv/x6'
import '../index.less'
import './index.less'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell: Cell) {
    const data = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.innerHTML = data.time
    return div
  },
})

export const HtmlExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
      grid: true,
    })

    const node = graph.addNode({
      shape: 'custom-html',
      x: 80,
      y: 80,
      data: {
        time: Date.now(),
      },
    })

    let timer: number

    const change = () => {
      timer = window.setTimeout(() => {
        node.setData({
          time: Date.now(),
        })
        change()
      }, 1000)
    }

    change()

    graphRef.current = graph

    return () => {
      clearTimeout(timer)
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
