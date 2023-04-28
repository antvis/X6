import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  scale: number
  tx: number
  ty: number
}

export const defaults: State = {
  scale: 1,
  tx: 0,
  ty: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onScaleChanged = (scale: number) => {
    this.setState({ scale }, () => {
      this.notifyChange()
    })
  }

  onTxChanged = (tx: number) => {
    this.setState({ tx }, () => {
      this.notifyChange()
    })
  }

  onTyChanged = (ty: number) => {
    this.setState({ ty }, () => {
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
          <Col span={7}>scale</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={this.state.scale}
              onChange={this.onScaleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scale}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateX</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.tx}
              onChange={this.onTxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.tx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateY</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.ty}
              onChange={this.onTyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.ty}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
