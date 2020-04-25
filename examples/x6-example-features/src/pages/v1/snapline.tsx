import React from 'react'
import { joint } from '@antv/x6'
import { Snapline } from '@antv/x6/es/research/addon/snapline'
import { Transform } from '@antv/x6/es/research/addon/transform'
import '../index.less'
import './index.less'
import '../../../../../packages/x6/src/research/addon/snapline/index.less'
import '../../../../../packages/x6/src/research/addon/transform/index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 1,
    })

    graph.addNode({
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      type: 'circle',
      x: 250,
      y: 80,
      width: 50,
      height: 50,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      type: 'ellipse',
      x: 350,
      y: 150,
      width: 80,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    new Snapline({
      graph,
    })

    graph.on('node:mouseup', ({ node }) => {
      new Transform({
        graph,
        node,
        padding: 5,
      })
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
