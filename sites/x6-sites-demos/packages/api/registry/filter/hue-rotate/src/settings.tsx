import React from 'react'
import { Color } from '@antv/x6'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  angle: number
}

export const defaults: State = {
  color: Color.randomHex(),
  angle: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (dx: number) => {
    this.setState({ angle: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>angle</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.angle.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
