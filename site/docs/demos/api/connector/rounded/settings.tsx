import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    radius: 10,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={1}
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
