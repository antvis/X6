import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      rubberband: true,
      guide: true,
      nodeLabelsMovable: false,
      resize: {
        // livePreview: true,
      },
      resizeHandle: {
        single: false,
      },
      rotate: {
        enabled: true,
      },
    })

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        x: 60,
        y: 60,
        width: 80,
        height: 30,
        label: 'Source',
      })

      const node2 = graph.addNode({
        x: 240,
        y: 240,
        width: 80,
        height: 30,
        label: 'Target',
      })

      graph.addEdge({ label: 'Label', source: node1, target: node2 })

      graph.addNode({ label: 'X6', x: 300, y: 120, width: 120, height: 60 })

      graph.addNode({
        x: 480,
        y: 240,
        width: 120,
        height: 60,
        label: false,
        shape: 'html',
        html:
          '<div class="outer">' +
          '<div class="inner">HTML Markup</div>' +
          '<div class="inner">New Line</div>' +
          '</div>',
        css: {
          '.outer': { width: '100%', height: '100%' },
          '.outer .inner': { textAlign: 'center', fontSize: '12px' },
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
