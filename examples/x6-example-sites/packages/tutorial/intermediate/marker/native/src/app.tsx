import * as React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private edge: Edge

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    this.edge = this.graph.addEdge({
      source: [80, 160],
      target: [480, 160],
      attrs: {
        line: {
          sourceMarker: 'block',
          targetMarker: 'block',
        },
      },
    })
  }

  onBackgroundChanged = ({ type, ...args }: State) => {
    this.edge.attr({
      line: {
        sourceMarker: { args, name: type },
        targetMarker: { args, name: type },
      },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onBackgroundChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
