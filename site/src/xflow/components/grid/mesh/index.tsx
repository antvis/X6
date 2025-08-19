import { XFlow, XFlowGraph, Grid } from '@antv/xflow'
import React from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-grid-mesh">
      <XFlow>
        <XFlowGraph zoomable minScale={0.5} />
        <Grid
          type="mesh"
          options={{
            color: '#ddd', // 网格线颜色
            thickness: 1, // 网格线宽度
          }}
        />
      </XFlow>
    </div>
  )
}

export default Page
