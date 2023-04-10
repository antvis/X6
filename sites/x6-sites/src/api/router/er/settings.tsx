import React from 'react'
import { Switch, Radio, Slider, Card, Row, Col } from 'antd'
import './index.less'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  offset: number
  min: number
  center: boolean
  direction: '' | 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const defaults: State = {
  offset: 32,
  min: 16,
  center: false,
  direction: '',
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCenterChanged = (center: boolean) => {
    this.setState({ center }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onMinChanged = (min: number) => {
    this.setState({ min }, () => {
      this.notifyChange()
    })
  }

  onDirectionChanged = (e: any) => {
    const direction = e.target.value
    this.setState({ direction }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Options"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>offset</Col>
          <Col span={14}>
            <Switch
              checkedChildren="center"
              unCheckedChildren="number"
              checked={this.state.center}
              onChange={this.onCenterChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}></Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              disabled={this.state.center}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>min</Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              value={this.state.min}
              onChange={this.onMinChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.min}</div>
          </Col>
        </Row>
        <Row align="top">
          <Col span={6}>direction</Col>
          <Col span={14}>
            <Radio.Group
              name="direction"
              value={this.state.direction}
              onChange={this.onDirectionChanged}
            >
              <Radio value="" style={{ display: 'block', marginBottom: 8 }}>
                NONE
              </Radio>
              <Radio value="L" style={{ marginBottom: 8 }}>
                L
              </Radio>
              <Radio value="R">R</Radio>
              <Radio value="H">H</Radio>
              <Radio value="T">T</Radio>
              <Radio value="B">B</Radio>
              <Radio value="V">V</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
