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
      x: 160,
      y: 80,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'path',
          selector: 'line',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        line: {
          d: 'M 0 0 280 120',
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 2,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'line',
              args: {
                start: { x: 0, y: 0 },
                end: { x: 280, y: 120 },
              },
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
            args: { angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            attrs: {
              path: {
                d: 'M -6 -8 L 0 8 L 6 -8 Z',
                magnet: true,
                fill: '#8f8f8f',
              },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: {},
          },
        ],
      },
    })
  }

  onAttrsChanged = ({ strict, ...args }: State) => {
    this.node.prop('ports/groups/group1/position', {
      name: 'line',
      args: { strict },
    })
    this.node.portProp('port2', { args } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-line-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
