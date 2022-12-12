import React from 'react'
import { Checkbox, Switch, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  multiple: boolean
  rubberband: boolean
  strict: boolean
  movable: boolean
  modifiers: string[]
  filter?: string[]
  content: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    multiple: true,
    rubberband: true,
    movable: true,
    strict: false,
    modifiers: [],
    content: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onMultipleChanged = (multiple: boolean) => {
    this.setState({ multiple }, () => {
      this.notifyChange()
    })
  }

  onMovableChanged = (movable: boolean) => {
    this.setState({ movable }, () => {
      this.notifyChange()
    })
  }

  onRubberbandChanged = (rubberband: boolean) => {
    this.setState({ rubberband }, () => {
      this.notifyChange()
    })
  }

  onStrictChanged = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: any) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
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

  onContentChanged = (e: any) => {
    this.setState({ content: e.target.checked }, () => {
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
          <Col span={14}>Enable Multiple Select</Col>
          <Col span={10}>
            <Switch
              checked={this.state.multiple}
              onChange={this.onMultipleChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Selection Movable</Col>
          <Col span={10}>
            <Switch
              checked={this.state.movable}
              onChange={this.onMovableChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={14}>Enable Rubberband</Col>
          <Col span={10}>
            <Switch
              checked={this.state.rubberband}
              onChange={this.onRubberbandChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Is Strict Contains</Col>
          <Col span={10}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChanged}
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
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add filter (only circle)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.content}
              onChange={this.onContentChanged}
            >
              Add content(display selected count)
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
