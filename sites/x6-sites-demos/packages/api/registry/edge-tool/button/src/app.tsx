import React from 'react'
import { Graph, Util } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    graph.addEdge({
      source: { x: 40, y: 50 },
      target: { x: 320, y: 50 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 4,
          sourceMarker: {
            name: 'path',
            d: Util.normalizeMarker('M 0 -5 L -10 0 L 0 5 Z'),
          },
          targetMarker: {
            tagName: 'circle',
            r: 5,
          },
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
                  r: 18,
                  stroke: '#fe854f',
                  'stroke-width': 2,
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
                  'font-size': 10,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            distance: -40,
            onClick({ view }: any) {
              const edge = view.cell
              const source = edge.getSource()
              const target = edge.getTarget()
              edge.setSource(target)
              edge.setTarget(source)
            },
          },
        },
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 18,
                  stroke: '#fe854f',
                  'stroke-width': 2,
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
                  'font-size': 10,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            distance: -100,
            offset: { x: 0, y: 20 },
            onClick({ view }: any) {
              const edge = view.cell
              edge.attr({
                line: {
                  strokeDasharray: '5, 1',
                  strokeDashoffset:
                    (edge.attr('line/strokeDashoffset') | 0) + 20,
                },
              })
            },
          },
        },
      ],
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
