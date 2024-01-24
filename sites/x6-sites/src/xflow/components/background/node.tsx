import { useGraphStore } from '@antv/xflow'
import { useCallback, useEffect } from 'react'

export const InitNode = () => {
  const addNodes = useGraphStore((state) => state.addNodes)
  const addNodeInit = useCallback(() => {
    addNodes([
      {
        id: '1',
        shape: 'rect',
        x: 300,
        y: 150,
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
        label: '节点',
      },
    ])
  }, [addNodes])

  useEffect(() => {
    addNodeInit()
  }, [addNodeInit])

  return null
}
