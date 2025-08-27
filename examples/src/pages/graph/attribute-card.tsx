import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export class AttributeCard extends React.Component<
  AttributeCard.Props,
  AttributeCard.State
> {
  constructor(props: AttributeCard.Props) {
    super(props)
    this.state = { ...props.attrs }
  }

  static getDerivedStateFromProps(props: AttributeCard.Props) {
    return { ...props.attrs }
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      console.log(width)
      this.props.onSizeChange(width, this.state.height)
    })
  }

  onHeightChanged = (height: number) => {
    this.setState({ height }, () => {
      this.props.onSizeChange(this.state.width, height)
    })
  }

  onOriginXChanged = (originX: number) => {
    this.setState({ originX }, () => {
      this.props.onOriginChange(originX, this.state.originY)
    })
  }

  onOriginYChanged = (originY: number) => {
    this.setState({ originY }, () => {
      this.props.onOriginChange(this.state.originX, originY)
    })
  }

  onScaleXChanged = (scaleX: number) => {
    this.setState({ scaleX }, () => {
      this.props.onScaleChange(scaleX, this.state.scaleY)
    })
  }

  onScaleYChanged = (scaleY: number) => {
    this.setState({ scaleY }, () => {
      this.props.onScaleChange(this.state.scaleX, scaleY)
    })
  }

  render() {
    return (
      <Card
        title="Attribute"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row type="flex" align="middle">
          <Col span={8}>Width</Col>
          <Col span={12}>
            <Slider
              min={100}
              max={1200}
              step={1}
              value={this.state.width}
              onChange={this.onWidthChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.width.toFixed(0)}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Height</Col>
          <Col span={12}>
            <Slider
              min={100}
              max={1200}
              step={1}
              value={this.state.height}
              onChange={this.onHeightChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.height.toFixed(0)}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Origin X</Col>
          <Col span={12}>
            <Slider
              min={-200}
              max={200}
              step={1}
              value={this.state.originX}
              onChange={this.onOriginXChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.originX.toFixed(0)}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Origin Y</Col>
          <Col span={12}>
            <Slider
              min={-200}
              max={200}
              step={1}
              value={this.state.originY}
              onChange={this.onOriginYChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.originY.toFixed(0)}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Scale X</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={3}
              step={0.1}
              value={this.state.scaleX}
              onChange={this.onScaleXChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.scaleX.toFixed(2)}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Scale Y</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={3}
              step={0.1}
              value={this.state.scaleY}
              onChange={this.onScaleYChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.scaleY.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}

// eslint-disable-next-line
export namespace AttributeCard {
  export interface Props {
    attrs: {
      width: number
      height: number
      originX: number
      originY: number
      scaleX: number
      scaleY: number
    }
    onSizeChange: (width: number, height: number) => void
    onOriginChange: (ox: number, oy: number) => void
    onScaleChange: (sx: number, sy: number) => void
  }

  export interface State {
    width: number
    height: number
    originX: number
    originY: number
    scaleX: number
    scaleY: number
  }
}
