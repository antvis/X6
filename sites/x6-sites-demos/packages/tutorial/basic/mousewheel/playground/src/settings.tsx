import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  fixed: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    fixed: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onFixedChanged = (e: any) => {
    this.setState({ fixed: e.target.checked }, () => {
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
            <Checkbox checked={this.state.fixed} onChange={this.onFixedChanged}>
              Zoom at Mouse Postion
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
