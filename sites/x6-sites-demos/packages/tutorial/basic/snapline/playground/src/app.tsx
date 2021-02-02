import React from 'react'
import { Graph, JQuery } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      snapline: {
        enabled: true,
        clean: false,
      },
    })

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Drag Me',
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSnaplineChanged = (options: State) => {
    this.graph.setSnaplineTolerance(options.tolerance)
    this.graph.setSnaplineFilter(options.filter)

    if (options.sharp) {
      this.graph.enableSharpSnapline()
    } else {
      this.graph.disableSharpSnapline()
    }

    if (options.resizing) {
      this.graph.enableSnaplineOnResizing()
    } else {
      this.graph.disableSnaplineOnResizing()
    }

    JQuery(this.graph.snapline.widget.container).toggleClass(
      'my-snapline',
      options.className != null,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSnaplineChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
