import React from 'react'
import { Graph, Node } from '@antv/x6'
import '@antv/x6/es/index.css'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  static noLayout = true
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 600,
      height: 286,
      grid: {
        visible: true,
      },
      snapline: true,
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
          stroke: '#000',
          strokeWidth: 1,
        },
        line: {
          d: 'M 0 0 280 120',
          stroke: 'green',
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
                stroke: '#31d0c6',
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
              path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
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
      <div className="app">
        <div className="left-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div ref={this.refContainer} />
      </div>
    )
  }
}
