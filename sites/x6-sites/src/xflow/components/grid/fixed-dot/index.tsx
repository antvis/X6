import { XFlow, XFlowGraph, Grid } from '@antv/xflow'
import React from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-grid-fixed-dot">
      <XFlow>
        <XFlowGraph zoomable minScale={0.5} />
        <Grid
          type="fixedDot"
          options={{
            color: '#ccc', // 网点颜色
            thickness: 10, // 网点大小
          }}
        />
      </XFlow>
    </div>
  )
}

export default Page
