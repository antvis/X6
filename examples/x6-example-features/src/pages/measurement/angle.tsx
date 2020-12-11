import React from 'react'
import { Graph, Cell, Edge, Angle } from '@antv/x6'
import './angle-shape'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      async: true,
      frozen: true,
      rotating: {
        enabled: true,
      },
      resizing: {
        enabled: true,
      },
    })

    const rect1 = graph.addNode({ shape: 'angle-node', x: 420, y: 40 })
    const rect2 = graph.addNode({ shape: 'angle-node', x: 420, y: 460 })
    const rect3 = graph.addNode({ shape: 'angle-node', x: 80, y: 240 })

    const edge1 = graph.addEdge({
      shape: 'angle-edge',
      source: {
        cell: rect1,
        anchor: { name: 'bottom', args: { rotate: true } },
        connectionPoint: { name: 'anchor' },
      },
      target: {
        cell: rect2,
        anchor: { name: 'top', args: { rotate: true } },
        connectionPoint: { name: 'anchor' },
      },
      attrs: {
        line: {
          stroke: '#464554',
          strokeWidth: 2,
          targetMarker: {
            tagName: 'circle',
            r: 2,
          },
          sourceMarker: {
            tagName: 'circle',
            r: 2,
          },
        },
        angles: {
          stroke: '#8D8DB6',
          strokeWidth: 2,
          strokeDasharray: '2,4',
        },
        angleLabels: {
          fill: '#8D8DB6',
        },
      },
    })

    const edge2 = graph.addEdge({
      shape: 'angle-edge',
      source: {
        cell: rect3,
        anchor: { name: 'center' },
        connectionPoint: { name: 'boundary' },
      },
      target: {
        cell: edge1,
        anchor: { name: 'ratio' },
        connectionPoint: { name: 'anchor' },
      },
      attrs: {
        line: {
          strokeWidth: 2,
          stroke: '#464554',
          targetMarker: {
            tagName: 'circle',
            r: 3,
          },
          sourceMarker: {
            tagName: 'circle',
            r: 2,
          },
        },
        sourceAngle: {
          stroke: '#4666E5',
          strokeWidth: 3,
          angle: {
            direction: 'small',
          },
        },
        targetAngle: {
          stroke: '#4666E5',
          strokeWidth: 3,
          angle: {
            start: 'target',
            direction: 'clockwise',
          },
        },
        angleLabels: {
          fill: '#334AA6',
          fontWeight: 'bold',
        },
      },
    })

    const edge3 = graph.addEdge({
      shape: 'angle-edge',
      source: { x: 680, y: 100 },
      target: { x: 680, y: 500 },
      attrs: {
        line: {
          strokeWidth: 2,
          stroke: '#464554',
          sourceMarker: {
            name: 'path',
            strokeWidth: 3,
            d: 'M 0 -5 0 5',
          },
          targetMarker: null,
        },
        targetAngle: {
          stroke: '#4666E5',
          fill: '#859AEE',
          strokeWidth: 2,
          angle: {
            start: 'target',
            direction: 'clockwise',
            radius: 50,
            value: 90,
            pie: true,
          },
        },
        targetAngleLabel: {
          fill: '#FFFFFF',
          fontWeight: 'bold',
          angleText: {
            distance: 30,
          },
        },
      },
    })

    graph.unfreeze()

    graph.on('edge:mouseup', ({ view, edge }) => {
      console.log('edge:mouseup')
      graph.removeTools()

      const tools: Cell.ToolItem[] = [
        {
          name: 'boundary',
          args: {
            attrs: {
              stroke: '#6B6A76',
              strokeDasharray: '1, 3',
              strokeWidth: 1,
            },
          },
        },
      ]

      if (edge === edge1) {
        tools.push(
          {
            name: 'source-anchor',
            args: {
              resetAnchor: false,
              restrictArea: false,
            },
          },
          {
            name: 'target-anchor',
            args: {
              resetAnchor: false,
              restrictArea: false,
            },
          },
        )
      }

      if (edge === edge2) {
        tools.push(
          {
            name: 'button',
            args: {
              markup: [
                {
                  tagName: 'circle',
                  attrs: {
                    r: 10,
                    cursor: 'pointer',
                    fill: '#464554',
                    stroke: '#F3F7F6',
                    strokeWidth: 1,
                  },
                },
                {
                  tagName: 'path',
                  attrs: {
                    d:
                      'M -4 -0.8 L -7.2 2.4 L -4 5.6 L -4 3.2 L 1.6 3.2 L 1.6 1.6 L -4 1.6 L -4 -0.8 Z M 7.2 -2.4 L 4 -5.6 L 4 -3.2 L -1.6 -3.2 L -1.6 -1.6 L 4 -1.6 L 4 0.8 L 7.2 -2.4 Z',
                    cursor: 'pointer',
                    strokeWidth: 2,
                    fill: '#fff',
                    stroke: 'none',
                  },
                },
              ],
              distance: -40,
              onClick({ cell }: { cell: Edge }) {
                const path = 'targetAngle/angle/direction'
                const directions = ['clockwise', 'anticlockwise']
                const direction = cell.attr<string>(path)
                const newDirection =
                  directions[
                    (directions.indexOf(direction) + 1) % directions.length
                  ]
                cell.attr(path, newDirection)
              },
            },
          },
          {
            name: 'button',
            args: {
              markup: [
                {
                  tagName: 'circle',
                  attrs: {
                    r: 10,
                    cursor: 'pointer',
                    fill: '#464554',
                    stroke: '#F3F7F6',
                    strokeWidth: 1,
                  },
                },
                {
                  tagName: 'path',
                  attrs: {
                    d:
                      'M -4 -0.8 L -7.2 2.4 L -4 5.6 L -4 3.2 L 1.6 3.2 L 1.6 1.6 L -4 1.6 L -4 -0.8 Z M 7.2 -2.4 L 4 -5.6 L 4 -3.2 L -1.6 -3.2 L -1.6 -1.6 L 4 -1.6 L 4 0.8 L 7.2 -2.4 Z',
                    cursor: 'pointer',
                    strokeWidth: 2,
                    fill: '#fff',
                    stroke: 'none',
                  },
                },
              ],
              distance: 40,
              onClick({ cell }: { cell: Edge }) {
                const path = 'sourceAngle/angle/direction'
                const directions = ['small', 'large']
                const direction = cell.attr<string>(path)
                const newDirection =
                  directions[
                    (directions.indexOf(direction) + 1) % directions.length
                  ]
                cell.attr(path, newDirection)
              },
            },
          },
          {
            name: 'source-anchor',
            args: {
              resetAnchor: false,
            },
          },
          {
            name: 'target-anchor',
            args: {
              resetAnchor: false,
            },
          },
        )
      }

      if (edge === edge3) {
        tools.push({
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                attrs: {
                  r: 10,
                  cursor: 'pointer',
                  fill: '#464554',
                  stroke: '#F3F7F6',
                  strokeWidth: 1,
                },
              },
              {
                tagName: 'path',
                attrs: {
                  d: 'M -5 0 5 0 M 0 -5 0 5',
                  cursor: 'pointer',
                  strokeWidth: 2,
                  fill: 'none',
                  stroke: '#fff',
                },
              },
            ],
            distance: -50,
            onClick({ cell }: { cell: Edge }) {
              const path = 'targetAngle/angle/value'
              const angle = cell.attr<number>(path)
              cell.attr(path, Angle.normalize(angle + 10))
            },
          },
        })
      }

      edge.addTools(tools)
    })

    graph.on('blank:mouseup', () => graph.removeTools())
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
