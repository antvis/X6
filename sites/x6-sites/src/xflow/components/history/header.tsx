import { useGraphStore, useHistory } from '@antv/xflow'
import React, { useEffect, useCallback } from 'react'
import { Button, Space } from 'antd'

export const HistoryButton = () => {
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
