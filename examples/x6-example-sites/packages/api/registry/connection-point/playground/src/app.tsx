import React from 'react'
import { Graph, Edge, Node } from '@antv/x6'
import { Settings, State } from './settings'
import '@antv/x6/es/index.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private ellipse: Node
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const rect = graph.addNode({
      x: 160,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
      },
    })

    const ellipse = graph.addNode({
      shape: 'ellipse',
      x: 460,
      y: 160,
      width: 100,
      height: 40,
      angle: 45,
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'rect', selector: 'outline' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
        outline: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          strokeDasharray: '5 5',
          stroke: '#8e89e5',
          fill: 'none',
        },
      },
    })

    let bbox: Node
    const updateBBox = () => {
      if (bbox) {
        bbox.remove()
      }
      const rect = ellipse.findView(graph)!.getBBox()
      bbox = graph.addNode({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        attrs: {
          body: {
            strokeWidth: 1,
            strokeDasharray: '5 5',
            stroke: '#ed8661',
            fill: 'none',
          },
        },
      })
    }

    ellipse.on('change:angle', updateBBox)

    updateBBox()

    const edge1 = graph.addEdge({
      source: { x: 100, y: 180 },
      target: { cell: rect.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 180 },
      target: { cell: ellipse.id },
      attrs: {
        line: {
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
          const origin = { x: 210, y: 180 }
          const radius = 120
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
          const origin = { x: 485, y: 180 }
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

    edge1.on('transition:end', animate)

    this.edge1 = edge1
    this.edge2 = edge2
    this.ellipse = ellipse
  }

  updateBBox() {}

  onAttrsChanged = ({ anchor, connectionPoint, angle }: State) => {
    this.edge1.prop('target/anchor', { name: anchor })
    this.edge1.prop('target/connectionPoint', { name: connectionPoint })
    this.edge2.prop('target/anchonr', { name: anchor })
    this.edge2.prop('target/connectionPoint', { name: connectionPoint })
    this.ellipse.rotate(angle, { absolute: true })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
