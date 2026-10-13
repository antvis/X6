import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-group-node',
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
      shape: 'custom-group-node',
      x: 60,
      y: 100,
      label: 'Child\n(inner)',
      zIndex: 2,
    })

    const target = graph.addNode({
      shape: 'custom-group-node',
      x: 420,
      y: 80,
      label: 'Child\n(outer)',
      zIndex: 2,
    })

    const parent = graph.addNode({
      shape: 'custom-group-node',
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent\n(try to move me)',
    })

    parent.addChild(source)
    parent.addChild(target)

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 120, y: 60 },
        { x: 200, y: 100 },
      ],
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
      <div className="embed-edge-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.embed-edge-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.embed-edge-app .app-content {
  flex: 1;
  height: 240px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
