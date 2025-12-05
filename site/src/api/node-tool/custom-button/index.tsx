import React from 'react'
import { Graph, Color, CellView } from '@antv/x6'
import './index.less'

Graph.registerNodeTool(
  'my-btn',
  {
    inherit: 'button',
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attrs: {
          width: 40,
          height: 20,
          rx: 4,
          ry: 4,
          fill: 'white',
          stroke: '#fe854f',
          'stroke-width': 2,
          cursor: 'pointer',
        },
      },
      {
        tagName: 'text',
        selector: 'text',
        textContent: 'btn',
        attrs: {
          fill: '#fe854f',
          'font-size': 10,
          'text-anchor': 'middle',
          'pointer-events': 'none',
          x: 20,
          y: 13,
        },
      },
    ],
    onClick({ view }: { view: CellView }) {
      const node = view.cell
      const fill = Color.randomHex()
      node.attr({
        body: {
          fill,
        },
        label: {
          fill: Color.invert(fill, true),
        },
      })
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
      x: 40,
      y: 40,
      width: 140,
      height: 48,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: [
        {
          name: 'my-btn',
          args: {
            x: '100%',
            y: '100%',
            offset: { x: -44, y: -24 },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 160,
      width: 140,
      height: 48,
      label: 'target',
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

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="custom-button-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
