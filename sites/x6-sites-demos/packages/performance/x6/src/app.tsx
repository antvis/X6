import React from 'react'
import { Input } from 'antd'
import { Graph, Path, FunctionExt } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'perf-node',
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
        text: '性能测试',
        fontSize: 12,
        fill: '#333',
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
      },
      items: [
        {
          group: 'top',
        },
        {
          group: 'bottom',
        },
      ]
    },
  },
  true,
)

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

const createMockData = (nodeNum: number, edgeNum: number) => {
  const nodes = []
  const edges = []
  for (let i = 0; i < nodeNum; i += 1) {
    const x = Math.floor(Math.random() * 800)
    const y = Math.floor(Math.random() * 800)
    nodes.push({
      id: `node_${i}`,
      shape: 'perf-node',
      x,
      y,
      ports: {
        items: [
          {
            id: `node_${i}_top`,
            group: 'top'
          },
          {
            id: `node_${i}_bottom`,
            group: 'bottom'
          }
        ]
      }
    })
  }
  for (let i = 0; i < edgeNum; i += 1) {
    const sourceId = `node_${Math.floor(Math.random() * nodeNum)}`
    const targetId = `node_${Math.floor(Math.random() * nodeNum)}`
    edges.push({
      id: `edge_${i}`,
      source: {
        cell: sourceId,
        port: `${sourceId}_bottom`
      },
      target: {
        cell: targetId,
        port: `${targetId}_top`
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      zIndex: -1
    })
  }

  return { nodes, edges }
}

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement

  state = {
    value: '',
  }

  componentDidMount() {
     this.graph = new Graph({
      width: 800,
      height: 800,
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        connector: 'algo-connector',
        connectionPoint: 'anchor',
        anchor: 'center',
      },
      panning: true,
      mousewheel: true,
    })
  }

  onValueChange = (val: string) => {
    this.setState({
      value: val,
    }, () => {
      this.draw()
    })
  }

  draw = FunctionExt.debounce(() => {
    const val = this.state.value
    const count = val.length * 100
    this.graph.fromJSON(createMockData(count, count))
  }, 200)

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="input">
          <Input
            value={this.state.value}
            onChange={(e) => this.onValueChange(e.target.value)}
            maxLength={20}
            placeholder="输入任意字符，渲染节点和边"
          />
          <div className="text">节点：{this.state.value.length * 100}，边：{this.state.value.length * 100}</div>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
