import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: {
            tagName: 'ellipse',
            rx: 20,
            ry: 10,
            cx: 20,
            fill: 'rgba(255,0,0,0.3)',
          },
          targetMarker: {
            tagName: 'circle',
            r: 12,
            cx: 12,
            fill: 'rgba(0,255,0,0.3)',
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
      <div className="marker-tagname-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
