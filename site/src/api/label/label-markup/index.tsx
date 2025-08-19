import React from 'react'
import { Graph } from '@antv/x6'
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

    const edge = graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      defaultLabel: {
        markup: [
          {
            tagName: 'ellipse',
            selector: 'bg',
          },
          {
            tagName: 'text',
            selector: 'txt',
          },
        ],
        attrs: {
          txt: {
            fill: '#7c68fc',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          },
          bg: {
            ref: 'txt',
            refRx: '70%',
            refRy: '80%',
            stroke: '#7c68fc',
            fill: 'white',
            strokeWidth: 2,
          },
        },
      },
    })

    edge.appendLabel({
      attrs: {
        txt: {
          text: 'First',
        },
      },
      position: {
        distance: 0.3,
      },
    })

    edge.appendLabel({
      attrs: {
        txt: {
          text: 'Second',
        },
      },
      position: {
        distance: 0.7,
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-markup-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
