import React from 'react'
import { Slider, Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  size: number
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'arc',
    size: 5,
    radius: 0,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.notifyChange()
    })
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  onTypeChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>type</Col>
          <Col span={18}>
            <Radio.Group onChange={this.onTypeChange} value={this.state.type}>
              <Radio value={'arc'}>arc</Radio>
              <Radio value={'cubic'}>cubic</Radio>
              <Radio value={'gap'}>gap</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>size</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
