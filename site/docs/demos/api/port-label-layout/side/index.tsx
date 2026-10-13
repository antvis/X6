import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'rect',
      x: 80,
      y: 68,
      width: 240,
      height: 80,
      attrs: {
        label: {
          text: 'left',
          fill: '#6a6c8a',
        },
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
          a: {
            position: {
              name: 'top',
              args: {
                dr: 0,
                dx: 0,
                dy: -10,
              },
            },
            label: {
              position: {
                name: 'left',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
              },
              text: {
                fill: '#6a6c8a',
              },
            },
          },
        },
      },
    })

    Array.from({ length: 3 }).forEach((_, index) => {
      const label =
        index === 2
          ? {
              position: { args: { x: 20, y: -20 } },
            }
          : {}
      const stroke = index === 2 ? { stroke: 'red' } : {}
      const fill = index === 2 ? { fill: 'red' } : {}
      this.node.addPort({
        label,
        group: 'a',
        attrs: {
          circle: { magnet: true, ...stroke },
          text: { text: `P${index}`, ...fill },
        },
      })
    })
  }

  onAttrsChanged = ({ position }: State) => {
    this.node.prop('ports/groups/a/label/position/name', position)
    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-side-app">
        <div className="app-side">
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
.port-label-side-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.port-label-side-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.port-label-side-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-label-side-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-label-side-app .ant-card-head-title {
  text-align: center;
}
.port-label-side-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.port-label-side-app .slider-value {
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
  .port-label-side-app {
    flex-wrap: wrap;
    height: auto;
  }
  .port-label-side-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .port-label-side-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
