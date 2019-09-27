import React from 'react'
import { Graph, DomEvent } from '../../../../src'

export default class Test extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container, {
      rubberband: true,
      guide: true,
      nodeLabelsMovable: false,
      resize: {
        livePreview: true,
      },
      resizeHandle: {
        single: false,
      },
      rotate: {
        enabled: true,
      }
    })

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        data: 'Source',
        x: 60, y: 60, width: 80, height: 30,
      })

      const node2 = graph.addNode({
        data: 'Target',
        x: 240, y: 240, width: 80, height: 30,
      })

      graph.addEdge({ data: 'Label', source: node1, target: node2 })

      graph.addNode({ data: 'X6', x: 300, y: 120, width: 120, height: 60 })

      graph.addNode({
        data: '<div class="outer">' +
          '<div class="inner">HTML Markup</div>' +
          '<div class="inner">New Line</div>' +
          '</div>',
        x: 480,
        y: 240,
        width: 120,
        height: 60,
        style: {
          shape: 'html',
          noLabel: true,
          css: {
            '.outer': { width: '100%', height: '100%' },
            '.outer .inner': { textAlign: 'center', fontSize: '12px' },
          },
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div>
        <div
          ref={this.refContainer}
          className="graph-container big"
        />
      </div>

    )
  }
}
