import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-node',
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
      shape: 'custom-node',
      x: 40,
      y: 200,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 80,
      label: 'world',
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="multi-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.multi-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.multi-app .app-content {
  flex: 1;
  height: 280px;
  margin-right: 8px;
  margin-left: 8px;
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1);
}
`)
