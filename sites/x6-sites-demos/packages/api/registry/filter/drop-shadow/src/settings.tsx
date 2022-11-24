import React from 'react'
import { Color } from '@antv/x6'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  dx: number
  dy: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: Color.randomHex(),
  dx: 10,
  dy: 10,
  blur: 5,
  opacity: 0.5,
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

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onBlurChanged = (blur: number) => {
    this.setState({ blur }, () => {
      this.notifyChange()
    })
  }

  onOpacityChanged = (opacity: number) => {
    this.setState({ opacity }, () => {
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
          <Col span={6}>color</Col>
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
          <Col span={6}>dx</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dx.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>dy</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dy.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>blur</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.blur}
              onChange={this.onBlurChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.blur.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>opacity</Col>
          <Col span={14}>
            <Slider
              min={0.05}
              max={1}
              step={0.05}
              value={this.state.opacity}
              onChange={this.onOpacityChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.opacity.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
