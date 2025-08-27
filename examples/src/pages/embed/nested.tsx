import React from 'react'
import { Checkbox } from 'antd'
import { Graph, Node, Edge } from '../../../../src'
import '../index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private parent: Node
  private edge1: Edge
  private edge2: Edge

  // default embeded
  state = { embedEdges: true }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const parent = graph.addNode({
      size: { width: 100, height: 30 },
      position: { x: 100, y: 40 },
      attrs: {
        body: { fill: 'blue' },
        label: { text: 'parent', fill: 'white' },
      },
    })

    const child1 = graph
      .addNode({
        x: 70,
        y: 130,
        width: 80,
        height: 30,
        attrs: {
          body: { fill: 'lightgreen', rx: 5, ry: 5 },
          label: { text: 'child', fill: 'white' },
        },
      })
      .addTo(parent)

    const child2 = child1.clone().translate(100).addTo(parent)

    this.parent = parent
    this.edge1 = graph.addEdge({
      source: parent,
      target: child1,
    })
    this.edge2 = graph.addEdge({
      source: parent,
      target: child2,
      vertices: [
        { x: 210, y: 75 },
        { x: 190, y: 105 },
      ],
    })
  }

  onEmbedEdgesChanged = (e: any) => {
    const embedEdges = e.target.checked
    this.setState({ embedEdges })
    if (embedEdges) {
      this.parent.embed(this.edge1)
      this.parent.embed(this.edge2)
    } else {
      this.parent.unembed(this.edge1)
      this.parent.unembed(this.edge2)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Checkbox
            checked={this.state.embedEdges}
            onChange={this.onEmbedEdgesChanged}
          >
            Embed Edges
          </Checkbox>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

// eslint-disable-next-line
namespace Example {
  export interface Props {}
  export interface State {
    embedEdges: boolean
  }
}
