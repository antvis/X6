import React from 'react'
import { Graph, Transform } from '@antv/x6'
import '../index.less'

export class ToolsCleanExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: {
        visible: true,
      },
      panning: true,
    })

    graph.use(new Transform({ rotating: true }))

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 30,
      label: 'Source',
      tools: [
        'button-remove',
        {
          name: 'boundary',
          args: {
            padding: 5,
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2,
            },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 240,
      width: 80,
      height: 30,
      label: 'Target',
      tools: {
        items: [
          {
            name: 'button-remove',
            args: {
              x: 80,
              y: 0,
            },
          },
          {
            name: 'boundary',
            args: {
              padding: 5,
              attrs: {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
        ],
        local: true,
      },
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 80, y: 160 },
        { x: 200, y: 160 },
      ],
      tools: ['vertices', 'segments'],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
