import React from 'react'
import { Card, Row, Col, Slider } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  padding: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    padding: 20,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
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
          <Col span={6}>Padding</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={40}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ borderTop: '1px solid #f0f0f0' }}>
          <Col style={{ padding: '24px 0 8px 0', color: '#666' }}>
            Press and hold on{' '}
            <strong style={{ color: '#faad14' }}>Ctrl or Command</strong> key,
            then move the child node to remove it from it's parent node.
          </Col>
        </Row>
      </Card>
    )
  }
}
