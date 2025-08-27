import React from 'react'
import { Graph, Node, Path } from '../../../../src'
import '../index.less'

Graph.registerConnector(
  'algo-connector',
  (s, e) => {
    const offset = 4
    const deltaY = Math.abs(e.y - s.y)
    const control = Math.floor((deltaY / 3) * 2)

    const v1 = { x: s.x, y: s.y + offset + control }
    const v2 = { x: e.x, y: e.y - offset - control }

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `,
    )
  },
  true,
)

Graph.registerNode(
  'algo-node',
  {
    width: 144,
    height: 28,
    markup: [
      {
        tagName: 'rect',
      },
      {
        tagName: 'image',
      },
      {
        tagName: 'text',
      },
    ],
    attrs: {
      rect: {
        rx: 14,
        ry: 14,
        refWidth: '100%',
        refHeight: '100%',
        fill: '#FFF',
        stroke: '#5f95ff',
        strokeWidth: 1,
      },
      image: {
        x: 2,
        y: 2,
        width: 24,
        height: 24,
        xlinkHref:
          'https://gw.alipayobjects.com/zos/bmw-prod/d9f3b597-3a2e-49c3-8469-64a1168ed779.svg',
      },
      text: {
        x: 28,
        y: 18,
        text: '深度学习',
        fontSize: 12,
        fill: '#000000a6',
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c5c5c5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c5c5c5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      connecting: {
        connector: 'algo-connector',
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#c5c5c5',
                strokeWidth: 1,
                targetMarker: null,
              },
            },
            zIndex: -1,
          })
        },
      },
    })

    graph.addNode({
      shape: 'algo-node',
      width: 144,
      height: 28,
      x: 200,
      y: 200,
      ports: {
        items: [
          {
            id: '1',
            group: 'bottom',
          },
          {
            id: '2',
            group: 'bottom',
          },
        ],
      },
    })

    graph.addNode({
      shape: 'algo-node',
      x: 200,
      y: 400,
      width: 144,
      height: 28,
      ports: {
        items: [
          {
            id: '3',
            group: 'top',
          },
        ],
      },
    })

    graph.on('edge:connected', ({ currentCell, currentPort }) => {
      const node = currentCell as Node
      node.setPortProp(currentPort as string, 'markup', [
        {
          tagName: 'path',
          attrs: {
            fill: '#808080',
            d: 'M -1 1 L 7 1 L 3 5 L -1 1 Z',
            style: 'transform: translateY(-1px)',
          },
        },
      ])
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
