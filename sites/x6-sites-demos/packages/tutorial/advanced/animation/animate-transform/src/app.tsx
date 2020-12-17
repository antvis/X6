import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect = graph.addNode({
      x: 60,
      y: 60,
      width: 30,
      height: 30,
    })

    const view = graph.findView(rect)
    if (view) {
      view.animateTransform('rect', {
        attributeType: 'XML',
        attributeName: 'transform',
        type: 'rotate',
        from: '0 0 0',
        to: '360 0 0',
        dur: '3s',
        repeatCount: 'indefinite',
      })
    }
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
