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
      grid: 10,
    })

    const r1 = graph.addNode({
      type: 'rect',
      size: { width: 600, height: 240 },
      position: { x: 100, y: 40 },
      attrs: {
        body: { fill: 'orange' },
        label: { text: 'Box' },
      },
    })

    var r11 = r1.clone()
    r11
      .resize(240, 120)
      .attr({ body: { fill: 'yellow' } })
      .translate(24, 24)
      .addTo(r1)

    var r12 = r11.clone()
    r12
      .resize(120, 80)
      .attr({ body: { fill: 'yellow' } })
      .translate(400, 80)
      .addTo(r1)

    // auto update parent
    graph.addEdge({
      source: r11,
      target: r12,
    })

    graph
      .addEdge({
        source: { x: 160, y: 100 },
        target: { x: 240, y: 240 },
      })
      .addTo(r1)

    const r2 = r1.clone({ deep: true }).translate(0, 300)
    graph.addNode(r2)
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
