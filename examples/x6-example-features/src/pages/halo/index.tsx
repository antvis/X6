import React from 'react'
import { Graph } from '@antv/x6'
import { Halo } from '@antv/x6/es/addon/halo'
import '../index.less'
import '../../../../../packages/x6/src/addon/halo/index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: 1,
    })

    graph.addNode({
      shape: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      shape: 'circle',
      x: 250,
      y: 80,
      width: 50,
      height: 50,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      shape: 'ellipse',
      x: 350,
      y: 150,
      width: 80,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    graph.on('node:resize', args => {
      console.log('node:resize', args)
    })

    graph.on('node:resizing', args => {
      console.log('node:resizing', args)
    })

    graph.on('node:resized', args => {
      console.log('node:resized', args)
    })

    graph.on('node:rotate', args => {
      console.log('node:rotate', args)
    })

    graph.on('node:rotating', args => {
      console.log('node:rotating', args)
    })

    graph.on('node:rotated', args => {
      console.log('node:rotated', args)
    })

    graph.on('node:mouseup', ({ view }) => {
      const halo = new Halo({
        view,
        // type: 'toolbar',
        // pie: { sliceAngle: 360 / 7 },
      })

      console.log(halo)
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
