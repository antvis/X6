import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-click-node',
  {
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'g',
        children: [
          {
            tagName: 'text',
            selector: 'btnText',
          },
          {
            tagName: 'rect',
            selector: 'btn',
          },
        ],
      },
    ],
    attrs: {
      btn: {
        refX: '100%',
        refX2: -28,
        y: 4,
        width: 24,
        height: 18,
        rx: 10,
        ry: 10,
        fill: 'rgba(255,255,0,0.01)',
        stroke: 'red',
        cursor: 'pointer',
        event: 'node:delete',
      },
      btnText: {
        fontSize: 14,
        fill: 'red',
        text: 'x',
        refX: '100%',
        refX2: -19,
        y: 17,
        cursor: 'pointer',
        pointerEvent: 'none',
      },
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        fontSize: 14,
        fill: '#333333',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-click-node',
      x: 40,
      y: 80,
      width: 120,
      height: 40,
      attrs: {
        label: {
          text: 'Source',
        },
      },
    })

    const target = graph.addNode({
      shape: 'custom-click-node',
      x: 360,
      y: 80,
      width: 120,
      height: 40,
      attrs: {
        label: {
          text: 'Target',
        },
      },
    })

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

    graph.on('node:delete', ({ view, e }: any) => {
      e.stopPropagation()
      view.cell.remove()
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="custom-click-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.custom-click-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.custom-click-app .app-content {
  flex: 1;
  height: 200px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
