import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const rect = graph.addEdge({
      source: { x: 40, y: 80 },
      target: { x: 360, y: 80 },
      vertices: [
        { x: 120, y: 120 },
        { x: 200, y: 40 },
        { x: 280, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    const edge = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 200, y: 100 }
          const radius = 140
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

    edge.on('transition:complete', animate)

    this.edge = edge
  }

  onAttrsChanged = ({ type, value }: State) => {
    const anchor =
      type === 'ratio' || type === 'length'
        ? {
            name: type,
            args: {
              [type]: value,
            },
          }
        : { name: type }
    this.edge.prop('target/anchor', anchor)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-anchor-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
