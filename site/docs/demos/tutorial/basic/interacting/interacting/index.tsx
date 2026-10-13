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
      nodeMovable: false,
      magnetConnectable: false,
      edgeMovable: false,
      edgeLabelMovable: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 300,
      background: {
        color: '#F2F7FA',
      },
      interacting: {
        ...options,
      },
      connecting: {
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          })
        },
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
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
      ports: {
        groups: {
          in: {
            position: 'top',
            attrs: {
              circle: {
                magnet: true,
                stroke: '#8f8f8f',
                r: 5,
              },
            },
          },
          out: {
            position: 'bottom',
            attrs: {
              circle: {
                magnet: true,
                stroke: '#8f8f8f',
                r: 5,
              },
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addNode({
      x: 160,
      y: 200,
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
      ports: {
        groups: {
          in: {
            position: 'top',
            attrs: {
              circle: {
                magnet: true,
                stroke: '#8f8f8f',
                r: 5,
              },
            },
          },
          out: {
            position: 'bottom',
            attrs: {
              circle: {
                magnet: true,
                stroke: '#8f8f8f',
                r: 5,
              },
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addEdge({
      source: [320, 80],
      target: [500, 200],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      label: 'Move Me',
    })

    this.graph = graph
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="interacting-app">
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
.interacting-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.interacting-app .app-side {
  bottom: 0;
  height: 100%;
  padding: 0 8px;
}
.interacting-app .app-content {
  flex: 1;
  margin-top: 0;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.ant-card {
  min-height: 250px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.ant-card-head-title {
  text-align: center;
}
.ant-row {
  margin: 16px 0;
  text-align: left;
}
.slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}

@media (max-width: 640px) {
  .interacting-app {
    flex-wrap: wrap;
    height: auto;
  }
  .interacting-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .interacting-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
