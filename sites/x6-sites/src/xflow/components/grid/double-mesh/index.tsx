import { XFlow, XFlowGraph, Grid } from '@antv/xflow'
import React from 'react'
import './index.less'

const Page = () => {
  return (
    <div className="xflow-grid-double-mesh">
      <XFlow>
        <XFlowGraph zoomable minScale={0.5} />
        <Grid
          type="doubleMesh"
          options={[
            {
              color: '#096D1D', // 主网格线颜色
              thickness: 1, // 主网格线宽度
            },
            {
              color: '#6D0969', // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4, // 主次网格线间隔
            },
          ]}
        />
      </XFlow>
    </div>
  )
}

export default Page
