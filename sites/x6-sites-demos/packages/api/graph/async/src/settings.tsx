import React from 'react'
import { Switch, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  count: number
  async: boolean
}

export const defaults: State = {
  count: 500,
  async: true,
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

  onAsyncChanged = (async: boolean) => {
    this.setState({ async }, () => {
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
          <Col span={5}>count</Col>
          <Col span={14}>
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
          <Col span={5}>async</Col>
          <Col span={14}>
            <Switch checked={this.state.async} onChange={this.onAsyncChanged} />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24} id="elapsed"></Col>
        </Row>
      </Card>
    )
  }
}
