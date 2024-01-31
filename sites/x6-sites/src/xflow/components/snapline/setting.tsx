import { useGraphStore } from '@antv/xflow'
import React, { useEffect, useCallback } from 'react'
import { Card, Row, Col, Slider, Checkbox, Badge } from 'antd'

export const Setting = ({ setOptions, options }) => {
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
        {
          id: '3',
          x: 200,
          y: 100,
          width: 100,
          height: 40,
          label: 'Drag Me',
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

  return (
    <div>
      <Card title="Snapline 配置" bordered={false}>
        <Row align="middle">
          <Col span={6}>Tolerance</Col>
          <Col span={2} offset={1}>
            <Badge count={options.tolerance} showZero color="#faad14" />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={options.tolerance}
              onChange={(value) =>
                setOptions((prev) => ({ ...prev, tolerance: value }))
              }
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, sharp: e.target.checked }))
              }
            >
              Sharp Line
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, resizing: e.target.checked }))
              }
            >
              Snap on Resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  filter: e.target.checked ? ['circle'] : undefined,
                }))
              }
            >
              Add Filter(only circle)
            </Checkbox>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
