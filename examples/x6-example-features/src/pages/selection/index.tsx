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
        selectCellOnMoved: false,
        filter(cell) {
          return cell !== a
        },
        // content: '123',
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

    // graph.on('cell:selected', ({ cell }) => {
    //   console.log('selected', cell)
    // })

    // graph.on('cell:unselected', ({ cell }) => {
    //   console.log('unselected', cell)
    // })

    // graph.on('node:change:position', ({ node, options }) => {
    //   console.log(node, options)
    // })

    graph.bindKey('backspace', () => {
      graph.removeCells(graph.getSelectedCells())
    })

    // graph.on('blank:mousedown', () => {
    //   console.log('blank:mousedown')
    // })

    // graph.on('blank:click', () => {
    //   console.log('blank:click')
    // })

    // graph.on('node:mousedown', args => {
    //   console.log('node:mousedown', args)
    // })

    // graph.on('node:mousemove', args => {
    //   console.log('node:mousemove', args)
    // })

    // graph.on('node:mouseup', args => {
    //   console.log('node:mouseup', args)
    // })

    // graph.on('node:click', args => {
    //   console.log('node:click', args)
    // })

    // graph.on('node:dblclick', args => {
    //   console.log('node:dblclick', args)
    // })

    // graph.on('node:contextmenu', args => {
    //   console.log('node:contextmenu', args)
    // })

    graph.select(a)
    graph.select([b, c])

    graph.on('cell:removed', (args) => {
      console.log('cell:removed', args)
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
