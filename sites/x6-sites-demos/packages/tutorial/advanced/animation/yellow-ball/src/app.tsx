import React from 'react'
import { Graph, Timing, Interp } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const ball = graph.addNode({
      shape: 'circle',
      x: -25,
      y: 40,
      width: 60,
      height: 60,
      attrs: {
        label: {
          text: 'ball',
          fontSize: 20,
        },
        body: {
          fill: '#FFFFFF',
        },
      },
    })

    ball.transition('angle', 360, {
      delay: 1000,
      duration: 1000,
    })

    ball.transition('position/x', 550, {
      delay: 1000,
      duration: 1000,
      timing: Timing.decorators.reverse(Timing.quad),
    })

    ball.transition('position/y', 255, {
      delay: 1000,
      duration: 1000,
      timing: Timing.decorators.reverse(Timing.bounce),
    })

    ball.transition('attrs/body/fill', '#FFFF00', {
      delay: 3000,
      duration: 1000,
      interp: Interp.color,
    })

    ball.transition(
      'attrs/label',
      { text: 'yellow ball', fontSize: 8 },
      {
        delay: 5000,
        duration: 2000,
        timing: 'easeInBounce',
        interp: (
          start: { text: String; fontSize: number },
          end: { text: String; fontSize: number },
        ) => {
          return function (time: number) {
            return {
              text: end.text.substr(0, Math.ceil(end.text.length * time)),
              fontSize: start.fontSize + (end.fontSize - start.fontSize) * time,
            }
          }
        },
      },
    )
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
