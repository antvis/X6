import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import styles from './index.less'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  offset: number
  useLocalStorage: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    offset: 30,
    useLocalStorage: true,
  }

  componentDidMount() {
    this.notifyChange()
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onUseLocalStorageChanged = (e: any) => {
    this.setState({ useLocalStorage: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Clipboard Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Paste Offset</Col>
          <Col span={2} offset={1}>
            <div className={styles['slider-value']}>{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={10}
              max={80}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.useLocalStorage}
              onChange={this.onUseLocalStorageChanged}
            >
              Use LocalStorage
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
