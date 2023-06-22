import React from 'react'
import { Graph, Interp } from '@antv/x6'
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

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 200, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 400, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.transition(
        'source',
        { x: 100, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 500, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 300, y: 60 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

    contract()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (oscillateToggle) {
          oscillate()
        } else {
          contract()
        }
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
