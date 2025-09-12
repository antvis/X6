import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'
import '../index.less'

export class EdgeEditorExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    let edge: Edge | null = null
    let node: Node | null = null

    const init = (pos: { x: number; y: number }) => {
      node = graph.addNode({
        shape: 'circle',
        width: 10,
        height: 10,
        ...pos,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
          },
        },
      })
      edge = graph.addEdge({
        source: node,
        target: pos,
        attrs: {
          line: {
            targetMarker: null,
            stroke: '#A2B1C3',
            strokeWidth: 2,
          },
        },
      })
    }

    const addVertices = (pos: { x: number; y: number }) => {
      if (edge) {
        edge.appendVertex(pos)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (edge) {
        const pos = graph.clientToLocal(e.clientX, e.clientY)
        edge.setTarget(pos)
      }
    }

    const print = () => {
      if (edge) {
        const view = graph.findViewByCell(edge) as EdgeView
        console.log(view.path.serialize())
      }
    }

    const finish = (closed: boolean) => {
      if (node && edge) {
        const vertices = edge.getVertices()
        if (closed) {
          if (vertices.length >= 2) {
            const center = node.getBBox().center
            edge.setSource(center)
            edge.setTarget(center)
            graph.removeNode(node)
            node = null
            print()
          } else {
            graph.removeCells([node, edge])
            node = null
            edge = null
          }
        } else {
          if (vertices.length >= 1) {
            const center = node.getBBox().center
            edge.setSource(center)
            edge.setTarget(vertices[vertices.length - 1])
            graph.removeNode(node)
            node = null
            print()
          } else {
            graph.removeCells([node, edge])
            node = null
            edge = null
          }
        }
        this.container.removeEventListener('mousemove', onMouseMove)
      }
    }

    graph.on('blank:click', ({ x, y }) => {
      init({ x, y })
      this.container.addEventListener('mousemove', onMouseMove)
    })

    graph.on('edge:click', ({ x, y }) => {
      const nodes = graph.getNodesFromPoint(x, y)
      if (nodes.length && nodes[0] === node) {
        finish(true)
      } else {
        addVertices({ x, y })
      }
    })

    graph.on('edge:contextmenu', () => {
      finish(false)
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
