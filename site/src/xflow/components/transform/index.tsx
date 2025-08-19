import { XFlow, XFlowGraph, Background, Transform } from '@antv/xflow'
import React, { useState } from 'react'
import { Setting } from './setting'
import './index.less'

const Page = () => {
  const [options, setOptions] = useState({})

  return (
    <XFlow>
      <span style={{ display: 'flex' }}>
        <div className="xflow-transform-content-setting">
          <Setting setOptions={setOptions} options={options} />
        </div>
        <div className="xflow-transform-content-graph">
          <XFlowGraph />
        </div>
      </span>
      <Background color="#F2F7FA" />
      <Transform {...options} />
    </XFlow>
  )
}

export default Page
