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
      shape: 'ellipse',
      x: 70,
      y: 50,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
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
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: `P ${index}` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-radial-app">
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
.port-label-radial-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.port-label-radial-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.port-label-radial-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-label-radial-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-label-radial-app .ant-card-head-title {
  text-align: center;
}
.port-label-radial-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.port-label-radial-app .slider-value {
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
  .port-label-radial-app {
    flex-wrap: wrap;
    height: auto;
  }
  .port-label-radial-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .port-label-radial-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
