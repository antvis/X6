import {
  XFlow,
  XFlowGraph,
  Background,
  useGraphStore,
  useClipboard,
  useKeyboard,
  Clipboard,
} from '@antv/xflow'
import React, { useEffect, useCallback } from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-hooks-use-key-board">
      <XFlow>
        <Header />
        <XFlowGraph selectOptions={{ showNodeSelectionBox: true }} />
        <Background color="#F2F7FA" />
        <Clipboard />
      </XFlow>
    </div>
  )
}

const Header = () => {
  const { copy, paste } = useClipboard()

  const addNodes = useGraphStore((state) => state.addNodes)
  const addEdges = useGraphStore((state) => state.addEdges)
  const nodes = useGraphStore((state) => state.nodes)

  const setAddNodes = useCallback(() => {
    addNodes([
      {
        id: 'source',
        x: 32,
        y: 32,
        width: 100,
        height: 40,
        label: 'Hello',
        attrs: {
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6,
          },
        },
      },
      {
        id: 'target',
        shape: 'circle',
        x: 160,
        y: 180,
        width: 60,
        height: 60,
        label: 'World',
        attrs: {
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    ])
  }, [addNodes])

  const setAddEdges = useCallback(() => {
    addEdges([
      {
        source: 'source',
        target: 'target',
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      },
    ])
  }, [addEdges])

  const onCopy = () => {
    const selected = nodes.filter((node) => node.selected)
    const ids: string[] = selected.map((node) => node.id || '')
    copy(ids)
  }

  useKeyboard('ctrl+c', () => {
    onCopy()
  })

  useKeyboard('ctrl+v', () => {
    paste()
  })

  useEffect(() => {
    setAddNodes()
    setAddEdges()
  }, [setAddEdges, setAddNodes])

  return null
}

export default Page
