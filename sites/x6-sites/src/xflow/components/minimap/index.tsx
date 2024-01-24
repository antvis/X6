import {
  XFlow,
  XFlowGraph,
  Background,
  useGraphStore,
  Minimap,
} from '@antv/xflow'
import React, { useEffect, useState, useCallback } from 'react'
import { Segmented } from 'antd'
import './index.less'

const SegmentedHeader = ({ setOptions }) => {
  const initData = useGraphStore((state) => state.initData)
  const setInitData = useCallback(() => {
    initData({
      nodes: [
        {
          id: '1',
          shape: 'rect',
          x: 200,
          y: 100,
          width: 100,
          height: 40,
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
          label: 'move',
        },
      ],
      edges: [],
    })
  }, [initData])

  useEffect(() => {
    setInitData()
  }, [setInitData])

  return (
    <div className="xflow-history-header">
      <Segmented
        options={[
          {
            label: '简单视图',
            value: true,
          },
          {
            label: '详细视图',
            value: false,
          },
        ]}
        onChange={(value) => setOptions((prev) => ({ ...prev, simple: value }))}
      />
    </div>
  )
}

const Page = () => {
  const [options, setOptions] = useState({
    simple: true,
    simpleNodeBackground: 'red',
    width: 200,
    height: 160,
    padding: 10,
  })
  return (
    <XFlow>
      <div style={{ display: 'flex' }}>
        <div className="xflow-minimap-content-setting">
          <SegmentedHeader setOptions={setOptions} />
          <Minimap {...options} />
        </div>
        <div className="xflow-minimap-content-graph">
          <XFlowGraph scroller />
        </div>
      </div>
      <Background color="#F2F7FA" />
    </XFlow>
  )
}

export default Page
