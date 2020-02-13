import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      rubberband: {
        enabled: true,
      },
    })

    graph.render({
      nodes: [
        {
          id: 'node-0',
          x: 60,
          y: 60,
          width: 80,
          height: 30,
          label: 'Hello',
        },
        {
          id: 'node-1',
          x: 240,
          y: 240,
          width: 80,
          height: 30,
          label: 'World',
        },
      ],
      edges: [
        {
          id: 'edge-0',
          source: 'node-0',
          target: 'node-1',
          label: 'Label',
        },
      ],
    })

    graph.on('selection:changed', ({ selected, added, removed }) => {})

    console.log(
      graph.model.eachChild(graph.model.getDefaultParent(), cell => {
        console.log(cell)
      }),
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
