import React from 'react'
import { Graph } from '@antv/x6-next'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      // selecting: {
      //   enabled: true,
      //   showNodeSelectionBox: true,
      // },
      // clipboard: {
      //   enabled: true,
      // },
      // keyboard: {
      //   enabled: true,
      //   global: false,
      // },
    })

    graph.use(
      new Keyboard({
        enabled: true,
      }),
    )

    const keyboard = graph.getPlugin('keyboard') as Keyboard
    keyboard.bindKey('backspace', () => {
      console.log('backspace')
    })

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    // graph.bindKey('meta+c', () => {
    //   const cells = graph.getSelectedCells()
    //   if (cells.length) {
    //     graph.copy(cells)
    //   }
    //   return false
    // })

    // graph.bindKey('meta+v', () => {
    //   if (!graph.isClipboardEmpty()) {
    //     const cells = graph.paste({ offset: 32 })
    //     graph.resetSelection(cells)
    //   }
    //   console.log(graph.toJSON())
    //   return false
    // })

    // graph.bindKey('backspace', () => {
    //   graph.removeCells(graph.getSelectedCells())
    // })

    // graph.on('selection:changed', ({ selected }) => {
    //   console.log(selected)
    // })
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
