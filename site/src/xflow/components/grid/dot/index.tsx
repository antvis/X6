import { XFlow, XFlowGraph, Grid } from '@antv/xflow'
import React from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-grid-dot">
      <XFlow>
        <XFlowGraph zoomable minScale={0.5} />
        <Grid
          type="dot"
          options={{
            color: '#CD0A0A', // 网点颜色
            thickness: 10, // 网点大小
          }}
        />
      </XFlow>
    </div>
  )
}

export default Page
