import React, { useEffect, useState } from 'react'
import ConfigGrid from './ConfigGrid'
import ConfigNode from './ConfigNode'
import ConfigEdge from './ConfigEdge'
import X6Editor from '@/x6Editor'
import { useGridAttr } from '@/models/global'
import styles from './index.less'

export enum CONFIG_TYPE {
  GRID,
  NODE,
  EDGE,
}

export default function () {
  const [type, setType] = useState<CONFIG_TYPE>(CONFIG_TYPE.GRID)
  const [id, setId] = useState('')
  const { gridAttrs, setGridAttr } = useGridAttr()

  useEffect(() => {
    const { graph } = X6Editor.getInstance()
    graph.on('blank:click', () => {
      setType(CONFIG_TYPE.GRID)
    })
    graph.on('cell:click', ({ cell, view }) => {
      setType(cell.isNode() ? CONFIG_TYPE.NODE : CONFIG_TYPE.EDGE)
      setId(cell.id)
      const text = view.container.querySelector('.x6-edit-text') as HTMLElement
      if (cell.isNode() && text) {
        text.focus()
      }
    })
  }, [])

  return (
    <div className={styles.config}>
      <div id="minmapContainer" style={{ marginTop: 16 }} />
      {type === CONFIG_TYPE.GRID && (
        <ConfigGrid attrs={gridAttrs} setAttr={setGridAttr} />
      )}
      {type === CONFIG_TYPE.NODE && <ConfigNode id={id} />}
      {type === CONFIG_TYPE.EDGE && <ConfigEdge id={id} />}
    </div>
  )
}
