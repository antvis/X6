import React from 'react'
import { Graph, Point } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const ufo = graph.addNode({
      shape: 'ellipse',
      x: 400,
      y: 50,
      width: 40,
      height: 20,
      attrs: {
        label: {
          text: 'u.f.o.',
          fontSize: 10,
        },
        body: {
          fill: '#FFFFFF',
        },
      },
    })

    function fly() {
      ufo.transition('position', 20, {
        delay: 0,
        duration: 5000,
        interp(a: Point.PointLike, b: number) {
          return function (t: number) {
            return {
              x: a.x + 10 * b * (Math.cos(t * 2 * Math.PI) - 1),
              y: a.y - b * Math.sin(t * 2 * Math.PI),
            }
          }
        },
      })
    }

    fly()

    ufo.on('transition:complete', fly)
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
