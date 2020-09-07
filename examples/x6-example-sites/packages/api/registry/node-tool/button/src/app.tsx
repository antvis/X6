import React from 'react'
import { Graph, Color } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 120,
      height: 60,
      label: 'Source',
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
            onClick({ view }: any) {
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
      x: 120,
      y: 160,
      width: 120,
      height: 60,
      label: 'Target',
    })

    graph.addEdge({
      source,
      target,
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
            onClick({ view }: any) {
              const node = view.cell
              node.attr({
                body: {
                  stroke: Color.randomHex(),
                  strokeDasharray: '5, 1',
                  strokeDashoffset:
                    (node.attr('line/strokeDashoffset') | 0) + 20,
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
