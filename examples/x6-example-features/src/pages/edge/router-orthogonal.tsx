import React from 'react'
import { Graph, Shape } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: 10,
    })

    const r1 = new Shape.Rect({
      x: 100,
      y: 200,
      width: 80,
      height: 40,
      attrs: { body: { fill: 'blue' } },
    })

    const r2 = r1.clone().translate(200, 50)
    const r3 = r1.clone().translate(30, 230).resize(300, 50)

    r1.attr('body/fill', 'yellow').resize(400, 300)

    const l1 = new Shape.Edge({
      sourceCell: r2,
      targetCell: r1,
      router: { name: 'orth' },
      connector: { name: 'rounded' },
    })

    const l2 = l1.clone().setSource(r1).setTarget(r3)

    const l3 = l1.clone().setSource(r3).setTarget(r2)

    graph.model.addCells([r1, r2, r3, l1, l2, l3] as any)
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
