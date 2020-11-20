import React, { useEffect } from 'react'
import { Tabs, Row, Col, Select, Slider, Input, Checkbox } from 'antd'
import FlowGraph from '@/pages/Graph'

const { TabPane } = Tabs

enum GRID_TYPE {
  DOT = 'dot',
  FIXED_DOT = 'fixedDot',
  MESH = 'mesh',
  DOUBLE_MESH = 'doubleMesh',
}

enum REPEAT_TYPE {
  NO_REPEAT = 'no-repeat',
  REPEAT = 'repeat',
  REPEAT_X = 'repeat-x',
  REPEAT_Y = 'repeat-y',
  ROUND = 'round',
  SPACE = 'space',
  FLIPX = 'flipX',
  FLIPY = 'flipY',
  FLIPXY = 'flipXY',
  WATERMARK = 'watermark',
}

interface IProps {
  attrs: {
    [key: string]: any
  }
  setAttr: (key: string, value: any) => void
}

const tryToJSON = (val: string) => {
  try {
    return JSON.parse(val)
  } catch (error) {
    return val
  }
}

export default function (props: IProps) {
  const { attrs, setAttr } = props

  useEffect(() => {
    let options
    if (attrs.type === 'doubleMesh') {
      options = {
        type: attrs.type,
        args: [
          {
            color: attrs.color,
            thickness: attrs.thickness,
          },
          {
            color: attrs.colorSecond,
            thickness: attrs.thicknessSecond,
            factor: attrs.factor,
          },
        ],
      }
    } else {
      options = {
        type: attrs.type,
        args: [
          {
            color: attrs.color,
            thickness: attrs.thickness,
          },
        ],
      }
    }
    const { graph } = FlowGraph
    graph.drawGrid(options)
  }, [
    attrs.type,
    attrs.color,
    attrs.thickness,
    attrs.thicknessSecond,
    attrs.colorSecond,
    attrs.factor,
  ])

  useEffect(() => {
    const { graph } = FlowGraph
    graph.setGridSize(attrs.size)
  }, [attrs.size])

  useEffect(() => {
    const options = {
      color: attrs.bgColor,
      image: attrs.showImage
        ? 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*o-MuTpQaj7EAAAAAAAAAAABkARQnAQ'
        : undefined,
      repeat: attrs.repeat,
      angle: attrs.angle,
      size: tryToJSON(attrs.bgSize),
      position: tryToJSON(attrs.position),
      opacity: attrs.opacity,
    }
    const { graph } = FlowGraph
    graph.drawBackground(options)
  }, [
    attrs.bgColor,
    attrs.showImage,
    attrs.repeat,
    attrs.angle,
    attrs.bgSize,
    attrs.position,
    attrs.opacity,
  ])

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="网格" key="1">
        <Row align="middle">
          <Col span={10}>Grid Type</Col>
          <Col span={12}>
            <Select
              style={{ width: '100%' }}
              value={attrs.type}
              onChange={(val) => setAttr('type', val)}
            >
              <Select.Option value={GRID_TYPE.DOT}>Dot</Select.Option>
              <Select.Option value={GRID_TYPE.FIXED_DOT}>
                Fixed Dot
              </Select.Option>
              <Select.Option value={GRID_TYPE.MESH}>Mesh</Select.Option>
              <Select.Option value={GRID_TYPE.DOUBLE_MESH}>
                Double Mesh
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>Grid Size</Col>
          <Col span={10}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={attrs.size}
              onChange={(val: number) => setAttr('size', val)}
            />
          </Col>
          <Col span={2}>
            <div className="result">{attrs.size}</div>
          </Col>
        </Row>
        {attrs.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align="middle">
              <Col span={10}>Primary Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={attrs.color}
                  style={{ width: '100%' }}
                  onChange={(e) => setAttr('color', e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Primary Thickness</Col>
              <Col span={10}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thickness}
                  onChange={(val: number) => setAttr('thickness', val)}
                />
              </Col>
              <Col span={2}>
                <div className="result">{attrs.thickness.toFixed(1)}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Secondary Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={attrs.colorSecond}
                  style={{ width: '100%' }}
                  onChange={(e) => setAttr('colorSecond', e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Secondary Thickness</Col>
              <Col span={10}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thicknessSecond}
                  onChange={(val: number) => setAttr('thicknessSecond', val)}
                />
              </Col>
              <Col span={2}>
                <div className="result">{attrs.thicknessSecond.toFixed(1)}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Scale Factor</Col>
              <Col span={10}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={attrs.factor}
                  onChange={(val: number) => setAttr('factor', val)}
                />
              </Col>
              <Col span={2}>
                <div className="result">{attrs.factor}</div>
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
                  value={attrs.color}
                  style={{ width: '100%' }}
                  onChange={(e) => setAttr('color', e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={10}>Thickness</Col>
              <Col span={10}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thickness}
                  onChange={(val: number) => setAttr('thickness', val)}
                />
              </Col>
              <Col span={1}>
                <div className="result">{attrs.thickness.toFixed(1)}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </TabPane>
      <TabPane tab="背景" key="2">
        <Row align="middle">
          <Col span={6}>Color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={attrs.bgColor}
              style={{ width: '100%' }}
              onChange={(e) => setAttr('bgColor', e.target.value)}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14} offset={6}>
            <Checkbox
              checked={attrs.showImage}
              onChange={(e) => setAttr('showImage', e.target.checked)}
            >
              Show Image
            </Checkbox>
          </Col>
        </Row>
        {attrs.showImage && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Repeat</Col>
              <Col span={14}>
                <Select
                  style={{ width: '100%' }}
                  value={attrs.repeat}
                  onChange={(val) => setAttr('repeat', val)}
                >
                  <Select.Option value={REPEAT_TYPE.NO_REPEAT}>
                    No Repeat
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.REPEAT}>
                    Repeat
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.REPEAT_X}>
                    Repeat X
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.REPEAT_Y}>
                    Repeat Y
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.ROUND}>Round</Select.Option>
                  <Select.Option value={REPEAT_TYPE.SPACE}>Space</Select.Option>
                  <Select.Option value={REPEAT_TYPE.FLIPX}>
                    Flip X
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.FLIPY}>
                    Flip Y
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.FLIPXY}>
                    Flip XY
                  </Select.Option>
                  <Select.Option value={REPEAT_TYPE.WATERMARK}>
                    Watermark
                  </Select.Option>
                </Select>
              </Col>
            </Row>
            {attrs.repeat === 'watermark' && (
              <Row align="middle">
                <Col span={16} offset={6} style={{ fontSize: 12 }}>
                  Watermark Angle
                </Col>
                <Col span={14} offset={6}>
                  <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={attrs.angle}
                    onChange={(val: number) => setAttr('angle', val)}
                  />
                </Col>
                <Col span={2}>
                  <div className="result">{attrs.angle}</div>
                </Col>
              </Row>
            )}
            <Row align="middle">
              <Col span={6}>Position</Col>
              <Col span={14}>
                <Select
                  style={{ width: '100%' }}
                  value={attrs.position}
                  onChange={(val) => setAttr('position', val)}
                >
                  <Select.Option value="center">center</Select.Option>
                  <Select.Option value="left">left</Select.Option>
                  <Select.Option value="right">right</Select.Option>
                  <Select.Option value="top">top</Select.Option>
                  <Select.Option value="bottom">bottom</Select.Option>
                  <Select.Option value="50px 50px">50px 50px</Select.Option>
                  <Select.Option value={JSON.stringify({ x: 50, y: 50 })}>
                    {`{ x: 50, y: 50 }`}
                  </Select.Option>
                </Select>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Size</Col>
              <Col span={14}>
                <Select
                  style={{ width: '100%' }}
                  value={attrs.bgSize}
                  onChange={(val) => setAttr('bgSize', val)}
                >
                  <Select.Option value="auto auto">auto auto</Select.Option>
                  <Select.Option value="cover">cover</Select.Option>
                  <Select.Option value="contain">contain</Select.Option>
                  <Select.Option value="30px 30px">30px 30px</Select.Option>
                  <Select.Option value="100% 100%">100% 100%</Select.Option>
                  <Select.Option
                    value={JSON.stringify({ width: 150, height: 150 })}
                  >
                    {`{width: 150, height: 150 }`}
                  </Select.Option>
                </Select>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Opacity</Col>
              <Col span={12}>
                <Slider
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={attrs.opacity}
                  onChange={(val: number) => setAttr('opacity', val)}
                />
              </Col>
              <Col span={4}>
                <div className="result">{attrs.opacity.toFixed(2)}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </TabPane>
    </Tabs>
  )
}
