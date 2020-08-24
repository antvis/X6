import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'custom-node',
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
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 2,
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
      grid: true,
    })

    const source = graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 40,
      width: 120,
      height: 40,
      attrs: {
        label: {
          text: 'Source',
        },
      },
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 360,
      y: 40,
      width: 120,
      height: 40,
      attrs: {
        label: {
          text: 'Target',
        },
      },
    })

    graph.addEdge({ source, target })

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
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
