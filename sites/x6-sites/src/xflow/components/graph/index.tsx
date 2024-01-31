import { XFlow, XFlowGraph, Background } from '@antv/xflow'
import React, { useState } from 'react'
import { Setting } from './setting'
import './index.less'

const Page = () => {
  const [options, setOptions] = useState({
    readonly: false,
    zoomable: false,
    embedable: false,
    pannable: false,
    restrict: false,
  })

  return (
    <XFlow>
      <span style={{ display: 'flex' }}>
        <div className="xflow-graph-content-setting">
          <Setting setOptions={setOptions} options={options} />
        </div>
        <div className="xflow-graph-content-graph">
          <XFlowGraph
            readonly={options.readonly}
            zoomable={options.zoomable}
            pannable={options.pannable}
            embedable={options.embedable}
            embedOptions={{
              frontOnly: true,
              findParent: 'bbox',
              validate: () => true,
            }}
            restrict={options.restrict}
            centerView
            fitView
            minScale={0.5}
            maxScale={5}
            connectionOptions={{
              snap: true,
              allowBlank: false,
              allowLoop: false,
              highlight: true,
              connectionPoint: 'anchor',
              anchor: 'center',
            }}
            connectionEdgeOptions={{
              attrs: {
                line: {
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                },
              },
              animated: true,
              zIndex: -1,
            }}
            selectOptions={{
              multiple: true,
              strict: true,
              rubberband: true,
              modifiers: 'shift',
              showNodeSelectionBox: true,
            }}
            magnetAdsorbedHighlightOptions={{
              name: 'stroke',
              args: {
                attrs: {
                  fill: '#5F95FF',
                  stroke: '#5F95FF',
                },
              },
            }}
          />
        </div>
      </span>
      <Background color="#F2F7FA" />
    </XFlow>
  )
}

export default Page
