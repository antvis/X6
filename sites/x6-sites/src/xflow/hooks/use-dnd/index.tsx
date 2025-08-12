import { XFlow, XFlowGraph, Background } from '@antv/xflow'
import React from 'react'
import { Dnd } from './dnd'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-hooks-use-dnd-page">
      <div className="xflow-hooks-use-dnd-Container">
        <XFlow>
          <Dnd />
          <XFlowGraph pannable />
          <Background color="#F2F7FA" />
        </XFlow>
      </div>
    </div>
  )
}

export default Page
