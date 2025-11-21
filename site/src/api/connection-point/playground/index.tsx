import React from 'react'
import { Graph, Edge, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private ellipse: Node
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

    const rect = graph.addNode({
      x: 160,
      y: 160,
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
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        outline: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          strokeDasharray: '5 5',
          stroke: '#8f8f8f',
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
            stroke: '#8f8f8f',
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
          stroke: '#8f8f8f',
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
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      const steps = 60

      {
        const origin = { x: 210, y: 180 }
        const radius = 120
        const p = edge1.getSourcePoint()
        const start = Math.atan2(p.y - origin.y, p.x - origin.x)
        const xs: number[] = []
        const ys: number[] = []
        for (let i = 0; i < steps; i += 1) {
          const theta = start + (2 * Math.PI * i) / steps
          xs.push(origin.x + radius * Math.cos(theta))
          ys.push(origin.y + radius * Math.sin(theta))
        }
        edge1.animate(
          {
            'source/x': xs,
            'source/y': ys,
          },
          {
            duration: 5000,
            easing: 'linear',
            fill: 'forwards',
          },
        )
      }

      {
        const origin = { x: 485, y: 180 }
        const radius = 120
        const p = edge2.getSourcePoint()
        const start = Math.atan2(p.y - origin.y, p.x - origin.x)
        const xs: number[] = []
        const ys: number[] = []
        for (let i = 0; i < steps; i += 1) {
          const theta = start + (2 * Math.PI * i) / steps
          xs.push(origin.x + radius * Math.cos(theta))
          ys.push(origin.y + radius * Math.sin(theta))
        }
        edge2.animate(
          {
            'source/x': xs,
            'source/y': ys,
          },
          {
            duration: 5000,
            easing: 'linear',
            fill: 'forwards',
          },
        )
      }
    }

    animate()

    edge1.on('animation:finish', animate)

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
      <div className="connection-point-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
