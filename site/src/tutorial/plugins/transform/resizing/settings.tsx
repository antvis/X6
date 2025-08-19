import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import './index.less'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orthogonal?: boolean
  restrict?: boolean
  preserveAspectRatio?: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    minWidth: 1,
    maxWidth: 200,
    minHeight: 1,
    maxHeight: 150,
    orthogonal: false,
    restrict: false,
    preserveAspectRatio: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinWidthChanged = (minWidth: number) => {
    this.setState({ minWidth }, () => {
      this.notifyChange()
    })
  }

  onMaxWidthChanged = (maxWidth: number) => {
    this.setState({ maxWidth }, () => {
      this.notifyChange()
    })
  }

  onMinHeightChanged = (minHeight: number) => {
    this.setState({ minHeight }, () => {
      this.notifyChange()
    })
  }

  onMaxHeightChanged = (maxHeight: number) => {
    this.setState({ maxHeight }, () => {
      this.notifyChange()
    })
  }

  onOrthogonalChanged = (e: any) => {
    this.setState({ orthogonal: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onRestrictedChanged = (e: any) => {
    this.setState({ restrict: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPreserveAspectRatioChanged = (e: any) => {
    this.setState({ preserveAspectRatio: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Resizing Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minWidth</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={this.state.minWidth}
              onChange={this.onMinWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxWidth</Col>
          <Col span={14}>
            <Slider
              min={100}
              max={200}
              step={1}
              value={this.state.maxWidth}
              onChange={this.onMaxWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minHeight</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={75}
              step={1}
              value={this.state.minHeight}
              onChange={this.onMinHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxHeight</Col>
          <Col span={14}>
            <Slider
              min={75}
              max={150}
              step={1}
              value={this.state.maxHeight}
              onChange={this.onMaxHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.orthogonal}
              onChange={this.onOrthogonalChanged}
            >
              Orthogonal
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.restrict}
              onChange={this.onRestrictedChanged}
            >
              Restrict
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.preserveAspectRatio}
              onChange={this.onPreserveAspectRatioChanged}
            >
              PreserveAspectRatio
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
