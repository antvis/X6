import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  tolerance: number
  sharp: boolean
  resizing: boolean
  className?: string
  filter?: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    tolerance: 10,
    sharp: false,
    resizing: false,
  }

  tryToJSON(val: string) {
    try {
      return JSON.parse(val)
    } catch (error) {
      return val
    }
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onSharpChanged = (e: any) => {
    this.setState({ sharp: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onResingChanged = (e: any) => {
    this.setState({ resizing: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onToleranceChanged = (tolerance: number) => {
    this.setState({ tolerance }, () => {
      this.notifyChange()
    })
  }

  onClassNameChanged = (e: any) => {
    this.setState(
      {
        className: e.target.checked ? 'my-snapline' : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onFilterChanged = (e: any) => {
    this.setState(
      {
        filter: e.target.checked ? ['circle'] : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card
        title="Snapline Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Tolerance</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.tolerance}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.tolerance}
              onChange={this.onToleranceChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.sharp} onChange={this.onSharpChanged}>
              Sharp Line
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.resizing}
              onChange={this.onResingChanged}
            >
              Snap on Resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.className != null}
              onChange={this.onClassNameChanged}
            >
              Add Custom ClassName(my-snapline)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add Filter(Exclude circle)
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
