import React from 'react'
import { ScrollBox } from '@antv/x6-components'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          <ScrollBox
            containerWidth={300}
            containerHeight={200}
            contentWidth={1200}
            contentHeight={3000}
            contentStyle={{ position: 'relative' }}
            containerStyle={{ border: '1px solid #1890ff' }}
          >
            <div style={{ position: 'absolute', top: 8, left: 8 }}>
              Top-Left-Corner
            </div>
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              Top-Right-Corner
            </div>
            <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
              Bottom-Left-Corner
            </div>
            <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
              Bottom-Right-Corner
            </div>
          </ScrollBox>
        </div>
      </div>
    )
  }
}
