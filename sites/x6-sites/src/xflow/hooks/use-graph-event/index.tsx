import { XFlow, XFlowGraph, Background } from '@antv/xflow'
import React from 'react'
import { InitNode } from './init-node'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-hooks-use-graph-event">
      <XFlow>
        <XFlowGraph />
        <Background color="#F2F7FA" />
        <InitNode />
      </XFlow>
    </div>
  )
}

export default Page
