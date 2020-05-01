import React from 'react'
import { v1 } from '@antv/x6'
import { Rect } from '@antv/x6/es/v1/shape/standard'
import '../../index.less'
import '../index.less'

const Parent = Rect.define({
  customEmebedding: true,
  attrs: {
    body: { stroke: 'transparent', fill: 'black', rx: 5, ry: 5 },
    label: { fontSize: 14, text: 'Parent', fill: 'white' },
  },
})

const Child = Rect.define({
  attrs: {
    body: { stroke: 'transparent', fill: 'green', rx: 5, ry: 5 },
    label: { fontSize: 14, text: 'child1', fill: 'white' },
  },
})

v1.NodeRegistry.register('embedding.parent', Parent)
v1.NodeRegistry.register('embedding.child', Child)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const EMBEDDING_OFFSET = 59
    const graph = new v1.Graph({
      container: this.container,
      width: 880,
      height: 600,
      gridSize: 20,
      drawGrid: 'mesh',
      embeddingMode: true,
      findParentBy: function(this: v1.Model, node: v1.Node) {
        var bbox = node.getBBox()
        return this.getNodes().filter((node: v1.Node) => {
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

          return bbox.intersect(currentBBox)
        })
      },
    })

    graph.addNode({
      type: 'embedding.parent',
      size: { width: 160, height: 100 },
      position: { x: 240, y: 400 },
    })

    graph.addNode({
      type: 'embedding.child',
      size: { width: 160, height: 100 },
      position: { x: 20, y: 120 },
      attrs: {
        body: { fill: 'red' },
        label: { text: 'Try to move me\n above the \n "Parent" element' },
      },
    })

    graph.addNode({
      type: 'embedding.child',
      size: { width: 160, height: 100 },
      position: { x: 20, y: 240 },
      attrs: {
        body: { fill: 'green' },
        label: { text: 'Try to move me\n above the \n "Parent" element' },
      },
    })

    graph.addNode({
      type: 'embedding.child',
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
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
