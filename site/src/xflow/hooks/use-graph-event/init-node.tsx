import { useGraphStore, useGraphEvent } from '@antv/xflow'
import { useCallback, useEffect } from 'react'

export const InitNode = () => {
  const addNodes = useGraphStore((state) => state.addNodes)
  const updateNode = useGraphStore((state) => state.updateNode)

  useGraphEvent('node:click', ({ node }) => {
    const { id } = node
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    const fillColor = `#${randomColor}`
    updateNode(id, {
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: fillColor,
          rx: 6,
          ry: 6,
        },
      },
    })
  })

  const addNodeInit = useCallback(() => {
    addNodes([
      {
        id: '3',
        shape: 'rect',
        x: 200,
        y: 200,
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
  }, [addNodes])

  useEffect(() => {
    addNodeInit()
  }, [addNodeInit])

  return null
}
