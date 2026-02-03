import React, { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { Graph, History, Keyboard, Selection } from '@antv/x6'
import '../index.less'

export const HistoryExample: React.FC = () => {
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
    const history = new History({ stackSize: 5 })

    graph.use(selection)
    graph.use(keyboard)
    graph.use(history)

    const a = graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    const b = graph.addNode({
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

    graph.addEdge({ source: a, target: b })

    keyboard.bindKey('backspace', () => {
      graph.removeCells(selection.getSelectedCells())
    })
    keyboard.bindKey(['command+z', 'ctrl+z'], () => {
      const h = graph.getPlugin('history') as History
      h.undo()
    })
    keyboard.bindKey(['command+shift+z', 'ctrl+shift+z'], () => {
      const h = graph.getPlugin('history') as History
      h.redo()
    })

    graphRef.current = graph

    return () => {
      graph.dispose()
      graphRef.current = null
    }
  }, [])

  const enablePlugins = () => {
    graphRef.current?.enablePlugins('history')
  }

  const disablePlugins = () => {
    graphRef.current?.disablePlugins('history')
  }

  const undo = () => {
    const history = graphRef.current?.getPlugin('history') as History
    history?.undo()
  }

  const redo = () => {
    const history = graphRef.current?.getPlugin('history') as History
    history?.redo()
  }

  const removeAll = () => {
    const cells = graphRef.current?.getCells()
    if (cells) {
      graphRef.current?.removeCells(cells)
    }
  }

  const removeOneNode = () => {
    const nodes = graphRef.current?.getNodes()
    if (nodes && nodes.length) {
      graphRef.current?.removeNode(nodes[0])
    }
  }

  const removeOneEdge = () => {
    const edges = graphRef.current?.getEdges()
    if (edges && edges.length) {
      graphRef.current?.removeEdge(edges[0])
    }
  }

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph" />
      <Button onClick={enablePlugins}>enable</Button>
      <Button onClick={disablePlugins}>disable</Button>
      <Button onClick={undo}>undo</Button>
      <Button onClick={redo}>redo</Button>
      <Button onClick={removeAll}>remove all</Button>
      <Button onClick={removeOneNode}>remove node</Button>
      <Button onClick={removeOneEdge}>remove edge</Button>
    </div>
  )
}
