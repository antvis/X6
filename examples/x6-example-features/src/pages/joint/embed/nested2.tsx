import React from 'react'
import { Checkbox } from 'antd'
import { joint } from '@antv/x6'
import '../../index.less'
import '../index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private parent: joint.Node
  private edge1: joint.Edge
  private edge2: joint.Edge

  state = { embedEdges: false }

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 600,
      height: 200,
    })

    const parent = graph.addNode({
      type: 'rect',
      size: { width: 100, height: 30 },
      position: { x: 100, y: 40 },
      attrs: {
        body: { fill: 'blue' },
        label: { text: 'parent', fill: 'white' },
      },
    })

    const child1 = graph
      .addNode({
        type: 'rect',
        size: { width: 80, height: 30 },
        position: { x: 70, y: 130 },
        attrs: {
          body: { fill: 'lightgreen', rx: 5, ry: 5 },
          label: { text: 'child', fill: 'white' },
        },
      })
      .addTo(parent)

    const child2 = child1
      .clone()
      .translate(100)
      .addTo(parent)

    this.parent = parent
    this.edge1 = graph.addEdge({
      type: 'edge',
      source: { cellId: parent.id },
      target: { cellId: child1.id },
    })
    this.edge2 = graph.addEdge({
      type: 'edge',
      source: { cellId: parent.id },
      target: { cellId: child2.id },
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
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ marginBottom: 24 }}>
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

namespace Example {
  export interface Props {}
  export interface State {
    embedEdges: boolean
  }
}
