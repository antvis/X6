import React from 'react'
import { Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'center',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
