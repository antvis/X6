import React from 'react'
import { Graph, Cell, EdgeView, Vector } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const a = graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      label: 'A',
    })

    const b = graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      label: 'B',
    })

    const c = graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      label: 'C',
    })

    const d = graph.addNode({
      x: 80,
      y: 240,
      width: 100,
      height: 40,
      label: 'D',
    })

    graph.addEdge({
      source: a,
      target: b,
    })

    graph.addEdge({
      source: b,
      target: c,
    })

    graph.addEdge({
      source: b,
      target: d,
      connector: 'smooth',
      attrs: {
        line: {
          strokeDasharray: '5 5',
        },
      },
    })

    function flash(cell: Cell) {
      const cellView = graph.findViewByCell(cell)
      if (cellView) {
        cellView.highlight()
        setTimeout(() => cellView.unhighlight(), 300)
      }
    }

    graph.on('signal', (cell: Cell) => {
      if (cell.isEdge()) {
        const view = graph.findViewByCell(cell) as EdgeView
        if (view) {
          const token = Vector.create('circle', { r: 6, fill: '#feb662' })
          const target = cell.getTargetCell()
          setTimeout(() => {
            view.sendToken(token.node, 1000, () => {
              if (target) {
                graph.trigger('signal', target)
              }
            })
          }, 300)
        }
      } else {
        flash(cell)
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true,
        })
        edges.forEach((edge) => graph.trigger('signal', edge))
      }
    })

    let manual = false

    graph.on('node:mousedown', ({ cell }) => {
      manual = true
      graph.trigger('signal', cell)
    })

    const trigger = () => {
      graph.trigger('signal', a)
      if (!manual) {
        setTimeout(trigger, 5000)
      }
    }

    trigger()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
