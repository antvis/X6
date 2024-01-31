import { XFlow, XFlowGraph, Background, History } from '@antv/xflow'
import React from 'react'
import { HistoryButton } from './header'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-history">
      <XFlow>
        <HistoryButton />
        <XFlowGraph className="xflow-history-content" />
        <History />
        <Background color="#F2F7FA" />
      </XFlow>
    </div>
  )
}

export default Page
