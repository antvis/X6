import React from 'react'
import { Graph, Node, Dnd } from '../../../../src'
import '../index.less'

export class DndExample extends React.Component {
  private graph: Graph
  private dnd: Dnd
  private container: HTMLDivElement

  componentDidMount() {
    const graph = (this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 800,
      grid: {
        visible: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((parent) => {
            const targetBBox = parent.getBBox()
            return targetBBox.containsRect(bbox)
          })
        },
      },
    }))

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 200,
      height: 80,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    const target = graph.addNode({
      x: 320,
      y: 240,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    graph.addEdge({ source, target })
    graph.centerContent()

    this.dnd = new Dnd({
      target: graph,
    })
    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    let node: Node | undefined
    if (type === 'rect') {
      node = this.graph.createNode({
        shape: 'rect',
        width: 100,
        height: 40,
        attrs: {
          label: {
            text: 'Rect',
            fill: '#6a6c8a',
          },
          body: {
            stroke: '#31d0c6',
            strokeWidth: 2,
          },
        },
      })
    } else if (type === 'circle') {
      node = this.graph.createNode({
        shape: 'circle',
        width: 60,
        height: 60,
        attrs: {
          label: {
            text: 'Circle',
            fill: '#6a6c8a',
          },
          body: {
            stroke: '#31d0c6',
            strokeWidth: 2,
          },
        },
      })
    }

    if (node) {
      this.dnd.start(node, e.nativeEvent as any)
    }
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Dnd</h1>
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 40,
            width: 200,
            height: 300,
            padding: 16,
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          <div
            data-type="rect"
            onMouseDown={this.startDrag}
            style={{
              width: 100,
              height: 40,
              border: '2px solid #31d0c6',
              textAlign: 'center',
              lineHeight: '40px',
              margin: 16,
              cursor: 'move',
            }}
          >
            Rect
          </div>
          <div
            data-type="circle"
            onMouseDown={this.startDrag}
            style={{
              width: 60,
              height: 60,
              borderRadius: '100%',
              border: '2px solid #31d0c6',
              textAlign: 'center',
              lineHeight: '60px',
              margin: 16,
              cursor: 'move',
            }}
          >
            Circle
          </div>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
