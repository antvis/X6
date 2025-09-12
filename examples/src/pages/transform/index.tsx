import React from 'react'
import { Graph, Transform } from '@antv/x6'
import '../index.less'

export class TransformExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: 1,
    })

    graph.use(
      new Transform({
        resizing: {
          enabled: true,
        },
        rotating: true,
      }),
    )

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    graph.on('node:resize', (args) => {
      console.log('node:resize', args)
    })

    graph.on('node:resizing', (args) => {
      console.log('node:resizing', args)
    })

    graph.on('node:resized', (args) => {
      console.log('node:resized', args)
    })

    graph.on('node:rotate', (args) => {
      console.log('node:rotate', args)
    })

    graph.on('node:rotating', (args) => {
      console.log('node:rotating', args)
    })

    graph.on('node:rotated', (args) => {
      console.log('node:rotated', args)
    })
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
