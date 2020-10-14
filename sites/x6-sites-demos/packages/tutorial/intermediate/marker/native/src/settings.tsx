import React from 'react'
import { Input, Switch, Checkbox, Select, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  type: string
  r?: number
  rx?: number
  ry?: number
  width?: number
  height?: number
  offset?: number
  custom?: boolean
  fill?: string
  stroke?: string
  open?: boolean
  flip?: boolean
  strokeWidth?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'block',
    r: 5,
    rx: 5,
    ry: 5,
    width: 10,
    height: 10,
    offset: 0,
    custom: false,
    strokeWidth: 1,
  }

  notifyChange() {
    const {
      custom,
      type,
      r,
      rx,
      ry,
      width,
      height,
      offset,
      open,
      flip,
      ...others
    } = this.state

    if (others.stroke == null) {
      delete others.strokeWidth
    }

    let state: State

    if (type === 'block') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        ...others,
      }
    } else if (type === 'classic' || type === 'diamond' || type === 'cross') {
      state = {
        type,
        width,
        height,
        offset,
        ...others,
      }
    } else if (type === 'async') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        flip,
        ...others,
      }
    } else if (type === 'circle' || type === 'circlePlus') {
      state = {
        type,
        r,
        ...others,
      }
    } else if (type === 'ellipse') {
      state = {
        type,
        rx,
        ry,
        ...others,
      }
    }

    this.props.onChange(state!)
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onRChanged = (r: number) => {
    this.setState({ r }, () => {
      this.notifyChange()
    })
  }

  onRxChanged = (rx: number) => {
    this.setState({ rx }, () => {
      this.notifyChange()
    })
  }

  onRyChanged = (ry: number) => {
    this.setState({ ry }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onHeightChanged = (height: number) => {
    this.setState({ height }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onCustomChanged = (e: any) => {
    this.setState({ custom: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onFillChanged = (e: any) => {
    this.setState({ fill: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeChanged = (e: any) => {
    this.setState({ stroke: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeWidthChanged = (strokeWidth: number) => {
    this.setState({ strokeWidth }, () => {
      this.notifyChange()
    })
  }

  onOpenChanged = (open: boolean) => {
    this.setState({ open }, () => {
      this.notifyChange()
    })
  }

  onFlipChanged = (flip: boolean) => {
    this.setState({ flip }, () => {
      this.notifyChange()
    })
  }

  render() {
    const type = this.state.type

    return (
      <Card
        title="Marker Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Type</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="block">Block</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
              <Select.Option value="diamond">Diamond</Select.Option>
              <Select.Option value="cross">Cross</Select.Option>
              <Select.Option value="async">Async</Select.Option>
              <Select.Option value="circle">Circle</Select.Option>
              <Select.Option value="circlePlus">Circle Plus</Select.Option>
              <Select.Option value="ellipse">Ellipse</Select.Option>
            </Select>
          </Col>
        </Row>
        {(type === 'circle' || type === 'circlePlus') && (
          <Row align="middle">
            <Col span={6}>Radius</Col>
            <Col span={14}>
              <Slider
                min={0}
                max={50}
                step={1}
                value={this.state.r}
                onChange={this.onRChanged}
              />
            </Col>
            <Col span={2} offset={1}>
              <div className="slider-value">{this.state.r}</div>
            </Col>
          </Row>
        )}
        {type === 'ellipse' && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Radius X</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.rx}
                  onChange={this.onRxChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.rx}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Radius Y</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.ry}
                  onChange={this.onRyChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.ry}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}

        {(type === 'block' ||
          type === 'classic' ||
          type === 'diamond' ||
          type === 'async' ||
          type === 'cross') && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Width</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.width}
                  onChange={this.onWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.width}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Height</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.height}
                  onChange={this.onHeightChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.height}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Offset</Col>
              <Col span={14}>
                <Slider
                  min={-50}
                  max={50}
                  step={1}
                  value={this.state.offset}
                  onChange={this.onOffsetChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.offset}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {(type === 'block' || type === 'async') && (
          <Row align="middle">
            <Col span={4}>Open</Col>
            <Col span={18}>
              <Switch checked={this.state.open} onChange={this.onOpenChanged} />
            </Col>
          </Row>
        )}

        {type === 'async' && (
          <Row align="middle">
            <Col span={4}>Flip</Col>
            <Col span={18}>
              <Switch checked={this.state.flip} onChange={this.onFlipChanged} />
            </Col>
          </Row>
        )}

        <Row
          align="middle"
          style={{ borderTop: '1px solid #e9e9e9', paddingTop: 12 }}
        >
          <Col>
            <div>
              <Checkbox
                checked={this.state.custom}
                onChange={this.onCustomChanged}
              >
                Custom fill and stroke color
              </Checkbox>
            </div>
          </Col>
        </Row>
        {this.state.custom && (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Fill Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.fill}
                  style={{ width: '100%' }}
                  onChange={this.onFillChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.stroke}
                  style={{ width: '100%' }}
                  onChange={this.onStrokeChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Width</Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={this.state.strokeWidth}
                  onChange={this.onStrokeWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.strokeWidth}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Card>
    )
  }
}
