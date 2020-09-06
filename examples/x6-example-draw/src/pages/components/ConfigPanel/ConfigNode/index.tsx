import React, { useEffect, useState, useRef } from 'react'
import { Tabs, Row, Col, Input, Slider, Select } from 'antd'
import X6Editor from '@/x6Editor'
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
  align: 'left' | 'center' | 'right'
}

export default function (props: IProps) {
  const { id } = props
  const [attrs, setAttrs] = useState<NodeAttrs>({
    stroke: '#ea6b66',
    strokeWidth: 2,
    fill: '#ffcc99',
    fontSize: 12,
    color: '#000000',
    align: 'center',
  })
  const cellRef = useRef<Cell>()

  useEffect(() => {
    if (id) {
      const { graph } = X6Editor.getInstance()
      const cell = graph.getCellById(id)
      if (!cell || !cell.isNode()) {
        return
      }
      cellRef.current = cell
      setAttrs({
        stroke: cell.prop('attrs/body/stroke'),
        strokeWidth: cell.prop('attrs/body/strokeWidth'),
        fill: cell.prop('attrs/body/fill'),
        fontSize: parseInt(cell.prop('attrs/content/style/fontSize'), 10),
        color: cell.prop('attrs/content/style/color'),
        align: cell.prop('attrs/content/style/textAlign'),
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
    cellRef.current!.prop('attrs/body/stroke', val)
  }

  const onStrokeWidthChange = (val: number) => {
    setAttr('strokeWidth', val)
    cellRef.current!.prop('attrs/body/strokeWidth', val)
  }

  const onFillChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('fill', val)
    cellRef.current!.prop('attrs/body/fill', val)
  }

  const onFontSizeChange = (val: number) => {
    setAttr('fontSize', val)
    cellRef.current!.prop('attrs/content/style/fontSize', `${val}px`)
  }

  const onColorChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('color', val)
    cellRef.current!.prop('attrs/content/style/color', val)
  }

  const onAlignChange = (val: string) => {
    setAttr('align', val)
    cellRef.current!.prop('attrs/content/style/textAlign', val)
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
        <Row align="middle">
          <Col span={8}>Align</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={attrs.align}
              onChange={onAlignChange}
            >
              <Select.Option value="left">Left</Select.Option>
              <Select.Option value="center">Center</Select.Option>
              <Select.Option value="right">Right</Select.Option>
            </Select>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}
