import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'outside',
    offset: 15,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'inside'}>
                inside
              </Radio>
              <Radio style={radioStyle} value={'outside'}>
                outside
              </Radio>
              <Radio style={radioStyle} value={'insideOriented'}>
                insideOriented
              </Radio>
              <Radio style={radioStyle} value={'outsideOriented'}>
                outsideOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={30}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
