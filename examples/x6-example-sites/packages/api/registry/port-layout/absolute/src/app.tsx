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
      height: 222,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 48,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
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
              name: 'absolute',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
            args: { x: 0, y: 60 },
            attrs: {
              text: { text: '{ x: 0, y: 60 }' },
            },
          },
          {
            id: 'port2',
            group: 'group1',
            args: { x: 0.6, y: 32, angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            zIndex: 10,
            attrs: {
              path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
              text: { text: '{ x: 0.6, y: 32, angle: 45 }', fill: 'red' },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: { x: '100%', y: '100%' },
            attrs: {
              text: { text: "{ x: '100%', y: '100%' }" },
            },
            label: {
              position: {
                name: 'right',
              },
            },
          },
        ],
      },
    })
  }

  onAttrsChanged = (args: State) => {
    this.node.portProp('port2', {
      args,
      attrs: {
        text: { text: `{ x: ${args.x}, y: ${args.y}, angle: ${args.angle} }` },
      },
    } as any)
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
