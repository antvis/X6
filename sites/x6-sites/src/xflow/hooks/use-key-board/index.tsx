import { XFlow, XFlowGraph, Background, Clipboard } from '@antv/xflow'
import React from 'react'
import { Header } from './header'

import './index.less'

const Page = () => {
  return (
    <div className="xflow-hooks-use-key-board">
      <XFlow>
        <Header />
        <XFlowGraph selectOptions={{ showNodeSelectionBox: true }} />
        <Background color="#F2F7FA" />
        <Clipboard />
      </XFlow>
    </div>
  )
}

export default Page
