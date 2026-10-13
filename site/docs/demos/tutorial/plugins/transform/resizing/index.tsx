import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Transform } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      minWidth: 1,
      maxWidth: 200,
      minHeight: 1,
      maxHeight: 150,
      orthogonal: false,
      restrict: false,
      preserveAspectRatio: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Transform({
        resizing: options,
      }),
    )

    const source = this.graph.addNode({
      shape: 'rect',
      x: 32,
      y: 32,
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
      x: 160,
      y: 180,
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
      <div className="resizing-app">
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
.resizing-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.resizing-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.resizing-app .app-side .slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}
.resizing-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.resizing-app .x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0;
  border: 1px solid #239edd;
  border-radius: 6px;
}
.resizing-app .x6-widget-transform > div {
  border: 1px solid #239edd;
}
.resizing-app .x6-widget-transform > div:hover {
  background-color: #3dafe4;
}
.resizing-app .x6-widget-transform-active-handle {
  background-color: #3dafe4;
}
.resizing-app .x6-widget-transform-resize {
  border-radius: 0;
}
.resizing-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.resizing-app .ant-card-head-title {
  text-align: center;
}
.resizing-app .ant-row {
  margin: 16px 0;
  text-align: left;
}

@media (max-width: 640px) {
  .resizing-app {
    flex-wrap: wrap;
    height: auto;
  }
  .resizing-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .resizing-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
