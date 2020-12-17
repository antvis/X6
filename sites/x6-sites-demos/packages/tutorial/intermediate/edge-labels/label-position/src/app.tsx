import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      background: {
        color: 'rgba(0, 255, 0, 0.3)',
      },
    })

    const edge = graph.addEdge({
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '0.25',
        },
      },
      position: {
        distance: 0.25,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '150',
        },
      },
      position: {
        distance: 150,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '-100',
        },
      },
      position: {
        distance: -100,
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 130, y: 80 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 330, y: 80 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
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
        { x: 30, y: 160 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 230, y: 80 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 430, y: 160 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

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

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
