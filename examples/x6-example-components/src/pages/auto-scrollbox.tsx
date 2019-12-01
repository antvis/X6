import React from 'react'
import { AutoScrollBox } from '@antv/x6-components'

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
          <div style={{ width: 300, height: 200, border: '1px solid #1890ff' }}>
            <AutoScrollBox>
              <div style={{ position: 'relative', width: 1200, height: 3000 }}>
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
              </div>
            </AutoScrollBox>
          </div>
        </div>
      </div>
    )
  }
}
