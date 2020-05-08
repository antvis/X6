import React from 'react'
import { Graph } from '@antv/x6'
import { Stencil } from '@antv/x6/es/addon'
import { Rect, Circle } from '@antv/x6/es/shape/basic'
import '../index.less'
import './index.less'
import '../../../../../packages/x6/src/addon/stencil/index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private stencilContainer: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 1,
    })

    graph.addNode({
      type: 'rect',
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'rect',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    const stencil = new Stencil({
      graph: graph,
      width: 200,
      height: 300,
      gridSize: 1,
    })

    this.stencilContainer.appendChild(stencil.container)

    var r = new Rect({
      position: { x: 10, y: 10 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    var c = new Circle({
      position: { x: 100, y: 10 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 8, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    var c2 = new Circle({
      position: { x: 10, y: 70 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 8, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    var r2 = new Rect({
      position: { x: 100, y: 70 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    var r3 = new Rect({
      position: { x: 10, y: 130 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    var c3 = new Circle({
      position: { x: 100, y: 130 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 8, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    stencil.load([r, c, c2, r2, r3, c3])
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Default Settings</h1>
        <div
          ref={this.refStencil}
          style={{
            position: 'absolute',
            left: 32,
            top: 40,
            width: 200,
            height: 300,
          }}
        />
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

export namespace Example {
  export interface Props {}

  export interface State {}
}
