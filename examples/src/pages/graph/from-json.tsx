import React from 'react'
import { Graph } from '@antv/x6'

const JSON1 = {
  nodes: [
    {
      id: 'node1',
      label: 'node1',
      x: 10,
      y: 20,
      width: 50,
      height: 50,
      shape: 'rect',
    },
    {
      id: 'node2',
      label: 'node2',
      x: 100,
      y: 200,
      width: 50,
      height: 50,
      shape: 'rect',
    },
  ],
  edges: [{ id: 'edge1', source: 'node1', target: 'node2' }],
}

const JSON2 = {
  nodes: [
    {
      id: 'node1',
      label: 'node1',
      x: 10,
      y: 20,
      width: 50,
      height: 50,
      shape: 'rect',
    },
    {
      id: 'node2',
      label: 'node2',
      x: 100,
      y: 200,
      width: 50,
      height: 50,
      shape: 'rect',
    },
    {
      id: 'node3',
      label: 'node3',
      x: 300,
      y: 100,
      width: 60,
      height: 60,
      shape: 'circle',
    },
    {
      id: 'node4',
      label: 'node4',
      x: 300,
      y: 300,
      width: 50,
      height: 50,
      shape: 'rect',
    },
  ],
  edges: [
    {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
    },
    { id: 'edge2', label: 'edge2', source: 'node3', target: 'node4' },
  ],
}

export class GraphFromJSONExample extends React.Component {
  private container!: HTMLDivElement
  private graph!: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
    })

    graph.fromJSON(JSON1)
    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        className="x6-graph-wrap"
        style={{ width: 800, margin: '20px auto' }}
      >
        <button
          style={{ marginBottom: 12 }}
          onClick={() => this.graph.fromJSON(JSON2, { diff: true })}
        >
          Update JSON
        </button>
        <div
          style={{ height: 500 }}
          ref={this.refContainer}
          className="x6-graph"
        />
      </div>
    )
  }
}
