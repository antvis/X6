import React, { useEffect, useState, useRef } from 'react'
import { Tabs, Row, Col, Input, Slider, Select } from 'antd'
import FlowGraph from '@/pages/Graph'
import { Cell, Edge } from '@antv/x6'

const { TabPane } = Tabs

interface IProps {
  id: string
}
interface EdgeAttrs {
  stroke: string
  strokeWidth: number
  connector: string
}

export default function (props: IProps) {
  const { id } = props
  const [attrs, setAttrs] = useState<EdgeAttrs>({
    stroke: '#5F95FF',
    strokeWidth: 1,
    connector: 'normal',
  })
  const cellRef = useRef<Cell>()

  useEffect(() => {
    if (id) {
      const { graph } = FlowGraph
      const cell = graph.getCellById(id) as Edge
      if (!cell || !cell.isEdge()) {
        return
      }
      cellRef.current = cell

      const connector = cell.getConnector() || {
        name: 'normal',
      }
      setAttr('stroke', cell.attr('line/stroke'))
      setAttr('strokeWidth', cell.attr('line/strokeWidth'))
      setAttr('connector', connector.name)
    }
  }, [id])

  const setAttr = (key: string, val: any) => {
    setAttrs((prev) => ({
      ...prev,
      [key]: val,
    }))
  }

  const onStrokeChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('stroke', val)
    cellRef.current!.attr('line/stroke', val)
  }

  const onStrokeWidthChange = (val: number) => {
    setAttr('strokeWidth', val)
    cellRef.current!.attr('line/strokeWidth', val)
  }

  const onConnectorChange = (val: string) => {
    setAttr('connector', val)
    const cell = cellRef.current as Edge
    cell.setConnector(val)
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="线条" key="1">
        <Row align="middle">
          <Col span={8}>Width</Col>
          <Col span={12}>
            <Slider
              min={1}
              max={5}
              step={1}
              value={attrs.strokeWidth}
              onChange={onStrokeWidthChange}
            />
          </Col>
          <Col span={2}>
            <div className="result">{attrs.strokeWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={attrs.stroke}
              style={{ width: '100%' }}
              onChange={onStrokeChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Connector</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={attrs.connector}
              onChange={onConnectorChange}
            >
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="smooth">Smooth</Select.Option>
              <Select.Option value="rounded">Rounded</Select.Option>
              <Select.Option value="jumpover">Jumpover</Select.Option>
            </Select>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}
