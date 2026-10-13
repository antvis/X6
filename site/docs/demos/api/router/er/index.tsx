import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Edge, Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

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

    const rect1 = graph.addNode({
      x: 40,
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
      x: 240,
      y: 150,
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

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'er',
        args: this.getERArgs(defaults),
      },
    })

    graph.centerContent()
  }

  getERArgs(state: State) {
    const { center, offset, min, direction } = state
    return {
      min,
      direction: direction || undefined,
      offset: center ? 'center' : offset,
    }
  }

  updateConnection = (state: State) => {
    this.edge.prop('router/args', this.getERArgs(state))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="er-router-app">
        <div className="app-left">
          <Settings onChange={this.updateConnection} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.er-router-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.er-router-app .app-left {
  bottom: 0;
  width: 336px;
  padding: 0 8px;
}
.er-router-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.er-router-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.er-router-app .ant-card-head-title {
  text-align: center;
}
.er-router-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.er-router-app .slider-value {
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
