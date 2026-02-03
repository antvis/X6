import React, { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { Graph, Keyboard, Selection } from '@antv/x6'
import '../../index.less'

export const KeyboardExample: React.FC = () => {
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

    const selection = new Selection()
    const keyboard = new Keyboard()
    graph.use(selection)
    graph.use(keyboard)

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    keyboard.bindKey('backspace', () => {
      graph.removeCells(selection.getSelectedCells())
    })

    graphRef.current = graph

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  const enablePlugins = () => {
    graphRef.current?.enablePlugins('keyboard')
  }

  const disablePlugins = () => {
    graphRef.current?.disablePlugins('keyboard')
  }

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph" />
      <Button onClick={enablePlugins}>enable</Button>
      <Button onClick={disablePlugins}>disable</Button>
    </div>
  )
}
