import React, { useEffect, useState, useRef } from 'react'
import { Tabs, Row, Col, Input, Slider } from 'antd'
import FlowGraph from '@/pages/Graph'
import { Cell } from '@antv/x6'

const { TabPane } = Tabs

interface IProps {
  id: string
}
interface NodeAttrs {
  stroke: string
  strokeWidth: number
  fill: string
  fontSize: number
  color: string
}

export default function (props: IProps) {
  const { id } = props
  const [attrs, setAttrs] = useState<NodeAttrs>({
    stroke: '#5F95FF',
    strokeWidth: 1,
    fill: 'rgba(95,149,255,0.05)',
    fontSize: 12,
    color: 'rgba(0,0,0,0.85)',
  })
  const cellRef = useRef<Cell>()

  useEffect(() => {
    if (id) {
      const { graph } = FlowGraph
      const cell = graph.getCellById(id)
      if (!cell || !cell.isNode()) {
        return
      }
      cellRef.current = cell
      setAttrs({
        stroke: cell.attr('body/stroke'),
        strokeWidth: cell.attr('body/strokeWidth'),
        fill: cell.attr('body/fill'),
        fontSize: cell.attr('text/fontSize'),
        color: cell.attr('text/fill'),
      })
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
    cellRef.current!.attr('body/stroke', val)
  }

  const onStrokeWidthChange = (val: number) => {
    setAttr('strokeWidth', val)
    cellRef.current!.attr('body/strokeWidth', val)
  }

  const onFillChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('fill', val)
    cellRef.current!.attr('body/fill', val)
  }

  const onFontSizeChange = (val: number) => {
    setAttr('fontSize', val)
    cellRef.current!.attr('text/fontSize', val)
  }

  const onColorChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('color', val)
    cellRef.current!.attr('text/fill', val)
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="节点" key="1">
        <Row align="middle">
          <Col span={8}>Border Color</Col>
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
          <Col span={8}>Border Width</Col>
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
          <Col span={8}>Fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={attrs.fill}
              style={{ width: '100%' }}
              onChange={onFillChange}
            />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="文本" key="2">
        <Row align="middle">
          <Col span={8}>Font Size</Col>
          <Col span={12}>
            <Slider
              min={8}
              max={16}
              step={1}
              value={attrs.fontSize}
              onChange={onFontSizeChange}
            />
          </Col>
          <Col span={2}>
            <div className="result">{attrs.fontSize}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Font Color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={attrs.color}
              style={{ width: '100%' }}
              onChange={onColorChange}
            />
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}
