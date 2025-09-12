import React from 'react'
import { Graph, Shape, Stencil } from '@antv/x6'
import '../index.less'
import './index.less'

export class StencilExample extends React.Component {
  private container: HTMLDivElement
  private stencilContainer: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 800,
      grid: {
        visible: true,
      },
    })

    graph.centerContent()

    graph.addNode({
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
      target: graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: 'group1',
        },
        {
          name: 'group2',
        },
      ],
    })

    this.stencilContainer.appendChild(stencil.container)

    var r = new Shape.Rect({
      position: { x: 10, y: 10 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    var c = new Shape.Circle({
      position: { x: 100, y: 10 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 8, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    var c2 = new Shape.Circle({
      position: { x: 10, y: 70 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 8, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    var r2 = new Shape.Rect({
      position: { x: 100, y: 70 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    var r3 = new Shape.Rect({
      position: { x: 10, y: 130 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    var c3 = new Shape.Circle({
      position: { x: 100, y: 130 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 8, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    stencil.load([r, c, c2, r2.clone()], 'group1')
    stencil.load([c2.clone(), r2, r3, c3], 'group2')
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
            height: 600,
          }}
        />
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
