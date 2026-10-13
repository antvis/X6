import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Path, Point } from '@antv/x6'

export interface WobbleArgs {
  spread?: number
  raw?: boolean
}

Graph.registerConnector(
  'wobble',
  (sourcePoint, targetPoint, vertices, args: WobbleArgs) => {
    const spread = args.spread || 20
    const points = [...vertices, targetPoint].map((p) => Point.create(p))
    let prev = Point.create(sourcePoint)
    const path = new Path()
    path.appendSegment(Path.createSegment('M', prev))

    for (let i = 0, n = points.length; i < n; i += 1) {
      const next = points[i]
      const distance = prev.distance(next)
      let d = spread

      while (d < distance) {
        const current = prev.clone().move(next, -d)
        current.translate(
          Math.floor(7 * Math.random()) - 3,
          Math.floor(7 * Math.random()) - 3,
        )
        path.appendSegment(Path.createSegment('L', current))
        d += spread
      }

      path.appendSegment(Path.createSegment('L', next))
      prev = next
    }

    return path
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
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
      x: 300,
      y: 240,
      width: 100,
      height: 40,
      label: 'world',
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

    graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      connector: {
        name: 'wobble',
        args: {
          spread: 16,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-wobble-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.connector-wobble-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.connector-wobble-app .app-content {
  flex: 1;
  height: 320px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
