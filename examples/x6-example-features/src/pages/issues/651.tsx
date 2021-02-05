import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      rotating: true,
      resizing: {
        enabled: true,
        restricted: true,
      },
      translating: {
        restrict: -20,
      },
      scroller: {
        enabled: true,
        pannable: true,
        autoResize: false,
        pageVisible: true,
        autoResizeOptions: {
          border: 20,
        },
      },
    })

    graph.addNode({
      x: 100,
      y: 80,
      width: 80,
      height: 40,
      angle: 30,
    })

    graph.addNode({
      shape: 'ellipse',
      x: 240,
      y: 200,
      width: 80,
      height: 40,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
