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
      keyboard: {
        enabled: true,
        global: true,
      },
      // resizing: {
      //   enabled: true,
      // },
      // rotating: {
      //   enabled: true,
      // },
      selecting: {
        enabled: true,
        rubberband: true,
        multiple: true,
        strict: true,
        showNodeSelectionBox: true,
        content: '123',
      },
    })

    const a = graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    const b = graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    const c = graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    graph.addEdge({ source: a, target: b })
    graph.addEdge({ source: b, target: c })

    // graph.toggleMultipleSelection(false)
    // console.log(graph.isMultipleSelection())

    // graph.on('node:selected', ({ node }) => {
    //   console.log(node)
    // })

    // graph.on('node:unselected', ({ node }) => {
    //   console.log(node)
    // })

    // graph.on('selection:changed', ({ selected, added, removed }) => {
    //   console.log(selected, added, removed)
    // })

    graph.on('edge:selected', ({ edge }) => {
      console.log('selected', edge)
    })

    graph.on('edge:unselected', ({ edge }) => {
      console.log('unselected', edge)
    })

    graph.on('node:change:position', ({ node }) => {
      console.log(node)
    })

    graph.bindKey('backspace', () => {
      graph.removeCells(graph.getSelectedCells())
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
