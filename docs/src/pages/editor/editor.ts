import { EditorGraph, GraphView } from './graph'
import { Primer } from '../../../../src'

export class Editor extends Primer {
  graph: EditorGraph

  constructor(container: HTMLElement) {
    super()

    this.graph = new EditorGraph(container, {
      guide: {
        enabled: true,
        dashed: true,
      },
      grid: {
        enabled: true,
      },
      pageVisible: true,
      pageBreak: {
        enabled: true,
        dsahed: true,
        stroke: '#c0c0c0',
      },
      pageFormat: {
        width: 800,
        height: 960,
      },
      connection: {
        enabled: true
      },
      preferPageSize: true,
      rubberband: true,
      createView() {
        return new GraphView(this)
      },
    })

    this.start()
  }

  start() {
    const graph = this.graph
    graph.batchUpdate(() => {
      graph.addNode({ data: 'Hello', x: 60, y: 60, width: 80, height: 30 })
      graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 30 })
    })
    this.graph.resetScrollbars()
    this.trigger('resetGraphView')
  }
}
