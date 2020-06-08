import React from 'react'
import { Graph, Color } from '@antv/x6'
import '@antv/x6-react-shape'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const sourceColor = Color.random()
    const targetColor = Color.random()
    const source = graph.addNode({
      type: 'react-shape',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      component: (
        <div
          style={{
            color: Color.invert(sourceColor, true),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '60px',
            background: sourceColor,
          }}
        >
          Source
        </div>
      ),
    })

    const target = graph.addNode({
      type: 'react-shape',
      x: 200,
      y: 200,
      width: 160,
      height: 60,
      component: (
        <div
          style={{
            color: Color.invert(targetColor, true),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '60px',
            background: targetColor,
          }}
        >
          Source
        </div>
      ),
    })

    graph.addEdge({
      type: 'edge',
      source,
      target,
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
