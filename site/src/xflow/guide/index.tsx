import { XFlow, XFlowGraph, Grid, Background, Snapline } from '@antv/xflow'
import React from 'react'
import { InitNode } from './InitNode'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-guide">
      <XFlow>
        <XFlowGraph zoomable minScale={0.5} />
        <Grid type="dot" />
        <Background color="#F2F7FA" />
        <Snapline sharp />
        <InitNode />
      </XFlow>
    </div>
  )
}

export default Page
