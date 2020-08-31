import React, { useEffect, useState, useRef } from 'react'
import { Tabs, Row, Col, Input } from 'antd'
import X6Editor from '@/x6Editor'
import { Cell } from '@antv/x6'

const { TabPane } = Tabs

interface IProps {
  id: string,
}
interface NodeAttrs {
  stroke: string
}

export default function(props: IProps) {
  const { id }  = props;
  const [attrs, setAttrs] = useState<NodeAttrs>({
    stroke: '#31d0c6',
  })
  const cellRef = useRef<Cell>()

  useEffect(() => {
    if (id) {
      const { graph } = X6Editor.getInstance()
      const cell = graph.getCellById(id)
      cellRef.current = cell
      setAttrs({
        stroke: cell.prop('attrs/body/stroke')
      })
    }
  }, [id])

  const setAttr = (key: string, val: any) => {
    setAttrs(prev => ({
      ...prev,
      [key]: val
    }))
  }

  const onStrokeChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAttr('stroke', val)
    cellRef.current!.prop('attrs/body/stroke', val)
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
      </TabPane>
      <TabPane tab="文本" key="2">
        23
      </TabPane>
    </Tabs>
  )
}