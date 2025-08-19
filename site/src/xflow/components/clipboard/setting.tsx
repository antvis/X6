import { useGraphStore, useClipboard } from '@antv/xflow'
import React, { useEffect, useState, useCallback } from 'react'
import { Card, Row, Col, Slider, Checkbox, Button, Badge } from 'antd'

export const Setting = (props) => {
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
  const [offset, setOffset] = useState(30)
  const nodes = useGraphStore((state) => state.nodes)
  const { copy, paste } = useClipboard()

  const onCopy = () => {
    const selected = nodes.filter((node) => node.selected)
    const ids: string[] = selected.map((node) => node.id || '')
    copy(ids)
  }

  const onPaste = () => {
    paste({ offset })
  }

  return (
    <div>
      <Card title="Card title" bordered={false}>
        <Row align="middle">
          <Col span={10}>Paste Offset</Col>
          <Col span={2} offset={1}>
            <Badge
              overflowCount={999}
              count={offset}
              showZero
              color="#faad14"
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={80}
              step={1}
              value={offset}
              onChange={(value) => setOffset(value)}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={props.value}
              onChange={(e) => props.setLocalStorage(e.target.checked)}
            >
              useLocalStorage
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>
            <Button type="primary" onClick={onCopy}>
              Copy Cell
            </Button>
          </Col>
          <Col span={10} offset={4}>
            <Button onClick={onPaste}>Paste Cell</Button>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
