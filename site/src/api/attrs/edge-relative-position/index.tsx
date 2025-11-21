import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

Graph.registerEdge(
  'custom-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
      },
      {
        tagName: 'path',
        selector: 'arrowhead',
      },
      {
        tagName: 'path',
        selector: 'symbol',
      },
    ],
    attrs: {
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
        sourceMarker: {
          tagName: 'circle',
          r: 4,
          fill: 'white',
          stroke: '#8f8f8f',
          strokeWidth: 2,
        },
        targetMarker: {
          tagName: 'circle',
          r: 4,
          fill: 'white',
          stroke: '#8f8f8f',
          strokeWidth: 2,
        },
      },
      arrowhead: {
        d: 'M -20 -10 0 0 -20 10 Z',
        fill: '#8f8f8f',
        stroke: 'none',
      },
      symbol: {
        d: 'M -20 -20 20 20',
        stroke: '#8f8f8f',
        targetMarker: {
          type: 'path',
          d: 'M 0 0 10 -5 10 5 Z',
          fill: '#8f8f8f',
          stroke: 'none',
        },
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const edge = graph.addEdge({
      shape: 'custom-edge',
      source: { x: 100, y: 60 },
      target: { x: 500, y: 60 },
      vertices: [{ x: 300, y: 160 }],
      attrs: {
        symbol: {
          atConnectionRatio: 0.75,
        },
        arrowhead: {
          atConnectionLength: 100,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 200,
          'source/y': 100,
          'target/x': 400,
          'target/y': 100,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 100,
          'source/y': 200,
          'target/x': 500,
          'target/y': 200,
          'vertices/0/x': 300,
          'vertices/0/y': 60,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    contract()

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-edge-relative-position-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
