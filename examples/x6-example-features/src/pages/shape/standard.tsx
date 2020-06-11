import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const rect = graph.addNode({
      type: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'rect',
      attrs: {
        root: {
          title: 'standard rectangle',
        },
        body: {
          fill: '#30d0c6',
          fillOpacity: 0.5,
        },
      },
    })

    console.log(rect)

    graph.addNode({
      type: 'circle',
      x: 180,
      y: 30,
      width: 60,
      height: 60,
      label: 'circle',
      attrs: {
        body: {
          fill: '#30d0c6',
          fillOpacity: 0.5,
        },
      },
    })

    graph.addNode({
      type: 'ellipse',
      x: 280,
      y: 30,
      width: 80,
      height: 60,
      label: 'ellipse',
      attrs: {
        body: {
          fill: '#30d0c6',
          fillOpacity: 0.5,
        },
      },
    })

    graph.addNode({
      type: 'path',
      x: 40,
      y: 120,
      width: 100,
      height: 80,
      label: 'path',
      path: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
      attrs: {
        body: {
          fill: '#30d0c6',
          fillOpacity: 0.5,
          // refD: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
        },
      },
    })

    graph.addNode({
      type: 'polygon',
      x: 170,
      y: 120,
      width: 80,
      height: 80,
      label: 'polygon',
      points: '0,10 10,0 20,10 10,20',
      attrs: {
        body: {
          fill: '#30d0c6',
          fillOpacity: 0.5,
          // refPoints: '0,10 10,0 20,10 10,20',
        },
      },
    })

    graph.addNode({
      type: 'polyline',
      x: 280,
      y: 120,
      width: 80,
      height: 80,
      label: 'polyline',
      attrs: {
        body: {
          fill: '#30d0c6',
          fillOpacity: 0.5,
          refPoints: '0,0 0,10 10,10 10,0',
        },
      },
    })

    graph.addNode({
      type: 'cylinder',
      x: 420,
      y: 30,
      width: 80,
      height: 180,
      label: 'cylinder',
      attrs: {
        top: {
          fill: '#fe854f',
          fillOpacity: 0.5,
        },
        body: {
          fill: '#fe854f',
          fillOpacity: 0.8,
        },
      },
    })

    graph.addNode({
      type: 'image',
      x: 40,
      y: 240,
      width: 120,
      height: 80,
      label: 'image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      type: 'image-bordered',
      x: 200,
      y: 240,
      width: 120,
      height: 80,
      label: 'bordered image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      type: 'image-embedded',
      x: 360,
      y: 240,
      width: 120,
      height: 80,
      label: 'embedded image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      type: 'image-inscribed',
      x: 520,
      y: 240,
      width: 120,
      height: 80,
      label: 'inscribed image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      type: 'text-block',
      x: 40,
      y: 380,
      width: 120,
      height: 80,
      attrs: {
        label: {
          text: 'Hyper Text Markup Language',
        },
      },
    })

    graph.addEdge({
      type: 'edge',
      source: { x: 450, y: 360 },
      target: { x: 400, y: 520 },
      vertices: [{ x: 450, y: 440 }],
    })

    graph.addEdge({
      type: 'shadow-edge',
      source: { x: 550, y: 360 },
      target: { x: 500, y: 520 },
      vertices: [{ x: 550, y: 440 }],
    })

    graph.addEdge({
      type: 'double-edge',
      source: { x: 500, y: 360 },
      target: { x: 450, y: 520 },
      vertices: [{ x: 500, y: 440 }],
    })

    console.log(graph.toJSON())
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
