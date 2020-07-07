import React from 'react'
import { Graph, Shape } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
      connecting: {
        snap: true,
        dangling: false,
        highlight: true,
        router: { name: 'manhattan' },
        connector: { name: 'normal' },
        connectionPoint: 'boundary',
        multi: true,
      },
    })

    Shape.Rect.config({
      width: 100,
      height: 40,
      ports: {
        items: [
          { group: 'left', id: '4' },
          { group: 'right', id: '2' },
          { group: 'top', id: '1' },
          { group: 'bottom', id: '3' },
        ],
        groups: {
          left: {
            position: { name: 'left' },
            attrs: {
              portBody: {
                magnet: 'active',
                r: 4,
                // cy: -1,
                fill: 'lightblue',
                stroke: 'black',
                opacity: 1,
              },
            },
            z: 0,
          },
          right: {
            position: { name: 'right' },
            attrs: {
              portBody: {
                magnet: 'active',
                r: 4,
                // cy: -1,
                fill: 'lightblue',
                stroke: 'black',
                opacity: 1,
              },
            },
            z: 0,
          },
          top: {
            position: { name: 'top' },
            attrs: {
              portBody: {
                magnet: 'active',
                r: 4,
                // cy: -1,
                fill: 'lightblue',
                stroke: 'black',
                opacity: 1,
              },
            },
            z: 0,
          },
          bottom: {
            position: { name: 'bottom' },
            attrs: {
              portBody: {
                magnet: 'active',
                r: 4,
                // cy: -1,
                fill: 'lightblue',
                stroke: 'black',
                opacity: 1,
              },
            },
            z: 0,
          },
        },
      },
      portMarkup: [
        {
          tagName: 'circle',
          selector: 'portBody',
        },
      ],
    })

    graph.fromJSON({
      edges: [
        {
          source: {
            cell: 'start',
            port: '2',
          },
          target: {
            cell: 'create',
            port: '2',
          },
          attrs: {
            line: {
              targetMarker: {
                name: 'classic',
                offset: 0,
              },
            },
          },
        },

        {
          source: {
            cell: 'create',
            port: '1',
          },
          target: {
            cell: 'end',
            port: '1',
          },
          attrs: {
            line: {
              targetMarker: {
                name: 'classic',
                offset: 0,
              },
            },
          },
        },
      ],
      nodes: [
        {
          id: 'start',
          label: 'start',
          type: 'start',
          x: 100,
          y: 100,
        },
        {
          id: 'create',
          label: 'userTask',
          type: 'userTask',
          x: 300,
          y: 300,
        },
        {
          id: 'end',
          label: 'end',
          type: 'end',
          x: 170,
          y: 200,
        },
      ],
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
