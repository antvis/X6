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
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
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

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 80,
          'target/x': 330,
          'target/y': 80,
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
          'source/x': 30,
          'source/y': 160,
          'vertices/0/x': 230,
          'vertices/0/y': 80,
          'target/x': 430,
          'target/y': 160,
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

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-position">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
