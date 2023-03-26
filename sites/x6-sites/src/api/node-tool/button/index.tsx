import React from 'react'
import { Graph, Color, NodeView } from '@antv/x6'
import './index.less'

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
      width: 120,
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
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn A',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: '100%',
            y: '100%',
            offset: { x: -18, y: -18 },
            onClick({ view }: { view: NodeView }) {
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
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 180,
      width: 120,
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

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn B',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: 0,
            y: 0,
            offset: { x: 18, y: 18 },
            onClick({ view }: { view: NodeView }) {
              const node = view.cell
              const offset = parseInt(
                node.attr('body/strokeDashoffset') || '0',
                10,
              )
              node.attr({
                body: {
                  stroke: Color.randomHex(),
                  strokeDasharray: '5, 1',
                  strokeDashoffset: offset + 20,
                },
              })
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ cell }) => {
      if (cell === target) {
        cell.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="button-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
