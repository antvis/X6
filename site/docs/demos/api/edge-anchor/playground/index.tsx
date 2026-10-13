import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

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
      const origin = { x: 200, y: 100 }
      const radius = 140
      const steps = 60
      const p = edge.getSourcePoint()
      const start = Math.atan2(p.y - origin.y, p.x - origin.x)
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = start + (2 * Math.PI * i) / steps
        xs.push(origin.x + radius * Math.cos(theta))
        ys.push(origin.y + radius * Math.sin(theta))
      }
      edge.animate(
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

    animate()

    edge.on('animation:finish', animate)

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

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.edge-anchor-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.edge-anchor-app .app-left {
  bottom: 0;
  width: 336px;
  padding: 0 8px;
}
.edge-anchor-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.edge-anchor-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.edge-anchor-app .ant-card-head-title {
  text-align: center;
}
.edge-anchor-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.edge-anchor-app .slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}
`)
