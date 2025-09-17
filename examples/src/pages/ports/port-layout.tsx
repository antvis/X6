import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

Graph.registerPortLayout(
  'sin',
  (portsPositionArgs, elemBBox) => {
    return portsPositionArgs.map((_, index) => {
      const step = -Math.PI / 8
      const y = Math.sin(index * step) * 50
      return {
        position: {
          x: index * 12,
          y: y + elemBBox.height,
        },
        angle: 0,
      }
    })
  },
  true,
)

export default class Example extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: 1,
    })

    const rect = graph.addNode({
      shape: 'rect',
      x: 90,
      y: 100,
      width: 300,
      height: 150,
      attrs: {
        label: {
          text: 'left',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
      ports: {
        groups: {
          blacks: {
            attrs: {
              circle: {
                magnet: true,
                r: 12,
                fill: '#ffffff',
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          },
          reds: {
            position: 'sin',
            label: {
              position: {
                name: 'manual',
                args: {
                  attrs: {
                    text: {
                      y: 40,
                      textAnchor: 'middle',
                    },
                  },
                },
              },
            },
            attrs: {
              rect: {
                fill: '#fe854f',
                width: 11,
              },
              text: {
                fill: '#fe854f',
              },
              circle: {
                fill: '#fe854f',
                r: 5,
                magnet: true,
              },
            },
          },
          greens: {
            position: 'absolute',
            attrs: {
              circle: {
                fill: 'transparent',
                stroke: '#31d0c6',
                strokeWidth: 3,
                r: 10,
                magnet: true,
              },
              rect: {
                fill: '#31d0c6',
              },
              text: {
                fill: '#31d0c6',
              },
            },
            label: {
              position: {
                name: 'manual',
                args: {
                  position: { y: 20 },
                  attrs: {
                    portLabel: { textAnchor: 'middle' },
                  },
                },
              },
              markup: [
                {
                  tagName: 'text',
                  textContent: 'absolute',
                  groupSelector: 'portLabel',
                },
                {
                  tagName: 'text',
                  selector: 'layoutValue',
                  groupSelector: 'portLabel',
                },
              ],
            },
          },
        },
      },
    })

    const ellipse = graph.addNode({
      shape: 'ellipse',
      x: 500,
      y: 50,
      width: 200,
      height: 100,
      attrs: {
        label: {
          text: 'ellipse',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
      ports: {
        groups: {
          blacks: {
            position: 'ellipse',
            attrs: {
              circle: {
                magnet: true,
                r: 12,
                fill: '#ffffff',
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 4 }).forEach(() => {
      rect.addPort({ group: 'blacks' })
    })

    Array.from({ length: 24 }).forEach(() => {
      rect.addPort({ group: 'reds' })
    })

    rect.addPort({
      group: 'reds',
      attrs: {
        text: { text: 'fn: sin(x)' },
      },
    })

    rect.addPort({
      group: 'greens',
      attrs: {
        layoutValue: { text: 'x:80% y:20%' },
      },
      args: {
        x: '80%',
        y: '20%',
      },
    })

    Array.from({ length: 8 }).forEach(function () {
      ellipse.addPort({ group: 'blacks' })
    })

    const portPosition: { [id: string]: number } = {
      [rect.id]: 1,
      [ellipse.id]: 1,
    }

    graph.on('node:click', ({ view }) => {
      const node = view.cell
      if (!node.hasPorts()) {
        return
      }

      let positions =
        node.id === rect.id
          ? ['left', 'right', 'top', 'bottom', 'line']
          : [
              'ellipse',
              'ellipseSpread',
              {
                name: 'ellipseSpread',
                args: {
                  step: 20,
                  start: 90,
                },
                toString: function () {
                  return 'ellipseSpread\n step: 20, start: 90'
                },
              },
              {
                name: 'ellipse',
                args: {
                  step: 20,
                  start: 90,
                },
                toString: function () {
                  return 'ellipse\n step: 20, start: 90'
                },
              },
            ]

      var pos = positions[portPosition[node.id] % positions.length]
      if (pos !== 'fn') {
        node.prop('ports/groups/blacks/position', pos)
      }
      node.prop('attrs/label/text', pos.toString())
      portPosition[node.id]++
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Port Layout</h1>
        <div className="x6-graph-tools">
          <p>Click Rectangle or Ellipse to toggle port positions alignment</p>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
