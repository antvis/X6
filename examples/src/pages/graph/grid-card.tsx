import React from 'react'
import { Input, Select, Slider, Card, Row, Col } from 'antd'
import { GridNativeNames } from '../../../../src/registry'

export class GridCard extends React.Component<GridCard.Props, GridCard.State> {
  state: GridCard.State = {
    type: 'dot',
    size: 10,
    color: '#aaaaaa',
    thickness: 1,
    colorSecond: '#888888',
    thicknessSecond: 3,
    factor: 4,
  }

  notifyChange() {
    if (this.state.type === 'doubleMesh') {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
          {
            color: this.state.colorSecond,
            thickness: this.state.thicknessSecond,
            factor: this.state.factor,
          },
        ],
      })
    } else {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
        ],
      })
    }
  }

  onTypeChanged = (type: GridNativeNames) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.props.onGridSizeChange(this.state.size)
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onSecondaryColorChanged = (e: any) => {
    this.setState({ colorSecond: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onThicknessChanged = (thickness: number) => {
    this.setState({ thickness }, () => {
      this.notifyChange()
    })
  }

  onSecondaryThicknessChanged = (thicknessSecond: number) => {
    this.setState({ thicknessSecond }, () => {
      this.notifyChange()
    })
  }

  onFactorChanged = (factor: number) => {
    this.setState({ factor }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Grid" size="small" bordered={false} style={{ width: 320 }}>
        <Row type="flex" align="middle">
          <Col span={6}>Grid Type</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={this.state.type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="dot">Dot</Select.Option>
              <Select.Option value="fixedDot">Fixed Dot</Select.Option>
              <Select.Option value="mesh">Mesh</Select.Option>
              <Select.Option value="doubleMesh">Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={6}>Grid Size</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        {this.state.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row type="flex" align="middle">
              <Col span={6}>Primary Color</Col>
              <Col span={14}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col span={6}>Primary Thickness</Col>
              <Col span={14}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col span={6}>Secondary Color</Col>
              <Col span={14}>
                <Input
                  type="color"
                  value={this.state.colorSecond}
                  style={{ width: '100%' }}
                  onChange={this.onSecondaryColorChanged}
                />
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col span={6}>Secondary Thickness</Col>
              <Col span={14}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thicknessSecond}
                  onChange={this.onSecondaryThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thicknessSecond.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col span={6}>Scale Factor</Col>
              <Col span={14}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={this.state.factor}
                  onChange={this.onFactorChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">{this.state.factor}</div>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row type="flex" align="middle">
              <Col span={6}>Grid Color</Col>
              <Col span={14}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col span={6}>Thickness</Col>
              <Col span={14}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Card>
    )
  }
}

// eslint-disable-next-line
export namespace GridCard {
  export interface Props {
    onGridSizeChange: (size: number) => void
    onChange: (res: any) => void
  }

  export interface State {
    type: any
    size: number
    color: string
    thickness: number
    colorSecond: string
    thicknessSecond: number
    factor: number
  }
}
