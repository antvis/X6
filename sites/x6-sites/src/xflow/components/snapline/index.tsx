import { XFlow, XFlowGraph, Background, Snapline, Transform } from '@antv/xflow'
import React, { useState } from 'react'
import { Setting } from './setting'
import './index.less'

const Page = () => {
  const [options, setOptions] = useState({ tolerance: 10 })

  return (
    <XFlow>
      <span style={{ display: 'flex' }}>
        <div className="xflow-snapline-content-setting">
          <Setting setOptions={setOptions} options={options} />
        </div>
        <div className="xflow-snapline-content-graph">
          <XFlowGraph />
        </div>
      </span>
      <Background color="#F2F7FA" />
      <Snapline {...options} />
      <Transform resizing />
    </XFlow>
  )
}

export default Page
