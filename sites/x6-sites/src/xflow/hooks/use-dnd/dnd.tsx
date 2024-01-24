import { useDnd } from '@antv/xflow'

import './index.less'
import React from 'react'
import { Space } from 'antd'

const Dnd = () => {
  const { startDrag } = useDnd()
  const list = ['node1', 'node2', 'node3']

  const handleMouseDown = (
    e: React.MouseEvent<Element, MouseEvent>,
    item: string,
  ) => {
    startDrag(
      {
        id: item,
        shape: 'rect',
        width: 150,
        height: 32,
        attrs: {
          body: {
            stroke: '#D9DADD',
            strokeWidth: 1,
          },
        },
        label: item,
      },
      e,
    )
  }

  return (
    <div className="xflow-hooks-use-dnd-dnd">
      <Space direction="vertical">
        {list.map((item) => (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            key={item}
            className="dnd-item"
            onMouseDown={(e) => handleMouseDown(e, item)}
          >
            {item}
          </div>
        ))}
      </Space>
    </div>
  )
}

export { Dnd }
