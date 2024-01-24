import { useGraphStore } from '@antv/xflow'
import { useEffect, useCallback } from 'react'

export const InitNode = () => {
  const initData = useGraphStore((state) => state.initData)

  const setInitData = useCallback(() => {
    initData({
      nodes: [
        {
          id: '1',
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
          id: '2',
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
        {
          id: '3',
          x: 200,
          y: 100,
          width: 100,
          height: 40,
          label: 'Drag Me',
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
      ],
      edges: [
        {
          source: '1',
          target: '2',
          attrs: {
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    })
  }, [initData])

  useEffect(() => {
    setInitData()
  }, [setInitData])

  return null
}
