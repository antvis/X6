import React from 'react'
import { Switch, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  count: number
  columns: number
  batch: number
  padding: number
  customViewport: boolean
  keepRendered: boolean
  keepDragged: boolean
}

export const defaults: State = {
  count: 1000,
  columns: 40,
  batch: 400,
  padding: 60,
  customViewport: true,
  keepRendered: false,
  keepDragged: false,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCountChanged = (count: number) => {
    this.setState({ count }, () => {
      this.notifyChange()
    })
  }

  onColumnsChanged = (columns: number) => {
    this.setState({ columns }, () => {
      this.notifyChange()
    })
  }

  onBatchChanged = (batch: number) => {
    this.setState({ batch }, () => {
      this.notifyChange()
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
      this.notifyChange()
    })
  }

  onCustomViewportChanged = (customViewport: boolean) => {
    this.setState({ customViewport }, () => {
      this.notifyChange()
    })
  }

  onKeepRenderedChanged = (keepRendered: boolean) => {
    this.setState({ keepRendered }, () => {
      this.notifyChange()
    })
  }

  onKeepDraggedChanged = (keepDragged: boolean) => {
    this.setState({ keepDragged }, () => {
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
          <Col span={7}>node count</Col>
          <Col span={12}>
            <Slider
              min={10}
              max={5000}
              step={1}
              value={this.state.count}
              onChange={this.onCountChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.count}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>batch size</Col>
          <Col span={12}>
            <Slider
              min={10}
              max={1000}
              step={1}
              value={this.state.batch}
              onChange={this.onBatchChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.batch}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>columns</Col>
          <Col span={12}>
            <Slider
              min={20}
              max={100}
              step={1}
              value={this.state.columns}
              onChange={this.onColumnsChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.columns}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>rows</Col>
          <Col span={12}></Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {Math.ceil(this.state.count / this.state.columns)}
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>padding</Col>
          <Col span={12}>
            <Slider
              min={20}
              max={120}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>custom viewport</Col>
          <Col span={14}>
            <Switch
              checked={this.state.customViewport}
              onChange={this.onCustomViewportChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>keep rendered</Col>
          <Col span={14}>
            <Switch
              checked={this.state.keepRendered}
              onChange={this.onKeepRenderedChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={10}>keep dragged</Col>
          <Col span={14}>
            <Switch
              checked={this.state.keepDragged}
              onChange={this.onKeepDraggedChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24} id="elapsed"></Col>
        </Row>
      </Card>
    )
  }
}
