import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  x: number
  y: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    x: 0.6,
    y: 32,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onXChanged = (x: number) => {
    this.setState({ x }, () => {
      this.notifyChange()
    })
  }

  onYChanged = (y: number) => {
    this.setState({ y }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            x
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.x}
              onChange={this.onXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.x}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            y
          </Col>
          <Col span={14}>
            <Slider
              min={-20}
              max={140}
              step={1}
              value={this.state.y}
              onChange={this.onYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.y}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
