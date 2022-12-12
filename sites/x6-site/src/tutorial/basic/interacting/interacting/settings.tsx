import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  nodeMovable: boolean
  magnetConnectable: boolean
  edgeMovable: boolean
  edgeLabelMovable: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    nodeMovable: false,
    magnetConnectable: false,
    edgeMovable: false,
    edgeLabelMovable: false,
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
              checked={this.state.nodeMovable}
              onChange={(e) =>
                this.onAllowTypeChanged('nodeMovable', e.target.checked)
              }
            >
              nodeMovable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.magnetConnectable}
              onChange={(e) =>
                this.onAllowTypeChanged('magnetConnectable', e.target.checked)
              }
            >
              magnetConnectable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.edgeMovable}
              onChange={(e) =>
                this.onAllowTypeChanged('edgeMovable', e.target.checked)
              }
            >
              edgeMovable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.edgeLabelMovable}
              onChange={(e) =>
                this.onAllowTypeChanged('edgeLabelMovable', e.target.checked)
              }
            >
              edgeLabelMovable
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
