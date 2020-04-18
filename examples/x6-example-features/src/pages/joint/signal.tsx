import React from 'react'
import { joint } from '@antv/x6'
import '../index.less'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const a = graph.addNode({
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    const b = graph.addNode({
      type: 'rect',
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    const c = graph.addNode({
      type: 'rect',
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    graph.addEdge({
      type: 'edge',
      source: a,
      target: b,
    })

    graph.addEdge({
      type: 'edge',
      source: b,
      target: c,
    })

    graph.on('node:mousedown', ({ cell }) => {
      cell.trigger('signal', cell)
    })
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
