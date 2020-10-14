import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerEdge(
  'custom-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#5755a1',
      },
    },
    defaultLabel: {
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        label: {
          fill: 'black',
          fontSize: 14,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: 'white',
          stroke: '#5755a1',
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          refWidth: '140%',
          refHeight: '140%',
          refX: '-20%',
          refY: '-20%',
        },
      },
      position: {
        distance: 100,
        options: {
          absoluteDistance: true,
          reverseDistance: true,
        },
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

    graph.addEdge({
      shape: 'custom-edge',
      labels: [
        {
          attrs: { text: { text: 'Custom Edge' } },
        },
      ],
      source: [40, 40],
      target: [320, 40],
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
