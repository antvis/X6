import React from 'react'
import { Graph } from '../../../../src'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 1400,
      grid: 10,
    })

    // Default connection of two elements.
    // -----------------------------------

    const r1 = graph.addNode({
      shape: 'rect',
      width: 70,
      height: 30,
      x: 200,
      y: 50,
      attrs: {
        body: { fill: '#1890ff', stroke: '#1890ff' },
        text: { text: 'box', fill: '#fff', magnet: true },
      },
    })

    var r2 = r1.clone()
    graph.addNode(r2)
    r2.translate(300)

    graph.addEdge({
      source: r1,
      target: r2,
      label: 'default',
    })

    // Changing source and target selectors of the edge.
    // -------------------------------------------------
    var r3 = r1.clone()
    graph.addNode(r3)
    r3.translate(0, 80)

    var r4 = r3.clone()
    graph.addNode(r4)
    r4.translate(300)

    graph.addEdge({
      source: { cell: r3.id },
      target: { cell: r4.id, selector: 'text' },
      label: 'link to selector',
    })

    // Vertices.
    // ---------
    var r5 = r3.clone()
    graph.addNode(r5)
    r5.translate(0, 80)

    var r6 = r5.clone()
    graph.addNode(r6)
    r6.translate(300)

    graph.addEdge({
      source: r5,
      target: r6,
      vertices: [
        { x: 235, y: 280 },
        { x: 535, y: 280 },
      ],
      label: 'vertices',
    })

    // // Manhattan routing.
    // // ------------------
    var r7 = r5.clone()
    graph.addNode(r7)
    r7.translate(0, 100)

    var r8 = r7.clone()
    graph.addNode(r8)
    r8.translate(200, 80)

    graph.addEdge({
      source: r7,
      target: r8,
      vertices: [{ x: 620, y: 325 }],
      router: { name: 'metro' },
      label: 'metro router',
    })
    graph.addEdge({
      source: r7,
      target: r8,
      vertices: [{ x: 350, y: 405 }],
      router: { name: 'manhattan' },
      connector: { name: 'rounded' },
      label: 'manhattan router',
    })

    // // OneSide routing.
    // // ----------------
    var r9 = r7.clone()
    graph.addNode(r9)
    r9.translate(0, 150)

    var r10 = r9.clone()
    graph.addNode(r10)
    r10.translate(300, 0)
    graph.addEdge({
      source: r9,
      target: r10,
      router: { name: 'oneSide', args: { side: 'bottom' } },
      label: 'oneSide rounter',
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
