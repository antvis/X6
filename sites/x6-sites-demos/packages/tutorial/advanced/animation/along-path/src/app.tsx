import React from 'react'
import { Graph, Vector } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const cylinder = graph.addNode({
      shape: 'cylinder',
      x: 80,
      y: 80,
      width: 160,
      height: 120,
      label: 'cylinder',
    })

    const view = graph.findViewByCell(cylinder)
    if (view) {
      const path = view.findOne('path') as SVGPathElement
      if (path) {
        const token = Vector.create('circle', { r: 8, fill: 'red' })
        token.animateAlongPath(
          {
            dur: '4s',
            repeatCount: 'indefinite',
          },
          path,
        )

        token.appendTo(path.parentNode as SVGGElement)
      }
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
