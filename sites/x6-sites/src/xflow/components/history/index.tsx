import {
  XFlow,
  XFlowGraph,
  Background,
  useGraphStore,
  useHistory,
  History,
} from '@antv/xflow'
import React, { useEffect, useCallback } from 'react'
import { Button, Space } from 'antd'
import './index.less'

const HistoryButton = () => {
  const { undo, redo, canUndo, canRedo } = useHistory()
  const initData = useGraphStore((state) => state.initData)

  const setInitData = useCallback(() => {
    initData({
      nodes: [
        {
          id: '1',
          shape: 'rect',
          x: 200,
          y: 100,
          width: 100,
          height: 40,
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
          label: 'move',
        },
      ],
      edges: [],
    })
  }, [initData])

  useEffect(() => {
    setInitData()
  }, [setInitData])

  return (
    <div className="xflow-history-header">
      <Space>
        <Button onClick={undo} disabled={!canUndo}>
          undo
        </Button>
        <Button onClick={redo} disabled={!canRedo}>
          redo
        </Button>
      </Space>
    </div>
  )
}

const Page = () => {
  return (
    <div className="xflow-history">
      <XFlow>
        <HistoryButton />
        <XFlowGraph className="xflow-history-content" />
        <History />
        <Background color="#F2F7FA" />
      </XFlow>
    </div>
  )
}

export default Page
