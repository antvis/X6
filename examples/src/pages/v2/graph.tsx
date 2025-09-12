import React from 'react'
import { Graph, Path } from '@antv/x6'
import data from './data'

Graph.registerConnector(
  'algo-connector-v2',
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
  'perf-node-v2',
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
  },
  true,
)

interface Props {
  enableTextWrap: boolean
  enableVirtualRender: boolean
  length: number
}

export default class Canvas extends React.Component<Props> {
  private container!: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: false,
      connecting: {
        connector: 'algo-connector-v2',
        connectionPoint: 'anchor',
        anchor: 'center',
      },
      mousewheel: true,
      panning: true,
    })
    this.graph = graph
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.enableVirtualRender) {
      this.graph.enableVirtualRender()
    } else {
      this.graph.disableVirtualRender()
    }

    if (prevProps.length !== this.props.length) {
      this.draw(this.props.length)
    }
  }

  draw(length: number) {
    const cells: any[] = []
    if (this.props.enableTextWrap) {
      data.nodes.forEach((node: any) => {
        node.attrs = {
          text: {
            x: 28,
            y: 18,
            fontSize: 12,
            fill: '#000000a6',
            textWrap: {
              text: '深度学习',
              width: 40,
              height: 20,
              ellipsis: true,
            },
          },
        }
      })
    }
    if (length > 10) {
      cells.push(...data.nodes)
      cells.push(...data.edges.slice(0, 100 * (length - 10)))
    } else {
      cells.push(...data.nodes.slice(0, 100 * length))
    }
    this.graph.fromJSON(cells)
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
