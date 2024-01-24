import {
  XFlow,
  XFlowGraph,
  Background,
  useGraphStore,
  Control,
} from '@antv/xflow'
import React, { useEffect, useState, useCallback } from 'react'
import { Card, Row, Col, Segmented, Select } from 'antd'
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

const Setting = ({ setOptions }) => {
  const initData = useGraphStore((state) => state.initData)

  const setInitData = useCallback(() => {
    initData({
      nodes: [
        {
          id: '1',
          x: 32,
          y: 32,
          width: 100,
          height: 40,
          label: 'Hello',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
        {
          id: '2',
          shape: 'circle',
          x: 160,
          y: 180,
          width: 60,
          height: 60,
          label: 'World',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      ],
      edges: [
        {
          source: '1',
          target: '2',
          attrs: {
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    })
  }, [initData])

  useEffect(() => {
    setInitData()
  }, [setInitData])

  const controlItems = [
    'zoomOut',
    'zoomTo',
    'zoomIn',
    'zoomToFit',
    'zoomToOrigin',
  ]
  const selectOptions = controlItems.map((item) => ({
    label: item,
    value: item,
  }))

  return (
    <div>
      <Card title="Control 配置" bordered={false}>
        <Row align="middle">
          <Col span={20}>
            <Segmented
              options={[
                {
                  label: '水平展示',
                  value: 'horizontal',
                },
                {
                  label: '垂直展示',
                  value: 'vertical',
                },
              ]}
              block
              onChange={(value) =>
                setOptions((prev) => ({ ...prev, direction: value }))
              }
            />
          </Col>
        </Row>
        <Row align="middle">Tooltip</Row>
        <Row align="middle">
          <Col span={24}>
            <Segmented
              options={['top', 'right', 'left', 'bottom']}
              onChange={(value) =>
                setOptions((prev) => ({ ...prev, placement: value }))
              }
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>Options </Col>
          <Col span={14}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              defaultValue={[
                'zoomOut',
                'zoomTo',
                'zoomIn',
                'zoomToFit',
                'zoomToOrigin',
              ]}
              placeholder="Please select"
              onChange={(value) =>
                setOptions((prev) => ({ ...prev, items: value }))
              }
              options={selectOptions}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}
