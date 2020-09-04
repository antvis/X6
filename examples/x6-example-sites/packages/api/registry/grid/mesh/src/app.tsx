import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    new Graph({
      container: this.container,
      grid: {
        visible: true,
        type: 'mesh',
        args: {
          color: '#ddd', // 网格线/点颜色
          thickness: 1, // 网格线宽度/网格点大小
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
