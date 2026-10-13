import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-tools-node',
  {
    inherit: 'rect',
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

    const source = graph.addNode({
      shape: 'custom-tools-node',
      x: 40,
      y: 40,
      label: 'Source',
      tools: ['button-remove'],
    })

    const target = graph.addNode({
      shape: 'custom-tools-node',
      x: 160,
      y: 240,
      label: 'Target',
      tools: ['button-remove'],
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 90, y: 160 },
        { x: 210, y: 160 },
      ],
      tools: ['vertices', 'segments'],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="tools-basic-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.tools-basic-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.tools-basic-app .app-content {
  flex: 1;
  height: 320px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
