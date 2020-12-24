import React from 'react'
import { Edge, Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 240,
      y: 150,
      width: 100,
      height: 40,
      label: 'world',
    })

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      router: {
        name: 'er',
        args: this.getERArgs(defaults),
      },
    })
  }

  getERArgs(state: State) {
    const { center, offset, min } = state
    return {
      min,
      offset: center ? 'center' : offset,
    }
  }

  updateConnection = (state: State) => {
    this.edge.prop('router/args', this.getERArgs(state))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.updateConnection} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}
