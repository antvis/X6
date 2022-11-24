import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  refX: number
  refY: number
  textAnchor?: string
  textVerticalAnchor?: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    refX: 0.5,
    refY: 0.5,
    textAnchor: 'start',
    textVerticalAnchor: 'top',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onRefXChanged = (refX: number) => {
    this.setState({ refX }, () => {
      this.notifyChange()
    })
  }

  onRefYChanged = (refY: number) => {
    this.setState({ refY }, () => {
      this.notifyChange()
    })
  }

  onTextAnchorAlignChange = (e: any) => {
    this.setState(
      {
        textAnchor: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onTextVerticalAnchorAlignChange = (e: any) => {
    this.setState(
      {
        textVerticalAnchor: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card title="Attrs" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>refX</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.refX}
              onChange={this.onRefXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {(this.state.refX * 100).toFixed(0)}%
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>refY</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.refY}
              onChange={this.onRefYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {(this.state.refY * 100).toFixed(0)}%
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col>textAnchor</Col>
        </Row>
        <Row align="middle">
          <Col span={19} offset={5}>
            <Radio.Group
              onChange={this.onTextAnchorAlignChange}
              value={this.state.textAnchor}
            >
              <Radio value={'start'}>Start</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'end'}>end</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col>textVerticalAnchor</Col>
        </Row>
        <Row align="middle">
          <Col span={19} offset={5}>
            <Radio.Group
              onChange={this.onTextVerticalAnchorAlignChange}
              value={this.state.textVerticalAnchor}
            >
              <Radio value={'top'}>Top</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'bottom'}>Bottom</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
