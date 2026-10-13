import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      modifiers: [],
      eventTypes: ['leftMouseDown'],
    })
  }

  initGraph(options: any) {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      panning: {
        ...options,
      },
    })

    this.graph.addNode({
      x: 320,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
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

    const source = this.graph.addNode({
      x: 80,
      y: 50,
      width: 100,
      height: 40,
      label: 'Hello',
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

    const target = this.graph.addNode({
      shape: 'circle',
      x: 240,
      y: 200,
      width: 60,
      height: 60,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    })

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.graph.centerContent()
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="panning-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
.panning-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.panning-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.panning-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.panning-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.panning-app .ant-card-head-title {
  text-align: center;
}
.panning-app .ant-row {
  margin: 16px 0;
  text-align: left;
}

@media (max-width: 640px) {
  .panning-app {
    flex-wrap: wrap;
    height: auto;
  }
  .panning-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .panning-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
