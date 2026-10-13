import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
/* eslint-disable no-new */
import React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components/es/split-box'


export default class Example extends React.Component {
  private container1: HTMLDivElement
  private container2: HTMLDivElement
  private container3: HTMLDivElement

  componentDidMount() {
    new Graph({
      container: this.container1,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    })

    new Graph({
      container: this.container2,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    })

    new Graph({
      container: this.container3,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.container1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.container2 = container
  }

  refContainer3 = (container: HTMLDivElement) => {
    this.container3 = container
  }

  render() {
    return (
      <div className="auto-resize-app">
        <SplitBox split="horizontal">
          <div className="full">
            <div ref={this.refContainer1} />
          </div>
          <SplitBox split="vertical">
            <div className="full">
              <div ref={this.refContainer2} />
            </div>
            <div className="full">
              <div ref={this.refContainer3} />
            </div>
          </SplitBox>
        </SplitBox>
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.x6-split-box-vertical > .x6-split-box-resizer {
  width: 4px;
  margin: 0 -2px;
  background: transparent;
}
.x6-split-box-horizontal > .x6-split-box-resizer {
  height: 4px;
  margin: -2px;
  background: transparent;
}
.x6-split-box-disabled > .x6-split-box-resizer {
  cursor: default;
}
.auto-resize-app {
  display: flex;
  width: 600px;
  height: 400px;
  padding: 0;
  font-family: sans-serif;
}
.auto-resize-app .app-content {
  flex: 1;
  height: 280px;
  margin-right: 8px;
  margin-left: 8px;
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1);
}
.auto-resize-app .full {
  width: 100%;
  height: 100%;
}
.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #e3e6e9;
}
`)
