import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  scale: number
  tx: number
  ty: number
  scrollLeft: number
  scrollTop: number
}

export const defaults: State = {
  scale: 0.5,
  tx: 20,
  ty: 20,
  scrollLeft: 50,
  scrollTop: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  componentDidMount() {
    document.addEventListener('scroll', () => {
      this.setState({
        scrollLeft: window.scrollX,
        scrollTop: window.scrollY,
      })
    })
  }

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

  onScrollLeftChanged = (scrollX: number) => {
    this.setState({ scrollLeft: scrollX }, () => {
      this.notifyChange()
    })
  }

  onScrollTopChanged = (scrollY: number) => {
    this.setState({ scrollTop: scrollY }, () => {
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
        <Row align="middle">
          <Col span={7}>scrollLeft</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={document.body.scrollWidth - document.body.clientWidth}
              step={1}
              value={this.state.scrollLeft}
              onChange={this.onScrollLeftChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scrollLeft}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>scrollTop</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={document.body.scrollHeight - document.body.clientHeight}
              step={1}
              value={this.state.scrollTop}
              onChange={this.onScrollTopChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scrollTop}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
