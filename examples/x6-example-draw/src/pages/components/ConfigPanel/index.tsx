import React, { useEffect, useState } from 'react'
import X6Editor, { CONFIG_TYPE } from '@/x6Editor'
import ConfigGrid from './ConfigGrid'
import ConfigNode from './ConfigNode'
import ConfigEdge from './ConfigEdge'

export default function() {
  const [type, setType] = useState<CONFIG_TYPE>(CONFIG_TYPE.GRID)
  useEffect(() => {
    X6Editor.getInstance().on('config.type:change', (type: CONFIG_TYPE) => {
      setType(type)
    })
  }, [])

  return (
    <div>
      {type === CONFIG_TYPE.GRID && <ConfigGrid />}
      {type === CONFIG_TYPE.NODE && <ConfigNode />}
      {type === CONFIG_TYPE.EDGE && <ConfigEdge />}
    </div>
  )
}