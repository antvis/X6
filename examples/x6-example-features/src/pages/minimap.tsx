import React from 'react'
import { Graph, MiniMap } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

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
          label: 'Edge Label',
        },
      ],
    })

    new MiniMap(graph, {
      container: this.minimapContainer,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMap = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div ref={this.refContainer} className="graph" />
        <div
          ref={this.refMiniMap}
          style={{
            width: 300,
            height: 200,
            position: 'absolute',
            top: 24,
            right: 24,
            border: '1px solid #e9e9e9',
            zIndex: 999,
            background: '#ccc',
            boxShadow: '0 0 2px 1px #e9e9e9',
          }}
        />
      </div>
    )
  }
}
