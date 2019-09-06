import React from 'react'
import { Graph, Cell, DomEvent } from '../../../src'

export class Layers extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private layer0: Cell
  private layer1: Cell

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container)
    const root = graph.model.createRoot()
    const layer0 = root.getChildAt(0)!
    const layer1 = graph.model.createLayer()

    root.insertChild(layer1)
    graph.model.setRoot(root)

    this.graph = graph
    this.layer0 = layer0
    this.layer1 = layer1

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        parent: layer1, data: 'Hello,',
        x: 20, y: 20, width: 80, height: 30,
        style: {
          fill: '#c0c0c0',
        },
      })

      const node2 = graph.addNode({
        parent: layer1, data: 'Hello,',
        x: 200, y: 20, width: 80, height: 30,
        style: {
          fill: '#c0c0c0',
        },
      })

      const node3 = graph.addNode({
        parent: layer0, data: 'World!',
        x: 110, y: 150, width: 80, height: 30,
      })

      const edge1 = graph.addEdge({
        parent: layer1,
        sourceNode: node1,
        targetNode: node3,
        style: {
          stroke: '#712ed1',
        },
      })
      edge1.geometry!.addPoint(60, 165)

      const edge2 = graph.addEdge({
        parent: layer0,
        sourceNode: node2,
        targetNode: node3,
      })
      edge2.geometry!.addPoint(240, 165)

      const edge3 = graph.addEdge({
        parent: layer0,
        sourceNode: node1,
        targetNode: node2,
        style: {
          edge: 'topToBottom',
        },
      })
      edge3.geometry!.addPoint(150, 30)

      const edge4 = graph.addEdge({
        parent: layer1,
        sourceNode: node2,
        targetNode: node1,
        style: {
          edge: 'topToBottom',
          stroke: '#712ed1',
        },
      })
      edge4.geometry!.addPoint(150, 40)

    })
  }

  handleLayer0Click = () => {
    this.graph.model.setVisible(this.layer0, !this.graph.model.isVisible(this.layer0))
  }

  handleLayer1Click = () => {
    this.graph.model.setVisible(this.layer1, !this.graph.model.isVisible(this.layer1))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div>
        <div ref={this.refContainer} className="graph-container" />
        <div style={{ marginTop: 8, fontSize: 12 }}>
          <button onClick={this.handleLayer0Click}>Layer 0</button>
          <button onClick={this.handleLayer1Click}>Layer 1</button>
        </div>
      </div>
    )
  }
}
