import * as React from 'react'
import { Graph, Cell } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Cell

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 80,
      width: 200,
      height: 80,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'path',
          selector: 'hLine',
        },
        {
          tagName: 'path',
          selector: 'vLine',
        },
        {
          tagName: 'rect',
          selector: 'bg',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
        {
          tagName: 'circle',
          selector: 'dot',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        dot: {
          r: 2,
          fill: '#8f8f8f',
          stroke: 'none',
          refX: 0.5,
          refY: 0.5,
        },
        bg: {
          ref: 'label',
          fill: '#8f8f8f',
          stroke: '#8f8f8f',
          rx: 2,
          ry: 2,
          refWidth: 1,
          refHeight: 1,
          refX: 0,
          refY: 0,
        },
        label: {
          fontSize: 14,
          refX: 0.5,
          refY: 0.5,
          textAnchor: 'start',
          textVerticalAnchor: 'top',
          fill: '#fff',
          stroke: '#fff',
          fontFamily: 'Arial, helvetica, sans-serif',
          text: 'Hello World',
        },
        hLine: {
          refY: 0.5,
          d: 'M -40 0 240 0',
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
        vLine: {
          refX: 0.5,
          d: 'M 0 -40 0 120',
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
      },
    })
  }

  onGridChanged = (attrs: State) => {
    this.node.attr({
      label: attrs,
      hLine: { refY: attrs.refY },
      vLine: { refX: attrs.refX },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-text-anchor-app">
        <div className="app-left">
          <Settings onChange={this.onGridChanged} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}
