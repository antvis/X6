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
      x: 160,
      y: 110,
      width: 280,
      height: 120,
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        label: { text: 'left', fill: '#888' },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'left',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
            args: { angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            attrs: {
              path: {
                d: 'M -6 -8 L 0 8 L 6 -8 Z',
                magnet: true,
                fill: '#8f8f8f',
              },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: {},
          },
        ],
      },
    })
  }

  onAttrsChanged = ({ position, strict, ...args }: State) => {
    this.node.prop('ports/groups/group1/position', {
      name: position,
      args: { strict },
    })
    this.node.attr('label/text', position)
    this.node.portProp('port2', { args } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-side-app">
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
.port-side-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.port-side-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.port-side-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-side-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-side-app .ant-card-head-title {
  text-align: center;
}
.port-side-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.port-side-app .slider-value {
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
  .port-side-app {
    flex-wrap: wrap;
    height: auto;
  }
  .port-side-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .port-side-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
