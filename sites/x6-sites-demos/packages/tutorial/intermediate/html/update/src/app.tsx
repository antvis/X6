import React from 'react'
import { Graph, Shape, Color } from '@antv/x6'
import './app.css'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    const { color } = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.style.background = color
    return div
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const node = graph.addNode({
      shape: 'custom-html',
      x: 60,
      y: 100,
      data: {
        color: '#333232',
      },
    })

    setInterval(() => {
      node.setData({
        color: Color.random().toHex(),
      })
    }, 2000)

    graph.centerContent()
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
