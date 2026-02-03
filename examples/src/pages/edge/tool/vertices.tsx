import React, { useEffect, useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { Graph, History, Selection } from '@antv/x6'
import '../../index.less'

export const VerticesExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const historyRef = useRef<History | null>(null)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 1000,
      height: 500,
      grid: true,
    })

    const history = new History({
      beforeAddCommand(event, args) {
        if (args && 'options' in args && args.options) {
          return args.options.ignore !== true
        }
      },
    })

    history.on('change', () => {
      setCanRedo(history.canRedo())
      setCanUndo(history.canUndo())
    })

    graph.use(history).use(new Selection())

    const source = graph.addNode(
      {
        x: 120,
        y: 120,
        width: 100,
        height: 40,
        zIndex: 10,
        attrs: {
          label: {
            text: 'Source',
          },
          body: {
            strokeWidth: 1,
          },
        },
      },
      { ignore: true },
    )

    const target = graph.addNode(
      {
        x: 300,
        y: 320,
        width: 100,
        height: 40,
        zIndex: 10,
        attrs: {
          label: {
            text: 'Target',
          },
          body: {
            strokeWidth: 1,
          },
        },
      },
      { ignore: true },
    )

    graph.addEdge(
      {
        source,
        target,
        arrts: {
          line: {
            strokeWidth: 1,
          },
        },
        vertices: [
          {
            x: 220,
            y: 220,
          },
          {
            x: 120,
            y: 320,
          },
          {
            x: 300,
            y: 400,
          },
        ],
      },
      { ignore: true },
    )

    graph.on('edge:click', ({ cell }) => {
      if (!cell.hasTool('vertices')) {
        cell.addTools({
          name: 'vertices',
          args: {
            stopPropagation: false,
            addable: true,
            removeable: true,
            removeRedundancies: false,
            snapRadius: 10,
            attrs: {
              r: 5,
            },
          },
        })
      }
    })

    graph.on('edge:unselected', ({ cell }) => {
      cell.removeTools()
    })

    graph.on('edge:mouseup', ({ cell }) => {
      console.log('edge:mouseup', cell)
    })

    graphRef.current = graph
    historyRef.current = history

    return () => {
      graph.dispose()
      graphRef.current = null
      historyRef.current = null
    }
  }, [])

  const onUndo = () => {
    historyRef.current?.undo()
  }

  const onRedo = () => {
    historyRef.current?.redo()
  }

  const cleanHistory = () => {
    historyRef.current?.clean()
  }

  return (
    <div className="x6-graph-wrap">
      <h1>Edge Vertices & History</h1>
      <div className="x6-graph-tools">
        <Space.Compact>
          <Button onClick={onUndo} disabled={!canUndo}>
            Undo
          </Button>
          <Button onClick={onRedo} disabled={!canRedo}>
            Redo
          </Button>
          <Button type="primary" onClick={cleanHistory}>
            清空历史队列
          </Button>
        </Space.Compact>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
