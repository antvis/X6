import React from 'react'
import { Graph, Shape } from '@antv/x6'

Shape.Rect.config({
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
      },
      out: {
        position: { name: 'bottom' },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
      attrs: {
        magnet: 'true',
        r: 6,
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 2,
      },
    },
  ],
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        padding: 3,
        attrs: {
          strokeWidth: 3,
          stroke: '#52c41a',
        },
      },
    }

    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        dangling: false,
        snap: true,
        highlight: true,
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },

        validateConnection({
          sourceView,
          sourceMagnet,
          targetView,
          targetMagnet,
        }) {
          // 不允许连接到自己
          if (sourceView === targetView) {
            return false
          }

          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Source',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    const target = graph.addNode({
      x: 140,
      y: 240,
      width: 100,
      height: 40,
      label: 'Target',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addNode({
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'Hello',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out-2' },
      target: { cell: target.id, port: 'in-1' },
      tools: [
        {
          name: 'source-arrowhead',
        },
        {
          name: 'target-arrowhead',
        },
      ],
    })

    // graph.on('edge:mouseenter', ({ cell }) => {
    //   cell.addTools([
    //     {
    //       name: 'source-arrowhead',
    //     },
    //     {
    //       name: 'target-arrowhead',
    //     },
    //   ])
    // })

    // graph.on('edge:mouseleave', ({ cell }) => {
    //   cell.removeTools()
    // })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
