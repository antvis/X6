import React from 'react'
import { ScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <ScrollBox
          containerWidth={300}
          containerHeight={200}
          contentWidth={1200}
          contentHeight={3000}
          contentStyle={{
            position: 'relative',
            cursor: 'grab',
            background:
              'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
          }}
          containerStyle={{ border: '1px solid #f0f0f0' }}
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
    )
  }
}
