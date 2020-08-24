import React from 'react'
import { Graph, Shape } from '@antv/x6'
import '../index.less'

Shape.Rect.define({
  shape: 'myRect',
  width: 80,
  height: 40,
  attrs: {
    body: {
      fill: '#AACCF7',
      stroke: '#5E9CEE',
    },
    label: {
      fill: '#333',
    },
  },
  data: {
    a: 1,
    b: 2,
    c: 3,
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
      async: true,
    })

    const rect = graph.addNode({
      x: 30,
      y: 30,
      label: 'hello',
      shape: 'myRect',
    })

    console.log(rect)
    console.log(rect.toJSON())
    console.log(rect.toJSON({ diff: true }))
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
