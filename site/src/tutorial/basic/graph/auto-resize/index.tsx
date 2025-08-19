/* eslint-disable no-new */
import React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './index.less'

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
