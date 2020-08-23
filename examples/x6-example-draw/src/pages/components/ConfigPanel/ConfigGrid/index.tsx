import React, { useState, useEffect } from 'react'
import X6Editor from '@/x6Editor'
import { Tabs, Row, Col, Select, Slider, Input } from 'antd';
import styles from './index.less'

const { TabPane } = Tabs;

enum GRID_TYPE {
  DOT = 'dot',
  FIXED_DOT = 'fixedDot',
  MESH = 'mesh',
  DOUBLE_MESH = 'doubleMesh',
}

export default function() {
  const [type, setType] = useState<GRID_TYPE>(GRID_TYPE.DOUBLE_MESH)
  const [size, setSize] = useState(10)
  const [color, setColor] = useState('#e6e6e6')
  const [thickness, setThickness] = useState(1)
  const [colorSecond, setColorSecond] = useState('#d0d0d0')
  const [thicknessSecond, setThicknessSecond] = useState(1)
  const [factor, setFactor] = useState(5)

  useEffect(() => {
    let option;
    if (type === 'doubleMesh') {
      option = {
        type,
        args: [
          {
            color: color,
            thickness: thickness,
          },
          {
            color: colorSecond,
            thickness: thicknessSecond,
            factor: factor,
          },
        ],
      }
    } else {
      option = {
        type,
        args: [
          {
            color: color,
            thickness: thickness,
          },
        ],
      }
    }
    X6Editor.getInstance().drawGrid(option)
  }, [type, color, thickness, thicknessSecond, colorSecond, factor])

  useEffect(() => {
    X6Editor.getInstance().setGridSize(size)
  }, [size])

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="网格" key="1" className={styles.grid}>
        <Row align="middle">
          <Col span={10}>Grid Type</Col>
          <Col span={12}>
            <Select
              style={{ width: '100%' }}
              value={type}
              onChange={setType}
            >
              <Select.Option value={GRID_TYPE.DOT}>Dot</Select.Option>
              <Select.Option value={GRID_TYPE.FIXED_DOT}>Fixed Dot</Select.Option>
              <Select.Option value={GRID_TYPE.MESH}>Mesh</Select.Option>
              <Select.Option value={GRID_TYPE.DOUBLE_MESH}>Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>Grid Size</Col>
          <Col span={11}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={size}
              onChange={setSize}
            />
          </Col>
          <Col span={1}>
            <div className={styles.result}>{size}</div>
          </Col>
        </Row>
        {type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align="middle">
              <Col span={10}>Primary Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={color}
                  style={{ width: '100%' }}
                  onChange={e => setColor(e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Primary Thickness</Col>
              <Col span={11}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={thickness}
                  onChange={setThickness}
                />
              </Col>
              <Col span={1}>
                <div className={styles.result}>
                  {thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Secondary Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={colorSecond}
                  style={{ width: '100%' }}
                  onChange={e => setColorSecond(e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Secondary Thickness</Col>
              <Col span={11}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={thicknessSecond}
                  onChange={setThicknessSecond}
                />
              </Col>
              <Col span={1}>
                <div className={styles.result}>
                  {thicknessSecond.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Scale Factor</Col>
              <Col span={11}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={factor}
                  onChange={setFactor}
                />
              </Col>
              <Col span={1}>
                <div className={styles.result}>{factor}</div>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row align="middle">
              <Col span={10}>Grid Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={color}
                  style={{ width: '100%' }}
                  onChange={e => setColor(e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Thickness</Col>
              <Col span={11}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={thickness}
                  onChange={setThickness}
                />
              </Col>
              <Col span={1}>
                <div className={styles.result}>
                  {thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </TabPane>
      <TabPane tab="背景" key="2">
        背景配置
      </TabPane>
    </Tabs>
  )
}