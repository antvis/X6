import React from 'react'
import { joint } from '@antv/x6'
import {
  Rect,
  Rect1,
  Circle,
  Ellipse,
  Rhombus,
} from '@antv/x6/lib/research/shape/basic'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({ container: this.container })
    const rect = new Rect({
      size: { width: 100, height: 40 },
      position: { x: 32, y: 40 },
      attrs: {
        text: { text: 'rect' },
      },
    })

    const circle = new Circle({
      position: { x: 160, y: 40 },
      attrs: {
        text: { text: 'circle' },
      },
    })

    const ellipse = new Ellipse({
      position: { x: 240, y: 40 },
      attrs: {
        text: { text: 'ellipse' },
      },
    })

    const rhombus = new Rhombus({
      position: { x: 320, y: 40 },
      attrs: {
        text: { text: 'rhombus' },
      },
    })

    graph.model.addCell(rect)
    graph.model.addCell(circle)
    graph.model.addCell(ellipse)
    graph.model.addCell(rhombus)

    const rect1 = new Rect1({
      size: { width: 100, height: 40 },
      position: { x: 32, y: 120 },
      attrs: {
        text: { text: 'rect' },
      },
    })

    graph.model.addCell(rect1)

    rect.setAttrByPath('rect/fill', 'red')

    console.log(rect1)

    console.log(graph)

    // class NodeView1 extends joint.CellView {}
    // NodeView1.setDefaults({ tagName: 'ss' })

    // class NodeView2 extends joint.CellView {}
    // NodeView2.setDefaults({ tagName: 'dd' })

    // console.log(NodeView1.getDefaults())
    // console.log(NodeView2.getDefaults())
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
