import React from 'react'
import { Graph, Cell } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Cell

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 400,
      height: 250,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 60,
      y: 60,
      width: 280,
      height: 120,
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
          selector: 'ref',
        },
        {
          tagName: 'circle',
          selector: 'dot',
        },
        {
          tagName: 'text',
          selector: 'label',
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
          r: 3,
          fill: '#8f8f8f',
          stroke: 'none',
          refX: 0.5,
          refY: 0.5,
        },
        ref: {
          width: 70,
          height: 30,
          refX: 0.5,
          refY: 0.5,
          // xAlign: 'middle',
          // yAlign: 'middle',
          fill: '#8f8f8f',
          stroke: '#8f8f8f',
        },
        label: {
          fontSize: 14,
          fill: '#333333',
          fontFamily: 'Arial, helvetica, sans-serif',
        },
        hLine: {
          refY: 0.5,
          d: 'M -30 0 310 0',
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
        vLine: {
          refX: 0.5,
          d: 'M 0 -30 0 150',
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
      },
    })
  }

  onAttrsChanged = (attrs: State) => {
    this.node.attr({
      ref: attrs,
      hLine: { refY: attrs.refY },
      vLine: { refX: attrs.refX },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-x-align-app">
        <div className="app-left">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}
