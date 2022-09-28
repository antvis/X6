import React from 'react'
import { Graph } from '@antv/x6'
import { Scroller } from '@antv/x6-plugin-scroller'
import '../index.less'
import './index.less'

export default class Example extends React.Component {
  private graph: Graph
  private graphContainer: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.graphContainer,
      width: 800,
      height: 500,
      background: {
        color: '#f5f5f5',
      },
      grid: {
        visible: true,
      },
      mousewheel: {
        enabled: true,
        // fixed: false,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
      },
    })

    graph.use(
      new Scroller({
        enabled: true,
        // width: 600,
        // height: 400,
        pageVisible: true,
        pageBreak: true,
        pannable: {
          enabled: true,
          eventTypes: ['leftMouseDown', 'rightMouseDown'],
        },
      }),
    )

    graph.addNode({
      shape: 'rect',
      x: 300,
      y: 300,
      width: 90,
      height: 60,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 2 },
        text: { text: 'rect', fill: 'white' },
      },
      ports: [{}],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.graphContainer = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Scroller</h1>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
