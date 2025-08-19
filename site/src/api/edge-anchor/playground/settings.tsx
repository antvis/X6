import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  value: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'ratio',
    value: 50,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (value: number) => {
    this.setState({ value }, () => {
      this.notifyChange()
    })
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="ratio">ratio</Radio>
              <Radio value="length">length</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="closest">closest</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {(this.state.type === 'ratio' || this.state.type === 'length') && (
          <Row align="middle">
            <Col span={5}>
              {this.state.type === 'ratio' ? 'ratio' : 'length'}
            </Col>
            <Col span={14}>
              <Slider
                min={0}
                max={100}
                step={1}
                value={this.state.value}
                onChange={this.onAngleChanged}
              />
            </Col>
            <Col span={1} offset={1}>
              <div className="slider-value">
                {this.state.value}
                {this.state.type === 'ratio' ? '%' : ''}
              </div>
            </Col>
          </Row>
        )}
      </Card>
    )
  }
}
