import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  x: number
  y: number
}

export const defaults: State = {
  color: '#4943a3',
  x: 10,
  y: 10,
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

  onXChanged = (dx: number) => {
    this.setState({ x: dx }, () => {
      this.notifyChange()
    })
  }

  onYChanged = (dy: number) => {
    this.setState({ y: dy }, () => {
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
          <Col span={6}>x</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.x}
              onChange={this.onXChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.x.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>y</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.y}
              onChange={this.onYChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.y.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
