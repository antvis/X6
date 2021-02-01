import React from 'react'
import ReactDom from 'react-dom'
import { Button } from 'antd'
import { Graph, Edge, Node } from '@antv/x6'

class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    this.node = graph.addNode({
      x: 260,
      y: 260,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
    })

    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    const p = this.graph.clientToLocal({x: clientX, y: clientY})
    if (this.edge) {
      this.edge.setTarget(p)
    }
  }

  handleMouseDown = (e: MouseEvent) => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mousedown', this.handleMouseDown)
    const { clientX, clientY } = e
    const p = this.graph.clientToLocal({x: clientX, y: clientY})
    const node = this.graph.addNode({
      x: p.x,
      y: p.y,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
    })
    this.edge.setTarget(node)
  }

  createEdge = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const p = this.graph.clientToLocal({x: clientX, y: clientY})
    this.edge = this.graph.addEdge({
      source: this.node,
      target: p,
      attrs: {
        line: {
          strokeDasharray: '5 5',
          stroke: '#a0a0a0',
          strokeWidth: 1,
        }
      }
    })
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <Button onClick={this.createEdge}>线条</Button>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

ReactDom.render(<Example />, document.getElementById('container'))