import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 160,
      y: 80,
      width: 100,
      height: 40,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const rect2 = graph.addNode({
      x: 460,
      y: 80,
      width: 100,
      height: 40,
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'rect', selector: 'port' },
      ],
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
        port: {
          x: 10,
          y: 10,
          width: 30,
          height: 10,
          strokeWidth: 1,
          stroke: '#fe8550',
        },
      },
    })

    const edge1 = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect1.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 100 },
      target: { cell: rect2, selector: 'port' },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge1.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 210, y: 100 }
          const radius = 140
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })

      edge2.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 485, y: 95 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })
    }

    animate()

    edge1.on('transition:complete', animate)

    this.edge1 = edge1
    this.edge2 = edge2
  }

  onAttrsChanged = ({ type }: State) => {
    this.edge1.prop('target/anchor', { name: type })
    this.edge2.prop('target/anchor', { name: type })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="node-anchor-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
