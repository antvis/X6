import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  allowBlank: boolean
  allowMulti: boolean
  allowLoop: boolean
  allowNode: boolean
  allowEdge: boolean
  allowPort: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    allowBlank: true,
    allowMulti: true,
    allowLoop: true,
    allowNode: true,
    allowEdge: true,
    allowPort: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onAllowTypeChanged = (type: string, flag: boolean) => {
    const s = { [type]: flag } as any
    this.setState(s, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Connecting Settings"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowBlank}
              onChange={(e) =>
                this.onAllowTypeChanged('allowBlank', e.target.checked)
              }
            >
              AllowBlank
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowMulti}
              onChange={(e) =>
                this.onAllowTypeChanged('allowMulti', e.target.checked)
              }
            >
              AllowMulti
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowLoop}
              onChange={(e) =>
                this.onAllowTypeChanged('allowLoop', e.target.checked)
              }
            >
              AllowLoop
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowNode}
              onChange={(e) =>
                this.onAllowTypeChanged('allowNode', e.target.checked)
              }
            >
              AllowNode
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowEdge}
              onChange={(e) =>
                this.onAllowTypeChanged('allowEdge', e.target.checked)
              }
            >
              AllowEdge
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowPort}
              onChange={(e) =>
                this.onAllowTypeChanged('allowPort', e.target.checked)
              }
            >
              AllowPort
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
