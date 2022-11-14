import React from 'react'
import { Graph } from '@antv/x6'
import { Button } from 'antd'

import './app.css'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

const commands = [
  {
    key: 'zoomIn',
    label: 'ZoomIn(0.2)',
  },
  {
    key: 'zoomOut',
    label: 'ZoomOut(-0.2)',
  },
  {
    key: 'zoomTo',
    label: 'ZoomTo(1)',
  },
  {
    key: 'zoomToFit',
    label: 'ZoomToFit',
  },
  {
    key: 'centerContent',
    label: 'CenterContent',
  },
]

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      panning: true,
      mousewheel: true,
    })

    graph.fromJSON(data)
    graph.centerContent()
    this.graph = graph
  }

  transform = (command: string) => {
    switch (command) {
      case 'translate':
        this.graph.translate(20, 20)
        break
      case 'zoomIn':
        this.graph.zoom(0.2)
        break
      case 'zoomOut':
        this.graph.zoom(-0.2)
        break
      case 'zoomTo':
        this.graph.zoomTo(1)
        break
      case 'zoomToFit':
        this.graph.zoomToFit()
        break
      case 'centerContent':
        this.graph.centerContent()
        break
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-btns">
          <Button.Group>
            {commands.map((item) => (
              <Button onClick={() => this.transform(item.key)} key={item.key}>
                {item.label}
              </Button>
            ))}
          </Button.Group>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
