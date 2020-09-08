import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 880,
      height: 600,
      grid: true,
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((parent) => {
            const data = parent.getData<any>()
            // 只有 data.parent 为 true 的节点才是父节点
            if (data && data.parent) {
              const children = parent.getChildren()
              console.log(children)
              const valid =
                children != null &&
                children.every((cell) => cell.id !== node.id)
              if (valid) {
                const targetBBox = parent.getBBox()
                return targetBBox.containsRect(bbox)
              }
            }
            return false
          })
        },
        validate({ child, parent }) {
          const data = parent.getData<any>()
          if (data == null || data.parent == null) {
            return false
          }
          const children = parent.getChildren()
          return (
            children != null && children.every((cell) => cell.id !== child.id)
          )
        },
      },
    })

    const parent1 = graph.addNode({
      size: { width: 240, height: 400 },
      position: { x: 80, y: 80 },
      data: {
        parent: true,
      },
    })

    const parent2 = graph.addNode({
      size: { width: 240, height: 400 },
      position: { x: 560, y: 160 },
      data: {
        parent: true,
      },
    })

    const createChild = (index: number, parent: Node) => {
      const pos = parent.getPosition()
      const fill = Color.randomHex()
      graph
        .createNode({
          size: { width: 160, height: 80 },
          position: { x: pos.x + 40, y: pos.y + 40 * (index + 1) + 80 * index },
          attrs: {
            body: { fill, stroke: Color.darken(fill, 40) },
            label: {
              text: `Child${index + 1}`,
              fill: Color.invert(fill, true),
            },
          },
        })
        .addTo(parent)
    }

    createChild(0, parent1)
    createChild(1, parent1)
    createChild(2, parent1)
    createChild(0, parent2)
    createChild(1, parent2)
    createChild(2, parent2)
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
