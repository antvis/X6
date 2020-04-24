import React from 'react'
import { joint } from '@antv/x6'
import { Selection } from '@antv/x6/es/research/addon/selection'
import '../../index.less'
import '../index.less'
import '../../../../../../packages/x6/src/research/addon/selection/index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 1,
    })

    graph.addNode({
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      type: 'rect',
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      type: 'rect',
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    const selection = new Selection({ graph })

    graph.on('blank:mousedown', ({ e }) => selection.startSelecting(e))

    graph.on('node:mouseup', ({ e, cell }) => {
      if (e.ctrlKey || e.metaKey) {
        selection.collection.add(cell)
      }
    })

    selection.on('selection-box:mousedown', ({ view, e }) => {
      if (e.ctrlKey || e.metaKey) {
        selection.collection.remove(view.cell)
      }
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
