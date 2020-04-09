import React from 'react'
import { v, joint, Point, Line, Polyline } from '@antv/x6'
import { Rect } from '@antv/x6/lib/research/shape/standard'
import '../index.less'
import './index.less'

joint.NodeRegistry.register(
  'embedding.child',
  Rect.define({
    attrs: {
      body: { stroke: 'transparent', fill: 'green', rx: 5, ry: 5 },
      label: { fontSize: 14, text: 'child1', fill: 'white' },
    },
  }),
)

joint.NodeRegistry.register(
  'embedding.parent',
  Rect.define({
    customEmebedding: true,
    attrs: {
      body: { stroke: 'transparent', fill: 'black', rx: 5, ry: 5 },
      label: { fontSize: 14, text: 'Parent', fill: 'white' },
    },
  }),
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const EMBEDDING_OFFSET = 59
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 20,
      drawGrid: 'mesh',
      embeddingMode: true,
      findParentBy: function(this: joint.Model, node: joint.Node) {
        var bbox = node.getBBox()
        return this.getNodes().filter((node: joint.Node) => {
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
