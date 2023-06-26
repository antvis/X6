import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',

      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          group1: {
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
            attrs: {
              rect: {
                magnet: true,
                stroke: '#8f8f8f',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 1,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#8f8f8f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipseSpread',
              args: {
                start: 45,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({
        id: `${index}`,
        group: 'group1',
        attrs: { text: { text: index } },
      })
    })

    this.node.portProp('0', {
      attrs: {
        rect: { stroke: '#8f8f8f' },
        dot: { fill: '#8f8f8f' },
      },
    })
  }

  onAttrsChanged = ({ start, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      compensateRotate,
    })

    this.node.portProp('0', {
      args,
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-ellipse-spread-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
