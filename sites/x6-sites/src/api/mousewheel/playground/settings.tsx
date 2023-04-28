import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  zoomAtMousePosition: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    zoomAtMousePosition: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onFixedChanged = (e: any) => {
    this.setState({ zoomAtMousePosition: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="MouseWheel Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.zoomAtMousePosition}
              onChange={this.onFixedChanged}
            >
              Zoom at Mouse Postion
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
