import React from 'react'
import { Graph } from '@antv/x6'
import { Vertices } from '@antv/x6/es/registry/tool/vertices'
import './index.less'

const RedVertices = Vertices.define<Vertices.Options>({
  name: 'red-vertices',
  attrs: {
    fill: 'red',
  },
})

Graph.registerEdgeTool('red-vertices', RedVertices, true)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: ['red-vertices'],
    })

    const edge2 = graph.addEdge({
      source: { x: 60, y: 140 },
      target: { x: 380, y: 140 },
      vertices: [
        { x: 40, y: 180 },
        { x: 200, y: 140 },
        { x: 240, y: 180 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools([{ name: 'red-vertices' }])
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell === edge2) {
        if (cell.hasTool('red-vertices')) {
          cell.removeTool('red-vertices')
        }
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-custom-vertices-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
