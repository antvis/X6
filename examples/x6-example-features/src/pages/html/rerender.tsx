import React from 'react'
import { Graph, Cell } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const node = graph.addNode({
      shape: 'html',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      data: {
        time: new Date().toString(),
      },
      html: {
        component(node: Cell) {
          const data = node.getData() as any
          return `<div>
              <span>${data.time}</span>
            </div>`
        },
        rerender(node: Cell) {
          return node.hasChanged('data')
        },
      },
    })

    const change = () => {
      setTimeout(() => {
        node.setData({
          time: new Date().toString(),
        })
        change()
      }, 1000)
    }

    change()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
