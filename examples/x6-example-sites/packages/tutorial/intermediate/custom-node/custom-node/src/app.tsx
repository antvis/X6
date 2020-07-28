import React from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6/es/index.css'
import './app.css'

Graph.registerNode(
  'custom-rect',
  {
    inherit: 'rect',
    width: 300,
    height: 40,
    attrs: {
      body: {
        rx: 10, // 圆角矩形
        ry: 10,
        strokeWidth: 1,
        stroke: '#5755a1',
        fill: '#5755a1',
      },
      label: {
        textAnchor: 'left', // 左对齐
        refX: 10, // x 轴偏移量
        fill: '#ffffff',
        fontSize: 18,
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    graph.addNode({
      x: 40,
      y: 40,
      shape: 'custom-rect',
      label: 'Custom Rectangle',
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
