import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 80,
      width: 400,
      height: 160,
      attrs: {
        body: {
          rx: 10,
          ry: 10,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `dropShadow\n\ncolor: ${args.color}\ndx: ${args.dx}        \ndy: ${args.dy}        \nblur: ${args.blur}            \nopacity: ${args.opacity}               \n`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'dropShadow',
          args: { ...args },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
