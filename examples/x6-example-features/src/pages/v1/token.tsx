import React from 'react'
import { v1, v } from '@antv/x6'
import '../index.less'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new v1.Graph({
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

    function flash(cell: v1.Cell) {
      const cellView = graph.findViewByCell(cell)
      if (cellView) {
        cellView.highlight()
        setTimeout(() => cellView.unhighlight(), 200)
      }
    }

    graph.on('node:mousedown', ({ cell }) => {
      graph.trigger('signal', cell)
    })

    graph.on('signal', function(cell: v1.Cell) {
      if (cell.isEdge()) {
        const edgeView = graph.findViewByCell(cell) as v1.EdgeView
        if (edgeView) {
          const token = v.create('circle', { r: 7, fill: 'green' })
          const targetCell = cell.getTargetCell()
          edgeView.sendToken(token.node, 1000, function() {
            if (targetCell) {
              graph.trigger('signal', targetCell)
            }
          })
        }
      } else {
        flash(cell)
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true,
        })
        edges.forEach(edge => graph.trigger('signal', edge))
      }
    })

    graph.trigger('signal', a)
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
