import React from 'react'
import { Graph, Node, Point } from '@antv/x6'
import '@antv/x6/es/index.css'
import { Settings, State } from './settings'
import './app.css'

function getPathData(deg: number) {
  const center = new Point(180, 100)
  const start = new Point(180, 0)
  const ratio = center.x / center.y
  const p = start
    .clone()
    .rotate(90 - deg, center)
    .scale(ratio, 1, center)
  return `M ${center.x} ${center.y} ${p.x} ${p.y}`
}

export default class Example extends React.Component {
  static noLayout = true
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'text', selector: 'label' },
        { tagName: 'path', selector: 'line' },
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
          d: getPathData(45),
          stroke: 'green',
          strokeDasharray: '5 5',
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
                stroke: '#31d0c6',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 2,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#fe854f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#6a6c8a',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipse',
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
        rect: { stroke: 'red' },
        dot: { fill: '#31d0c6' },
      },
    })
  }

  onAttrsChanged = ({ start, step, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      step,
      compensateRotate,
    })

    this.node.attr({
      line: { d: getPathData(start) },
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
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
