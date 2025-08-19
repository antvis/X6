import { XFlow, XFlowGraph, Background } from '@antv/xflow'
import React from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-background-color">
      <XFlow>
        <XFlowGraph />
        <Background color="#F2F7FA" />
      </XFlow>
    </div>
  )
}

export default Page
