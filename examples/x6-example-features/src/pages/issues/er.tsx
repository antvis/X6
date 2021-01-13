import React from 'react'
import { Graph, Edge } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 800,
      grid: true,
      panning: true,
      connecting: {
        allowBlank: false,
        allowNode: false,
        // sourceAnchor: 'midSide',
        // targetAnchor: 'midSide',
        router: {
          name: 'er',
        },
        connector: {
          name: 'rounded',
          args: {
            radius: 50,
          },
        },
        createEdge({ sourceMagnet }) {
          const map = {
            top: 'B',
            bottom: 'T',
            left: 'R',
            right: 'L',
          }
          const group = sourceMagnet.getAttribute(
            'port-group',
          ) as keyof typeof map

          return Edge.create({
            router: {
              name: 'er',
              args: {
                direction: group ? map[group] : undefined,
              },
            },
            attrs: {
              line: {
                strokeDasharray: '5 5',
              },
            },
          })
        },
      },
    })

    graph.on('edge:connected', ({ edge }) => {
      graph.batchUpdate(() => {
        const {
          port: sourcePort,
          ...source
        } = edge.getSource() as Edge.TerminalCellData
        const {
          port: targetPort,
          ...target
        } = edge.getTarget() as Edge.TerminalCellData

        edge.removeProp('source')
        edge.removeProp('target')
        edge.removeProp('router')
        edge.attr('line/strokeDasharray', null)

        edge.prop({
          source,
          target,
        })
      })
    })

    const rect1 = graph.addNode({
      x: 100,
      y: 80,
      width: 268,
      height: 100,
      label: 'hello',
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          {
            id: 'top',
            group: 'top',
          },
          {
            id: 'right',
            group: 'right',
          },
          {
            id: 'bottom',
            group: 'bottom',
          },
          {
            id: 'left',
            group: 'left',
          },
        ],
      },
    })

    const rect2 = graph.addNode({
      x: 400,
      y: 320,
      width: 268,
      height: 100,
      label: 'world',
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          {
            id: 'top',
            group: 'top',
          },
          {
            id: 'right',
            group: 'right',
          },
          {
            id: 'bottom',
            group: 'bottom',
          },
          {
            id: 'left',
            group: 'left',
          },
        ],
      },
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
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
