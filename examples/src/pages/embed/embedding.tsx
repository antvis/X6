import React from 'react'
import { Graph, Node, Shape } from '../../../../src'
import '../index.less'

const Parent = Shape.Rect.define({
  customEmebedding: true,
  attrs: {
    body: { stroke: 'transparent', fill: 'black', rx: 5, ry: 5 },
    label: { fontSize: 14, text: 'Parent', fill: 'white' },
  },
})

const Child = Shape.Rect.define({
  attrs: {
    body: { stroke: 'transparent', fill: 'green', rx: 5, ry: 5 },
    label: { fontSize: 14, text: 'child1', fill: 'white' },
  },
})

Node.registry.register('embedding.parent', Parent, true)
Node.registry.register('embedding.child', Child, true)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const EMBEDDING_OFFSET = 59
    const graph = new Graph({
      container: this.container,
      width: 880,
      height: 600,
      grid: {
        size: 20,
        type: 'mesh',
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          var bbox = node.getBBox()
          return this.getNodes().filter((node: Node) => {
            var currentBBox = node.getBBox()
            if (node.getProp('customEmebedding')) {
              var children = node.getChildren() || []
              if (children.length) {
                var rect = this.getCellsBBox(children)
                if (rect) {
                  currentBBox.height += rect.height
                  currentBBox.y -= rect.height
                }
              }

              currentBBox.y -= EMBEDDING_OFFSET
              currentBBox.height += EMBEDDING_OFFSET
            }

            return bbox.isIntersectWithRect(currentBBox)
          })
        },
      },
    })

    graph.addNode({
      shape: 'embedding.parent',
      size: { width: 160, height: 100 },
      position: { x: 240, y: 400 },
    })

    graph.addNode({
      shape: 'embedding.child',
      size: { width: 160, height: 100 },
      position: { x: 20, y: 120 },
      attrs: {
        body: { fill: 'red' },
        label: { text: 'Try to move me\n above the \n "Parent" element' },
      },
    })

    graph.addNode({
      shape: 'embedding.child',
      size: { width: 160, height: 100 },
      position: { x: 20, y: 240 },
      attrs: {
        body: { fill: 'green' },
        label: { text: 'Try to move me\n above the \n "Parent" element' },
      },
    })

    graph.addNode({
      shape: 'embedding.child',
      size: { width: 160, height: 100 },
      position: { x: 20, y: 360 },
      attrs: {
        body: { fill: 'blue' },
        label: { text: 'Try to move me\n above the \n "Parent" element' },
      },
    })

    var r = new Child({
      attrs: {
        body: { fill: 'red' },
        label: { text: 'Embedded!' },
      },
    })
      .setPosition(600, 120)
      .setSize(160, 100)

    var g = new Child({
      attrs: {
        body: { fill: 'green' },
        label: { text: 'Embedded!' },
      },
    })
      .setPosition(660, 240)
      .setSize(160, 100)

    var b = new Child({
      attrs: {
        body: { fill: 'blue' },
        label: { text: 'Embedded!' },
      },
    })
      .setPosition(600, 360)
      .setSize(160, 100)

    new Parent({
      attrs: {
        label: { text: 'Parent\n(try to move me)' },
      },
    })
      .setPosition(640, 480)
      .setSize(160, 100)
      .addChild(r)
      .addChild(g)
      .addChild(b)
      .addTo(graph.model)
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
