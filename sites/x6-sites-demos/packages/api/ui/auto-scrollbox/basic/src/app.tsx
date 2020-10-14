import React from 'react'
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
          <AutoScrollBox>
            <div
              style={{
                position: 'relative',
                width: 1200,
                height: 3000,
                cursor: 'grab',
                background:
                  'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
              }}
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
            </div>
          </AutoScrollBox>
        </div>
      </div>
    )
  }
}
