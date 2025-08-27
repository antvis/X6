import React from 'react'
import { Graph, Cell, Shape } from '../../../../src'
import '../index.less'
import './index.less'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell: Cell) {
    const data = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.innerHTML = data.time
    return div
  },
})
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
      shape: 'custom-html',
      x: 80,
      y: 80,
      data: {
        time: Date.now(),
      },
    })
    console.log(graph.toJSON())

    const change = () => {
      setTimeout(() => {
        node.setData({
          time: Date.now(),
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
