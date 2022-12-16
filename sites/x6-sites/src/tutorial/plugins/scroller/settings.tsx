import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import styles from './index.less'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  pannable: boolean
  pageVisible: boolean
  pageBreak: boolean
  autoResize: boolean
  minVisibleWidth: number
  minVisibleHeight: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    pannable: true,
    pageVisible: true,
    pageBreak: true,
    autoResize: true,
    minVisibleWidth: 50,
    minVisibleHeight: 50,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPanningChanged = (e: any) => {
    this.setState({ pannable: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onAutoResizeChanged = (e: any) => {
    this.setState({ autoResize: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageVisibleChanged = (e: any) => {
    this.setState({ pageVisible: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageBreakChanged = (e: any) => {
    this.setState({ pageBreak: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleWidthChanged = (minVisibleWidth: number) => {
    this.setState({ minVisibleWidth }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleHeightChanged = (minVisibleHeight: number) => {
    this.setState({ minVisibleHeight }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Scroller Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pannable}
              onChange={this.onPanningChanged}
            >
              Enable Panning
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.autoResize}
              onChange={this.onAutoResizeChanged}
            >
              Enable Auto Resize
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageVisible}
              onChange={this.onPageVisibleChanged}
            >
              Show Page
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageBreak}
              onChange={this.onPageBreakChanged}
            >
              Show Page Break
            </Checkbox>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Width
          </Col>
          <Col span={2} offset={1}>
            <div className={styles['slider-value']}>
              {this.state.minVisibleWidth}
            </div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleWidth}
              onChange={this.onMinVisibleWidthChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Height
          </Col>
          <Col span={2} offset={1}>
            <div className={styles['slider-value']}>
              {this.state.minVisibleHeight}
            </div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleHeight}
              onChange={this.onMinVisibleHeightChanged}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}
