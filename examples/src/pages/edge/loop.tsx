import React from 'react'
import { Graph } from '../../../../src'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 800,
      grid: true,
      connecting: {
        connectionPoint: {
          name: 'boundary',
          args: { extrapolate: true },
        },
      },
    })

    graph.addEdge({
      source: [100, 100],
      target: [100, 100],
      router: {
        name: 'loop',
        args: {
          angle: 0,
        },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: [100, 100],
      target: [100, 100],
      router: {
        name: 'loop',
        args: {
          angle: 0,
        },
      },
      attrs: {
        line: {
          targetMarker: null,
          strokeWidth: 1,
          strokeDasharray: '5 3',
        },
      },
    })

    const rect1 = graph.addNode({
      x: 160,
      y: 200,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: 'red',
        },
      },
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'topLeft' },
      target: { cell: rect1, anchor: 'top' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'top' },
      target: { cell: rect1, anchor: 'topRight' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'topRight' },
      target: { cell: rect1, anchor: 'right' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'right' },
      target: { cell: rect1, anchor: 'bottomRight' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'bottomRight' },
      target: { cell: rect1, anchor: 'bottom' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'bottom' },
      target: { cell: rect1, anchor: 'bottomLeft' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'bottomLeft' },
      target: { cell: rect1, anchor: 'left' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect1, anchor: 'left' },
      target: { cell: rect1, anchor: 'topLeft' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    const rect2 = graph.addNode({
      x: 500,
      y: 160,
      width: 100,
      height: 100,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: 'red',
        },
      },
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'top' },
      target: { cell: rect2, anchor: 'top' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'right' },
      target: { cell: rect2, anchor: 'right' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'bottom' },
      target: { cell: rect2, anchor: 'bottom' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'left' },
      target: { cell: rect2, anchor: 'left' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'topLeft' },
      target: { cell: rect2, anchor: 'topLeft' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'topRight' },
      target: { cell: rect2, anchor: 'topRight' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'bottomRight' },
      target: { cell: rect2, anchor: 'bottomRight' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: rect2, anchor: 'bottomLeft' },
      target: { cell: rect2, anchor: 'bottomLeft' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    const circle1 = graph.addNode({
      x: 160,
      y: 400,
      width: 100,
      height: 100,
      shape: 'circle',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: 'red',
        },
      },
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'topLeft' },
      target: { cell: circle1, anchor: 'top' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'top' },
      target: { cell: circle1, anchor: 'topRight' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'topRight' },
      target: { cell: circle1, anchor: 'right' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'right' },
      target: { cell: circle1, anchor: 'bottomRight' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'bottomRight' },
      target: { cell: circle1, anchor: 'bottom' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'bottom' },
      target: { cell: circle1, anchor: 'bottomLeft' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'bottomLeft' },
      target: { cell: circle1, anchor: 'left' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle1, anchor: 'left' },
      target: { cell: circle1, anchor: 'topLeft' },
      router: {
        name: 'loop',
      },
      connector: 'loop',
    })

    const circle2 = graph.addNode({
      x: 500,
      y: 400,
      width: 100,
      height: 100,
      shape: 'circle',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: 'red',
        },
      },
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'top' },
      target: { cell: circle2, anchor: 'top' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'right' },
      target: { cell: circle2, anchor: 'right' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'bottom' },
      target: { cell: circle2, anchor: 'bottom' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'left' },
      target: { cell: circle2, anchor: 'left' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'topLeft' },
      target: { cell: circle2, anchor: 'topLeft' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: {
        cell: circle2,
        anchor: {
          name: 'topRight',
        },
      },
      target: {
        cell: circle2,
        anchor: {
          name: 'topRight',
        },
      },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'bottomRight' },
      target: { cell: circle2, anchor: 'bottomRight' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: 'loop',
    })

    graph.addEdge({
      source: { cell: circle2, anchor: 'bottomLeft' },
      target: { cell: circle2, anchor: 'bottomLeft' },
      router: {
        name: 'loop',
        args: { merge: true },
      },
      connector: {
        name: 'loop',
      },
    })

    const circle3 = graph.addNode({
      x: 360,
      y: 640,
      width: 80,
      height: 80,
      shape: 'circle',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: 'red',
        },
      },
    })

    const edge = graph.addEdge({
      source: { cell: circle3 },
      target: { cell: circle3 },
      router: {
        name: 'loop',
        args: {
          angle: 0,
          merge: 0,
          width: 100,
          height: 100,
        },
      },
      connector: {
        name: 'loop',
      },
    })

    const pathAngle = 'router/args/angle'
    const pathMerge = 'router/args/merge'
    const animateAngle = () => {
      edge.prop(pathAngle, 0)
      edge.transition(pathAngle, 360, {
        duration: 5000,
        start(options) {
          console.log('rotate:start', options)
        },
        progress(options) {
          console.log('rotate:progress', options)
        },
        complete(options) {
          console.log('rotate:complete', options)
          animateAngle()
        },
        always(options) {
          console.log('rotate:finish', options)
        },
      })
    }

    const animateMerge = () => {
      edge.prop(pathMerge, 0)
      edge.transition(pathMerge, 20, {
        duration: 1000,
        complete() {
          animateMerge()
        },
      })
    }

    animateAngle()
    animateMerge()
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
