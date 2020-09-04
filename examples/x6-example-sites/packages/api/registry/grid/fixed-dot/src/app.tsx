import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
        size: 10,
        type: 'fixedDot',
        args: {
          color: '#a0a0a0', // 网格线/点颜色
          thickness: 2, // 网格线宽度/网格点大小
        },
      },
    })

    graph.scale(10, 10)
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
