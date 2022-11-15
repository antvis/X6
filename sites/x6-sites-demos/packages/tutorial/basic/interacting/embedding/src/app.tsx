import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData<{ parent: boolean }>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
    })

    graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 140,
      width: 120,
      height: 60,
      label: 'Child\n(unembed)',
      zIndex: 10,
    })

    graph.addNode({
      shape: 'custom-node',
      x: 500,
      y: 100,
      width: 120,
      height: 60,
      label: 'Child\n(unembed)',
      zIndex: 10,
    })

    graph.addNode({
      shape: 'custom-node',
      x: 200,
      y: 80,
      width: 240,
      height: 160,
      zIndex: 1,
      label: 'Parent',
      data: {
        parent: true,
      },
    })

    graph.on('node:change:parent', ({ node }) => {
      node.attr({
        label: {
          text: 'Child\n(embed)',
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
