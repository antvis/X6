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
    })

    const source = graph.addNode({
      x: 24,
      y: 70,
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

    const target = graph.addNode({
      x: 24,
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

    this.edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 760, y: 150 },
        { x: 760, y: 240 },
      ],
      connector: {
        name: 'jumpover',
        args: {
          type: 'arc',
          size: 5,
          radius: 0,
        },
      },
    })

    const rect = graph.addNode({
      x: 160,
      y: 24,
      width: 70,
      height: 30,
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

    for (let i = 0; i < 6; i += 1) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)
      graph.addEdge({
        source,
        target,
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    }
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('jumpover', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-jumpover-app">
        <div className="app-left">
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
.connector-jumpover-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.connector-jumpover-app .app-left {
  bottom: 0;
  width: 336px;
  padding: 0 8px;
}
.connector-jumpover-app .app-content {
  flex: 1;
  height: 320px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.connector-jumpover-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.connector-jumpover-app .ant-card-head-title {
  text-align: center;
}
.connector-jumpover-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.connector-jumpover-app .slider-value {
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
