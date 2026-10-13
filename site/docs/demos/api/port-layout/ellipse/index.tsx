import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Point } from '@antv/x6'
import { Settings, State } from './settings.tsx'

function getPathData(deg: number) {
  const center = new Point(180, 100)
  const start = new Point(180, 0)
  const ratio = center.x / center.y
  const p = start
    .clone()
    .rotate(90 - deg, center)
    .scale(ratio, 1, center)
  return `M ${center.x} ${center.y} ${p.x} ${p.y}`
}

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
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'text', selector: 'label' },
        { tagName: 'path', selector: 'line' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        line: {
          d: getPathData(45),
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
      },
      ports: {
        groups: {
          group1: {
            markup: [
              {
                tagName: 'rect',
                selector: 'rect',
              },
              {
                tagName: 'circle',
                selector: 'dot',
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: '#8f8f8f',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 1,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#8f8f8f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipse',
              args: {
                start: 45,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({
        id: `${index}`,
        group: 'group1',
        attrs: { text: { text: index } },
      })
    })

    this.node.portProp('0', {
      attrs: {
        rect: { stroke: '#8f8f8f' },
        dot: { fill: '#8f8f8f' },
      },
    })
  }

  onAttrsChanged = ({ start, step, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      step,
      compensateRotate,
    })

    this.node.attr({
      line: { d: getPathData(start) },
    })

    this.node.portProp('0', {
      args,
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-ellipse-app">
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
.port-ellipse-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.port-ellipse-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.port-ellipse-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-ellipse-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.port-ellipse-app .ant-card-head-title {
  text-align: center;
}
.port-ellipse-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.port-ellipse-app .slider-value {
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
  .port-ellipse-app {
    flex-wrap: wrap;
    height: auto;
  }
  .port-ellipse-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .port-ellipse-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
