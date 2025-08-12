import { XFlow, XFlowGraph, Background } from '@antv/xflow'
import React from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-xflow-graph-basic">
      <XFlow>
        <Background color="#F2F7FA" />
        <XFlowGraph />
      </XFlow>
    </div>
  )
}

export default Page
