import React from 'react'
import { Slider, Card, Select, Row, Col } from 'antd'

export class FitToContentCard extends React.Component<
  FitToContentCard.Props,
  FitToContentCard.State
> {
  state: FitToContentCard.State = {
    padding: 0,
    gridWidth: 1,
    gridHeight: 1,
    allowNewOrigin: 'any',
  }

  notifyChange() {
    this.props.onChange({ ...this.state })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => this.notifyChange())
  }

  onGridWidthChanged = (gridWidth: number) => {
    this.setState({ gridWidth }, () => this.notifyChange())
  }

  onGridHeightChanged = (gridHeight: number) => {
    this.setState({ gridHeight }, () => this.notifyChange())
  }

  onAllowOriginChanged = (allowNewOrigin: any) => {
    this.setState({ allowNewOrigin }, () => this.notifyChange())
  }

  render() {
    return (
      <Card
        title="Fit To Content"
        size="small"
        bordered={false}
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
          <Col span={8}>Grid Width</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={100}
              step={1}
              value={this.state.gridWidth}
              onChange={this.onGridWidthChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.gridWidth}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>Grid Height</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={100}
              step={1}
              value={this.state.gridHeight}
              onChange={this.onGridHeightChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.gridHeight}</div>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={11}>Allow New Origin</Col>
          <Col span={11}>
            <Select
              style={{ width: '100%' }}
              value={this.state.allowNewOrigin || ''}
              onChange={this.onAllowOriginChanged}
            >
              <Select.Option value="">Don't allow</Select.Option>
              <Select.Option value="negative">Negative</Select.Option>
              <Select.Option value="positive">Positive</Select.Option>
              <Select.Option value="any">Any</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>
    )
  }
}

// eslint-disable-next-line
export namespace FitToContentCard {
  export interface Props {
    onChange: (options: State) => void
  }

  export interface State {
    padding: number
    gridWidth: number
    gridHeight: number
    allowNewOrigin?: 'negative' | 'positive' | 'any'
  }
}
