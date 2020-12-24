import React from 'react'
import { Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  offset: number
  min: number
  center: boolean
  textAnchor?: string
}

export const defaults: State = {
  offset: 32,
  min: 16,
  center: false,
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

  render() {
    return (
      <Card title="Attrs" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>offset</Col>
          <Col span={14}>
            <Switch
              checkedChildren="center"
              unCheckedChildren="center"
              checked={this.state.center}
              onChange={this.onCenterChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}></Col>
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
          <Col span={5}>min</Col>
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
      </Card>
    )
  }
}
