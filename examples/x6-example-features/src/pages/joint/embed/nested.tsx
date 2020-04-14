import React from 'react'
import { joint } from '@antv/x6'
import '../../index.less'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 10,
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

    graph
      .addEdge({
        source: { cellId: r11.id },
        target: { cellId: r12.id },
      })
      .addTo(r1)

    graph
      .addEdge({
        source: { x: 160, y: 100 },
        target: { x: 240, y: 240 },
      })
      .addTo(r1)

    const r2 = r1.clone({ deep: true }).translate(0, 300)
    console.log(r2)
    graph.addNode(r2)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
