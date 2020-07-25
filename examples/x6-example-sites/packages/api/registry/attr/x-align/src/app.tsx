import React from 'react'
import { Graph, Cell } from '@antv/x6'
import '@antv/x6/es/index.css'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Cell

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 400,
      height: 250,
      grid: {
        visible: true,
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
          stroke: '#333333',
          strokeWidth: 1,
        },
        dot: {
          r: 3,
          fill: 'red',
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
          fill: 'rgba(9, 113, 241, 0.8)',
          stroke: 'rgba(9, 113, 241, 0.8)',
        },
        label: {
          fontSize: 14,
          // refX: 0.5,
          // refY: 0.5,
          // textAnchor: "middle",
          // textVerticalAnchor: "middle",
          fill: '#333333',
          fontFamily: 'Arial, helvetica, sans-serif',
        },
        hLine: {
          refY: 0.5,
          d: 'M -30 0 310 0',
          stroke: 'green',
          strokeDasharray: '5 5',
        },
        vLine: {
          refX: 0.5,
          d: 'M 0 -30 0 150',
          stroke: 'green',
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
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}
