import React from 'react'
import { Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'left',
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
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
        <Row align="middle" justify="center">
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'left'}>
                left
              </Radio>
              <Radio style={radioStyle} value={'right'}>
                right
              </Radio>
              <Radio style={radioStyle} value={'top'}>
                top
              </Radio>
              <Radio style={radioStyle} value={'bottom'}>
                bottom
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
