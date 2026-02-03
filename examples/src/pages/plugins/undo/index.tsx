import React, { useEffect, useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { Graph, History } from '@antv/x6'
import '../../index.less'

export const UndoExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<History | null>(null)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
      grid: true,
    })

    const history = new History()
    history.on('change', () => {
      setCanRedo(history.canRedo())
      setCanUndo(history.canUndo())
    })
    graph.use(history)

    const source = graph.addNode({
      x: 120,
      y: 120,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
        },
        body: {
          strokeWidth: 1,
        },
      },
    })

    const target = graph.addNode({
      x: 300,
      y: 320,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
        },
        body: {
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({ source, target, arrts: { line: { strokeWidth: 1 } } })

    historyRef.current = history

    return () => {
      graph.dispose()
      historyRef.current = null
    }
  }, [])

  const onUndo = () => {
    historyRef.current?.undo()
  }

  const onRedo = () => {
    historyRef.current?.redo()
  }

  return (
    <div className="x6-graph-wrap">
      <h1>Default Settings</h1>
      <div className="x6-graph-tools">
        <Space.Compact>
          <Button onClick={onUndo} disabled={!canUndo}>
            Undo
          </Button>
          <Button onClick={onRedo} disabled={!canRedo}>
            Redo
          </Button>
        </Space.Compact>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
