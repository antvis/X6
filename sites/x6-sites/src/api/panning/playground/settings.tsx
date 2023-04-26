import React from 'react'
import { Checkbox, Switch, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: boolean
  modifiers: string[]
  eventTypes: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    modifiers: [],
    eventTypes: ['leftMouseDown'],
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnabledChanged = (enabled: boolean) => {
    this.setState({ enabled }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: string[]) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
  }

  onEventTypesChange = (eventTypes: string[]) => {
    this.setState({ eventTypes }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Selection Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={14}>Enabled</Col>
          <Col span={10}>
            <Switch
              checked={this.state.enabled}
              onChange={this.onEnabledChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Modifier Key</Col>
          <Col span={16}>
            <Checkbox.Group
              options={['alt', 'ctrl', 'shift']}
              value={this.state.modifiers}
              onChange={this.onModifiersChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Event Type</Col>
          <Col span={16}>
            <Checkbox.Group
              options={[
                {
                  label: '左键',
                  value: 'leftMouseDown',
                },
                {
                  label: '右键',
                  value: 'rightMouseDown',
                },
                {
                  label: '滚轮',
                  value: 'mousewheel',
                },
              ]}
              value={this.state.eventTypes}
              onChange={this.onEventTypesChange}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}
