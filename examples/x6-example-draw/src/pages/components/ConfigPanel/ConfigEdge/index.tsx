import React, { useEffect, useState, useRef } from 'react'
import { Tabs, Row, Col, Input, Slider, Select } from 'antd'
import X6Editor from '@/x6Editor'
import { Cell, Edge } from '@antv/x6'

const { TabPane } = Tabs

interface IProps {
  id: string
}
interface EdgeAttrs {
  stroke: string
  strokeWidth: number
  connector: string
  fontSize: number
  fill: string
  text: string
}

export default function (props: IProps) {
  const { id } = props
  const [attrs, setAttrs] = useState<EdgeAttrs>({
    stroke: '#ea6b66',
    strokeWidth: 1,
    connector: 'normal',
    fontSize: 12,
    fill: '#000000',
    text: '',
  })
  const cellRef = useRef<Cell>()

  useEffect(() => {
    if (id) {
      const { graph } = X6Editor.getInstance()
      const cell = graph.getCellById(id) as Edge
      if (!cell || !cell.isEdge()) {
        return
      }
      cellRef.current = cell

      const connector = cell.getConnector() || {
        name: 'normal',
      }
      setAttr('stroke', cell.prop('attrs/line/stroke'))
      setAttr('strokeWidth', cell.prop('attrs/line/strokeWidth'))
      setAttr('connector', connector.name)

      const label = cell.getLabelAt(0)
      if (label) {
        const { fontSize, fill, text } = label.attrs!.text
        setAttr('fontSize', fontSize)
        setAttr('fill', fill)
        setAttr('text', text)
      }
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
    cellRef.current!.prop('attrs/line/stroke', val)
  }

  const onStrokeWidthChange = (val: number) => {
    setAttr('strokeWidth', val)
    cellRef.current!.prop('attrs/line/strokeWidth', val)
  }

  const onConnectorChange = (val: string) => {
    setAttr('connector', val)
    const cell = cellRef.current as Edge
    cell.setConnector(val)
  }

  const onFontSizeChange = (val: number) => {
    setAttr('fontSize', val)
    const cell = cellRef.current as Edge
    cell.setLabelAt(0, {
      attrs: {
        text: {
          fontSize: val,
          text: attrs.text,
          fill: attrs.fill,
        },
      },
    })
  }

  const onFillChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('fill', val)
    const cell = cellRef.current as Edge
    cell.setLabelAt(0, {
      attrs: {
        text: {
          fill: val,
          fontSize: attrs.fontSize,
          text: attrs.text,
        },
      },
    })
  }

  const onTextChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('text', val)
    const cell = cellRef.current as Edge
    cell.setLabelAt(0, {
      attrs: {
        text: {
          text: val,
          fontSize: attrs.fontSize,
          fill: attrs.fill,
        },
      },
    })
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
      <TabPane tab="文本" key="2">
        <Row align="middle">
          <Col span={8}>Text</Col>
          <Col span={14}>
            <Input
              type="text"
              value={attrs.text}
              style={{ width: '100%' }}
              onChange={onTextChange}
            />
          </Col>
        </Row>
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
              value={attrs.fill}
              style={{ width: '100%' }}
              onChange={onFillChange}
            />
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}
