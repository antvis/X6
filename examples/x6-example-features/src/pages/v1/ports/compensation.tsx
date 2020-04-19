import React from 'react'
import { joint } from '@antv/x6'
import '../../index.less'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 400,
      gridSize: 1,
      validateMagnet() {
        return false
      },
    })

    const ellipse = graph.addNode({
      type: 'ellipse',
      x: 50,
      y: 50,
      width: 500,
      height: 300,
      attrs: {
        label: {
          text: 'compensateRotation: true',
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
              args: { start: 0, dr: 0, compensateRotation: true },
            },
            label: {
              position: 'radial',
            },
            attrs: {
              rect: {
                stroke: '#31d0c6',
                fill: '#ffffff',
                strokeWidth: 2,
                width: 20,
                height: 20,
                x: -10,
                y: -10,
              },
              dot: {
                fill: '#fe854f',
                r: 2,
              },
              text: {
                fill: '#6a6c8a',
              },
            },
            markup: [
              {
                tagName: 'rect',
                selector: 'rect',
              },
              {
                tagName: 'circle',
                selector: 'dot',
              },
            ],
          },
        },
      },
    })

    Array.from({ length: 36 }).forEach(function(_, index) {
      ellipse.addPort({
        group: 'a',
        id: `${index}`,
        attrs: { text: { text: index } },
      })
    })

    graph.on('node:click', function({ node }) {
      if (!node.hasPorts()) {
        return
      }
      const path = 'ports/groups/a/position/args/compensateRotation'
      var current = node.prop<boolean>(path)
      node.prop('attrs/label/text', 'compensateRotation: ' + !current)
      node.prop(path, !current)
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Port rotation compensation</h1>
        <div className="x6-graph-tools">
          <p>Click on Element to toggle port rotation compensation</p>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
