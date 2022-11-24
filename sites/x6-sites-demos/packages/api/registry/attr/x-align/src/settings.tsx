import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  refX: number
  refY: number
  xAlign?: string
  yAlign?: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    refX: 0.5,
    refY: 0.5,
    xAlign: 'left',
    yAlign: 'top',
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

  onXAlignChange = (e: any) => {
    this.setState(
      {
        xAlign: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onYAlignChange = (e: any) => {
    this.setState(
      {
        yAlign: e.target.value,
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
          <Col span={5}>xAlign</Col>
          <Col span={19}>
            <Radio.Group
              onChange={this.onXAlignChange}
              value={this.state.xAlign}
            >
              <Radio value={'left'}>Left</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'right'}>Right</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>yAlign</Col>
          <Col span={19}>
            <Radio.Group
              onChange={this.onYAlignChange}
              value={this.state.yAlign}
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
