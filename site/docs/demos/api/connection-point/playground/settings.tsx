import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  anchor: string
  connectionPoint: string
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    anchor: 'center',
    connectionPoint: 'boundary',
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onAnchorChange = (e: any) => {
    this.setState({ anchor: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onConnectionPointChange = (e: any) => {
    this.setState({ connectionPoint: e.target.value }, () => {
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
          <Col span={5}>anchor</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onAnchorChange}
              value={this.state.anchor}
            >
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>connectionPoint</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onConnectionPointChange}
              value={this.state.connectionPoint}
            >
              <Radio value="boundary">boundary</Radio>
              <Radio value="anchor">anchor</Radio>
              <Radio value="bbox">bbox</Radio>
              <Radio value="rect">rect</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>angle</Col>
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
            <div className="slider-value">{this.state.angle}°</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
