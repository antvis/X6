import { XFlow, XFlowGraph, Background, Control } from '@antv/xflow'
import React, { useState } from 'react'
import { Setting } from './setting'
import './index.less'

const Page = () => {
  const [options, setOptions] = useState({
    direction: 'horizontal' as const,
    placement: 'top' as const,
    items: ['zoomOut', 'zoomTo', 'zoomIn', 'zoomToFit', 'zoomToOrigin'] as (
      | 'zoomOut'
      | 'zoomTo'
      | 'zoomIn'
      | 'zoomToFit'
      | 'zoomToOrigin'
    )[],
  })

  return (
    <XFlow>
      <div style={{ height: 420, position: 'relative' }}>
        <span style={{ display: 'flex' }}>
          <div className="xflow-control-content-setting">
            <Setting setOptions={setOptions} />
          </div>
          <div className="xflow-control-content-graph">
            <XFlowGraph />
          </div>
        </span>
        <Background color="#F2F7FA" />
        <div style={{ position: 'absolute', right: 24, bottom: 24 }}>
          <Control
            items={options.items}
            direction={options.direction}
            placement={options.placement}
          />
        </div>
      </div>
    </XFlow>
  )
}

export default Page
