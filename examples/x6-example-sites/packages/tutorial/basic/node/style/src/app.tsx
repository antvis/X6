import React from 'react'
import { Graph, Shape } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect = new Shape.Rect({
      x: 80,
      y: 40,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#2ECC71', // 背景颜色
          stroke: '#000', // 边框颜色
        },
        label: {
          text: 'rect', // 文本
          fill: '#333', // 文字颜色
          fontSize: 13, // 文字大小
        },
      },
    })

    graph.addNode(rect)
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
