import { XFlow, XFlowGraph, Background, Clipboard } from '@antv/xflow'
import React, { useState } from 'react'
import { Setting } from './setting'
import './index.less'

const Page = () => {
  const [localStorage, setLocalStorage] = useState(true)

  return (
    <XFlow>
      <span style={{ display: 'flex' }}>
        <div className="xflow-clipboard-content-setting">
          <Setting setLocalStorage={setLocalStorage} value={localStorage} />
        </div>
        <div className="xflow-clipboard-content-graph">
          <XFlowGraph selectOptions={{ showNodeSelectionBox: true }} />
        </div>
      </span>
      <Background color="#F2F7FA" />
      <Clipboard useLocalStorage={localStorage} />
    </XFlow>
  )
}

export default Page
