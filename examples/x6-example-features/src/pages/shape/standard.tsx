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

    graph.addNode({
      shape: 'rect',
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

    graph.addNode({
      shape: 'circle',
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
      shape: 'ellipse',
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
      shape: 'path',
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
      shape: 'polygon',
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
      shape: 'polyline',
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
      shape: 'cylinder',
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
      shape: 'image',
      x: 40,
      y: 240,
      width: 120,
      height: 80,
      label: 'image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      shape: 'image-bordered',
      x: 200,
      y: 240,
      width: 120,
      height: 80,
      label: 'bordered image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      shape: 'image-embedded',
      x: 360,
      y: 240,
      width: 120,
      height: 80,
      label: 'embedded image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      shape: 'image-inscribed',
      x: 520,
      y: 240,
      width: 120,
      height: 80,
      label: 'inscribed image',
      imageUrl: 'http://via.placeholder.com/120x80',
    })

    graph.addNode({
      shape: 'text-block',
      x: 40,
      y: 380,
      width: 120,
      height: 80,
      text: 'Hyper Text Markup Language',
    })

    graph.addEdge({
      shape: 'edge',
      source: { x: 450, y: 360 },
      target: { x: 400, y: 520 },
      vertices: [{ x: 450, y: 440 }],
    })

    graph.addEdge({
      shape: 'shadow-edge',
      source: { x: 550, y: 360 },
      target: { x: 500, y: 520 },
      vertices: [{ x: 550, y: 440 }],
    })

    graph.addEdge({
      shape: 'double-edge',
      source: { x: 500, y: 360 },
      target: { x: 450, y: 520 },
      vertices: [{ x: 500, y: 440 }],
    })

    graph.on('node:move', (args) => {
      console.log('node:move', args)
    })

    graph.on('node:moving', (args) => {
      console.log('node:moving', args)
    })

    graph.on('node:moved', (args) => {
      console.log('node:moved', args)
    })

    graph.on('edge:move', (args) => {
      console.log('edge:move', args)
    })

    graph.on('edge:moving', (args) => {
      console.log('edge:moving', args)
    })

    graph.on('edge:moved', (args) => {
      console.log('edge:moved', args)
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
