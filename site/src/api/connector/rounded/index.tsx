import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const rect2 = graph.addNode({
      x: 300,
      y: 220,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      connector: {
        name: 'rounded',
      },
    })

    graph.centerContent()
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('rounded', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-rounded-app">
        <div className="app-left">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
