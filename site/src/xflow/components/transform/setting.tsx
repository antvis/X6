import React, { useEffect, useCallback } from 'react'
import { useGraphStore } from '@antv/xflow'
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
      <Card title="Transform 配置" bordered={false}>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  resizing: { ...prev.resizing, enabled: e.target.checked },
                }))
              }
            >
              resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minWidth </Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={options?.resizing?.minWidth || 1}
              onChange={(value) =>
                setOptions((prev) => ({
                  ...prev,
                  resizing: { ...prev.resizing, minWidth: value },
                }))
              }
            />
          </Col>
          <Col span={2}>
            <Badge
              overflowCount={999}
              count={options?.resizing?.minWidth || 1}
              showZero
              color="#faad14"
            />
          </Col>
        </Row>

        <Row align="middle">
          <Col span={6}>maxWidth </Col>
          <Col span={14}>
            <Slider
              min={100}
              max={200}
              step={1}
              value={options?.resizing?.maxWidth || 1}
              onChange={(value) =>
                setOptions((prev) => ({
                  ...prev,
                  resizing: { ...prev.resizing, maxWidth: value },
                }))
              }
            />
          </Col>
          <Col span={2}>
            <Badge
              overflowCount={999}
              count={options?.resizing?.maxWidth || 100}
              showZero
              color="#faad14"
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minHeight </Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={options?.resizing?.minHeight || 1}
              onChange={(value) =>
                setOptions((prev) => ({
                  ...prev,
                  resizing: { ...prev.resizing, minHeight: value },
                }))
              }
            />
          </Col>
          <Col span={2}>
            <Badge
              overflowCount={999}
              count={options?.resizing?.minHeight || 1}
              showZero
              color="#faad14"
            />
          </Col>
        </Row>

        <Row align="middle">
          <Col span={6}>maxHeight </Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={options?.resizing?.maxHeight || 1}
              onChange={(value) =>
                setOptions((prev) => ({
                  ...prev,
                  resizing: { ...prev.resizing, maxHeight: value },
                }))
              }
            />
          </Col>
          <Col span={2}>
            <Badge
              overflowCount={999}
              count={options?.resizing?.maxHeight || 1}
              showZero
              color="#faad14"
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  rotating: { ...prev.rotating, enabled: e.target.checked },
                }))
              }
            >
              rotating
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>grid </Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={options?.rotating?.grid || 15}
              onChange={(value) =>
                setOptions((prev) => ({
                  ...prev,
                  rotating: { ...prev.rotating, grid: value },
                }))
              }
            />
          </Col>
          <Col span={2}>
            <Badge
              overflowCount={999}
              count={options?.rotating?.grid || 15}
              showZero
              color="#faad14"
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}
