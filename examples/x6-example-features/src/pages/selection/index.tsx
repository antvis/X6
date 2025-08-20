import React from 'react'
import { Graph, Keyboard, Selection } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: {
        enabled: true,
        eventTypes: ['mouseWheelDown'],
      },
    })

    const keyboard = new Keyboard()
    const selection = new Selection({
      rubberband: true,
      multiple: true,
      strict: true,
      showNodeSelectionBox: true,
      selectCellOnMoved: false,
      filter(cell) {
        return cell !== a
      },
    })
    graph.use(keyboard)
    graph.use(selection)

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
      ports: [{ id: 'port' }],
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

    keyboard.bindKey('backspace', () => {
      graph.removeCells(selection.getSelectedCells())
    })

    selection.select(a)
    selection.select([b, c])

    selection.on('selection:changed', ({ added }) => {
      console.log('added', added)
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
