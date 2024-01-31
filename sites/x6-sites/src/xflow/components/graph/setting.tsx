import { useGraphStore } from '@antv/xflow'
import React, { useEffect, useCallback } from 'react'
import { Card, Row, Col, Checkbox } from 'antd'

import { ports } from './ports'

export const Setting = ({ setOptions }) => {
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
          ports: {
            ...ports,
          },
        },
        {
          id: '2',
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
          ports: {
            ...ports,
          },
        },
        {
          id: '3',
          x: 300,
          y: 180,
          width: 100,
          height: 40,
          label: 'Text',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
          ports: {
            ...ports,
          },
        },
      ],
      edges: [
        {
          source: {
            cell: '1',
            port: 'group2',
          },
          target: {
            cell: '2',
            port: 'group1',
          },
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
      <Card title="XFlowGraph 配置" bordered={false}>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, readonly: e.target.checked }))
              }
            >
              readonly
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, zoomable: e.target.checked }))
              }
            >
              zoomable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, pannable: e.target.checked }))
              }
            >
              pannable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, embedable: e.target.checked }))
              }
            >
              embedable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, restrict: e.target.checked }))
              }
            >
              restrict
            </Checkbox>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
