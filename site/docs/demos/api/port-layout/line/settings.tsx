import React from 'react'
import { Slider, Switch, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  strict: boolean
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    strict: false,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStrictChange = (strict: boolean) => {
    this.setState({ strict }, () => {
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

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            strict
          </Col>
          <Col span={14}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
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
