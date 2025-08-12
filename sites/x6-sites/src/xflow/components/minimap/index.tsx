import { XFlow, XFlowGraph, Background, Minimap } from '@antv/xflow'
import React, { useState } from 'react'
import { SegmentedHeader } from './header'

import './index.less'

const Page = () => {
  const [options, setOptions] = useState({
    simple: true,
    simpleNodeBackground: 'red',
    width: 200,
    height: 160,
    padding: 10,
  })
  return (
    <XFlow>
      <div style={{ display: 'flex' }}>
        <div className="xflow-minimap-content-setting">
          <SegmentedHeader setOptions={setOptions} />
          <Minimap {...options} />
        </div>
        <div className="xflow-minimap-content-graph">
          <XFlowGraph scroller />
        </div>
      </div>
      <Background color="#F2F7FA" />
    </XFlow>
  )
}

export default Page
