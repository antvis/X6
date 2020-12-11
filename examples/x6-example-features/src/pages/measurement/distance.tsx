import React from 'react'
import { Graph, Cell, Edge, EdgeView } from '@antv/x6'
import './distance-shape'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1080,
      height: 720,
      async: true,
      frozen: true,
      rotating: {
        enabled: true,
      },
      resizing: {
        enabled: true,
      },
      interacting: {
        edgeMovable: false,
      },
      checkView({ view }) {
        const cell = view.cell
        if (cell.isEdge()) {
          const edgeView = view as EdgeView
          if (
            view.container.parentNode &&
            edgeView.getConnectionLength() === 0
          ) {
            return false
          }
          if (cell.prop<boolean>('showOnRotated')) {
            const target = cell.getTargetCell()
            if (target && target.isNode()) {
              return target.getAngle() % 90 > 0
            }
            return false
          }
        }
        return true
      },
    })

    const rect1 = graph.addNode({ shape: 'distance-node', x: 500, y: 400 })
    const rect2 = graph.addNode({ shape: 'distance-node', x: 100, y: 100 })
    const rect3 = graph.addNode({
      shape: 'distance-node',
      x: 800,
      y: 300,
      angle: 30,
    })

    // #region Node Measurements

    graph.addEdge({
      shape: 'distance-edge-main',
      showOnRotated: true,
      source: {
        cell: rect3,
        anchor: { name: 'topRight', args: { dy: -50 } },
        connectionPoint: { name: 'anchor' },
      },
      target: {
        cell: rect3,
        anchor: { name: 'topLeft', args: { dy: -50 } },
        connectionPoint: { name: 'anchor' },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect3,
        anchor: { name: 'topRight', args: { rotate: true } },
        connectionPoint: { name: 'anchor', args: { offset: { y: -25 } } },
      },
      target: {
        cell: rect3,
        anchor: { name: 'topLeft', args: { rotate: true } },
        connectionPoint: { name: 'anchor', args: { offset: { y: 25 } } },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect3,
        anchor: { name: 'topLeft', args: { rotate: true } },
        connectionPoint: { name: 'anchor', args: { offset: { y: -25 } } },
      },
      target: {
        cell: rect3,
        anchor: { name: 'bottomLeft', args: { rotate: true } },
        connectionPoint: { name: 'anchor', args: { offset: { y: 25 } } },
      },
    })

    // #endregion

    // #region Distance Between Nodes

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect2,
        anchor: { name: 'bottomRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'right', alignOffset: 30 },
        },
      },
      target: {
        cell: rect1,
        anchor: { name: 'topRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'right', alignOffset: 30 },
        },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-main',
      source: {
        cell: rect2,
        anchor: { name: 'bottomLeft' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'bottom', alignOffset: 60 },
        },
      },
      target: {
        cell: rect1,
        anchor: { name: 'bottomRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'bottom', alignOffset: 60 },
        },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect2,
        anchor: { name: 'bottomRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'bottom', alignOffset: 30 },
        },
      },
      target: {
        cell: rect1,
        anchor: { name: 'bottomLeft' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'bottom', alignOffset: 30 },
        },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-main',
      source: {
        cell: rect2,
        anchor: { name: 'topRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'right', alignOffset: 60 },
        },
      },
      target: {
        cell: rect1,
        anchor: { name: 'bottomRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'right', alignOffset: 60 },
        },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect2,
        anchor: { name: 'bottomLeft' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'left', alignOffset: 60 },
        },
      },
      target: {
        cell: rect1,
        anchor: { name: 'topLeft' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'left', alignOffset: 60 },
        },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect2,
        anchor: { name: 'topRight' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'top', alignOffset: 60 },
        },
      },
      target: {
        cell: rect1,
        anchor: { name: 'topLeft' },
        connectionPoint: {
          name: 'anchor',
          args: { align: 'top', alignOffset: 60 },
        },
      },
    })

    graph.addEdge({
      shape: 'distance-edge-normal',
      source: {
        cell: rect2,
        anchor: { name: 'bottomRight' },
        connectionPoint: { name: 'anchor', args: { offset: { y: 60 } } },
      },
      target: {
        cell: rect1,
        anchor: { name: 'topLeft' },
        connectionPoint: { name: 'anchor', args: { offset: { y: -60 } } },
      },
    })

    // #endregion

    graph.unfreeze()
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
