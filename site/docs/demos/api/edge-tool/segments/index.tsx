import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

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
      tools: [
        {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#8f8f8f',
            },
          },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#8f8f8f',
            },
          },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-segments-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.edge-tool-segments-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.edge-tool-segments-app .app-content {
  flex: 1;
  height: 320px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
