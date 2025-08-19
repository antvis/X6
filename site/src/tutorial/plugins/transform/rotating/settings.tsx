import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import './index.less'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  grid?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    grid: 15,
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

  onGridChanged = (grid: number) => {
    this.setState({ grid }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Rotating Settings"
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
          <Col span={6}>grid</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={180}
              step={1}
              value={this.state.grid}
              onChange={this.onGridChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.grid}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
