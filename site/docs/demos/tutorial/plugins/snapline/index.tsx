import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Snapline } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Snapline({
        enabled: true,
        clean: false,
      }),
    )

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Drag Me',
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
  }

  onSnaplineChanged = (options: State) => {
    this.graph.setSnaplineTolerance(options.tolerance)
    this.graph.setSnaplineFilter(options.filter)

    if (options.sharp) {
      this.graph.enableSharpSnapline()
    } else {
      this.graph.disableSharpSnapline()
    }

    if (options.resizing) {
      this.graph.enableSnaplineOnResizing()
    } else {
      this.graph.disableSnaplineOnResizing()
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="snapline-app">
        <div className="app-side">
          <Settings onChange={this.onSnaplineChanged} />
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
.snapline-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.snapline-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.snapline-app .app-side .slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}
.snapline-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.snapline-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.snapline-app .ant-card-head-title {
  text-align: center;
}
.snapline-app .ant-row {
  margin: 16px 0;
  text-align: left;
}

@media (max-width: 640px) {
  .snapline-app {
    flex-wrap: wrap;
    height: auto;
  }
  .snapline-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .snapline-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
