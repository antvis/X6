import React from 'react'
import { Graph } from '../../../../src'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: 1,
    })

    const ellipse = graph.addNode({
      shape: 'ellipse',
      x: 80,
      y: 120,
      width: 200,
      height: 100,
      attrs: {
        label: {
          text: 'outsideOriented',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
      ports: {
        groups: {
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                dr: 0,
                dx: 0,
                dy: 0,
                compensateRotate: true,
                // step: 20,
                start: 90,
              },
            },
            label: {
              position: {
                name: 'outsideOriented',
                args: {
                  // offset: 15,
                  // x: 0,
                  // y: 0,
                  attrs: {},
                },
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#31d0c6',
                strokeWidth: 2,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach(function (_, index) {
      ellipse.addPort({ attrs: { text: { text: 'P ' + index } }, group: 'a' })
    })

    ellipse.addPort({
      group: 'a',
      attrs: {
        circle: {
          stroke: '#fe854f',
          strokeWidth: 2,
          magnet: true,
        },
        text: {
          x: '0.5em',
          text: 'custom label',
          y: '0.9em',
          textAnchor: 'start',
          fill: '#ffffff',
        },
        portLabelBody: {
          stroke: '#fe854f',
          fill: '#fe854f',
          width: 100,
          height: 20,
        },
        portLabelText: {
          x: '0.5em',
          y: '0.9em',
        },
      },
      label: {
        position: {
          name: 'right',
          args: { angle: 30 },
        },
        markup: [
          {
            tagName: 'rect',
            selector: 'portLabelBody',
          },
          {
            tagName: 'text',
            selector: 'portLabelText',
          },
        ],
      },
    })

    const rect = graph.addNode({
      shape: 'rect',
      x: 425,
      y: 60,
      width: 200,
      height: 100,
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
          a: {
            position: {
              name: 'top',
              args: {
                dr: 0,
                dx: 0,
                dy: -10,
              },
            },
            label: {
              position: {
                name: 'left',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#31d0c6',
                strokeWidth: 2,
                r: 10,
              },
              text: {
                fill: '#6a6c8a',
              },
            },
          },
        },
      },
    })

    Array.from({ length: 3 }).forEach(function (_, index) {
      rect.addPort({
        group: 'a',
        attrs: {
          text: { text: 'P' + index },
          circle: { magnet: true },
        },
      })
    })

    rect.addPort({
      group: 'a',
      attrs: {
        circle: {
          stroke: '#fe854f',
          strokeWidth: 2,
          magnet: true,
        },
        portLabelBody: {
          stroke: '#fe854f',
          fill: '#fe854f',
          width: 150,
          height: 20,
        },
        portLabelText: {
          x: '0.5em',
          y: '0.9em',
        },
        text: {
          x: '0.5em',
          text: 'custom label - manual',
          y: '0.9em',
          textAnchor: 'start',
          fill: '#ffffff',
        },
      },
      label: {
        position: {
          name: 'left',
          args: {
            angle: 10,
            position: {
              x: 15,
              y: -10,
            },
            // this works as well, overrides portLabelRect, portLabelText attrs for current port
            // attrs: {
            //     portLabelText: { y: '0.9em', x: '0.5em', textAnchor: 'start' },
            //     portLabelBody: { fill: 'blue' }
            // }
          },
        },
        markup: [
          {
            tagName: 'rect',
            selector: 'portLabelBody',
          },
          {
            tagName: 'text',
            selector: 'portLabelText',
          },
        ],
      },
    })

    // interaction
    // -----------
    const labelPos: { [id: string]: number } = {
      [rect.id]: 0,
      [ellipse.id]: 0,
    }

    graph.on('node:click', ({ node }) => {
      if (!node.hasPorts()) {
        return
      }

      const positions =
        node.id === rect.id
          ? [
              'left',
              'right',
              'top',
              'bottom',
              'outsideOriented',
              'outside',
              'insideOriented',
              'inside',
            ]
          : ['outsideOriented', 'outside', 'radial', 'radialOriented']

      const pos = positions[labelPos[node.id] % positions.length]
      node.prop('attrs/label/text', pos)
      node.prop('ports/groups/a/label/position/name', pos)
      labelPos[node.id]++
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Port Label Layout</h1>
        <div className="x6-graph-tools">
          <p>
            Click on Ellipse or Rectangle to toggle label position alignment
          </p>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
