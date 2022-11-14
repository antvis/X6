import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: 'green',
            strokeWidth: 2,
            fill: 'yellow',
            d: 'M 20 -10 0 0 20 10 Z',
          },
        },
      },
    })

    function hourHand() {
      edge.transition('source', (10 + 9.36 / 60) / 12, {
        delay: 1000,
        duration: 19000,
        interp: (start, startTime) => {
          const timeCorrection = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 300, y: 150 }
          const radius = 140 / 1.618
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + timeCorrection),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + timeCorrection),
            }
          }
        },
      })
    }

    function minuteHand() {
      edge.transition('target', 9.36 / 60, {
        delay: 1000,
        duration: 19000,
        timing: (time) => {
          return time * 12 - Math.floor(time * 12)
        },
        interp: (start, startTime) => {
          const timeCorrection = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 300, y: 150 }
          const radius = 140
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + timeCorrection),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + timeCorrection),
            }
          }
        },
      })
    }

    let currentTransitions = 0

    hourHand()
    minuteHand()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        hourHand()
        minuteHand()
      }
    })
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
