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
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: '#873bf4',
            strokeWidth: 2,
            fill: 'yellow',
            d: 'M 20 -10 0 0 20 10 Z',
          },
        },
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-custom-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
