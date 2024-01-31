import { XFlow, XFlowGraph, Background } from '@antv/xflow'
import React from 'react'
import { ToolsButton } from './tools-button'

import './index.less'

const Page = () => {
  return (
    <div className="xflow-hooks-use-graph-store">
      <XFlow>
        <ToolsButton />
        <div className="xflow-hooks-use-graph-store-content">
          <XFlowGraph />
          <Background color="#F2F7FA" />
        </div>
      </XFlow>
    </div>
  )
}

export default Page
