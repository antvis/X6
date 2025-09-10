import React from 'react'
import { Slider, Card, Checkbox, Row, Col } from 'antd'

export class ScaleContentToFitCard extends React.Component<
  ScaleContentToFitCard.Props,
  ScaleContentToFitCard.State
> {
  state: ScaleContentToFitCard.State = {
    padding: 0,
    minScale: 0.1,
    maxScale: 3,
    gridSize: 0,
    preserveAspectRatio: true,
  }

  notifyChange() {
    this.props.onChange({ ...this.state })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => this.notifyChange())
  }

  onMinScaleChanged = (minScale: number) => {
    this.setState({ minScale }, () => this.notifyChange())
  }

  onMaxScaleChanged = (maxScale: number) => {
    this.setState({ maxScale }, () => this.notifyChange())
  }

  onGridSizeChanged = (gridSize: number) => {
    this.setState({ gridSize }, () => this.notifyChange())
  }

  onPreserveAspectRatioChanged = (e: any) => {
    this.setState({ preserveAspectRatio: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Scale Content To Fit"
        size="small"
        variant="outlined"
        style={{ width: 320 }}
      >
        <Row type="flex" align="middle">
          <Col span={8}>Padding</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={100}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Min Scale</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={1}
              step={0.1}
              value={this.state.minScale}
              onChange={this.onMinScaleChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.minScale}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Max Scale</Col>
          <Col span={12}>
            <Slider
              min={1}
              max={3}
              step={0.3}
              value={this.state.maxScale}
              onChange={this.onMaxScaleChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.maxScale}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Scale Grid</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={0.3}
              step={0.1}
              value={this.state.gridSize}
              onChange={this.onGridSizeChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.gridSize}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={18} offset={8}>
            <Checkbox
              checked={this.state.preserveAspectRatio}
              onChange={this.onPreserveAspectRatioChanged}
            >
              Preserve Aspect Ratio
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}

// eslint-disable-next-line
export namespace ScaleContentToFitCard {
  export interface Props {
    onChange: (options: State) => void
  }

  export interface State {
    padding: number
    minScale: number
    maxScale: number
    gridSize: number
    preserveAspectRatio: boolean
  }
}
