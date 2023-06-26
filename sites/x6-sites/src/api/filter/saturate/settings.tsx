import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
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

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
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
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
