import React from 'react'
import { Card } from 'antd'

export class BBoxCard extends React.Component<GridCard.Props> {
  render() {
    return (
      <Card
        title="Content Boundary Box"
        size="small"
        variant="outlined"
        style={{ width: 320 }}
      >
        <div style={{ fontSize: 12, textAlign: 'center' }}>
          x
          <div className="slider-value" style={{ marginRight: 8 }}>
            {this.props.x}
          </div>
          y
          <div className="slider-value" style={{ marginRight: 8 }}>
            {this.props.y}
          </div>
          width
          <div className="slider-value" style={{ marginRight: 8 }}>
            {this.props.width}
          </div>
          height
          <div className="slider-value" style={{ marginRight: 8 }}>
            {this.props.height}
          </div>
        </div>
      </Card>
    )
  }
}

// eslint-disable-next-line
export namespace GridCard {
  export interface Props {
    x: number
    y: number
    width: number
    height: number
  }
}
