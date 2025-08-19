import React from 'react'
import { Slider, Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  start: number
  compensateRotate: boolean
  dr: number
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    start: 45,
    compensateRotate: false,
    dr: 0,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStartChanged = (start: number) => {
    this.setState({ start }, () => {
      this.notifyChange()
    })
  }

  onCompensateRotateChange = (e: any) => {
    this.setState({ compensateRotate: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDrChanged = (dr: number) => {
    this.setState({ dr }, () => {
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
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            start
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.start}
              onChange={this.onStartChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.start}</div>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={19} offset={5}>
            <Checkbox
              onChange={this.onCompensateRotateChange}
              checked={this.state.compensateRotate}
            >
              compensateRotate
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dr
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dr}
              onChange={this.onDrChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dr}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
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
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
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
