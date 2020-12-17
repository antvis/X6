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

    const rect1 = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
    })

    const view1 = graph.findView(rect1)
    if (view1) {
      view1.animate('rect', {
        attributeType: 'XML',
        attributeName: 'x',
        from: 40,
        to: 120,
        dur: '1s',
        repeatCount: 'indefinite',
      })
    }

    const rect2 = graph.addNode({
      x: 280,
      y: 40,
      width: 100,
      height: 40,
      attrs: {
        rect: {
          fill: null,
          class: 'rect-bg',
        },
      },
    })
    const view2 = graph.findView(rect2)
    if (view2) {
      view2.animate('rect', {
        attributeType: 'CSS',
        attributeName: 'fill',
        from: 'red',
        to: 'green',
        dur: '1s',
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
