import React from 'react'
import { useGraphStore } from '@antv/xflow'
import { Button, Space } from 'antd'

import './index.less'

export const ToolsButton = () => {
  const addNodes = useGraphStore((state) => state.addNodes)
  const removeNodes = useGraphStore((state) => state.removeNodes)

  const onAddNodes = () => {
    addNodes([
      {
        id: '3',
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
        label: 'added',
      },
    ])
  }

  const onRemoveNodes = () => {
    removeNodes(['3'])
  }

  return (
    <div className="xflow-hooks-use-graph-store-header">
      <Space>
        <Button onClick={onAddNodes}>addNode</Button>
        <Button onClick={onRemoveNodes}>removeNode</Button>
      </Space>
    </div>
  )
}
