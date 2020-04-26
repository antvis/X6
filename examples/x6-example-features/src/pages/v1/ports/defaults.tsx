import React from 'react'
import { Button } from 'antd'
import { v1 } from '@antv/x6'
import '../../index.less'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private rect: v1.Node

  componentDidMount() {
    const graph = new v1.Graph({
      container: this.container,
      width: 800,
      height: 400,
      gridSize: 1,
    })

    const rect = graph.addNode({
      type: 'basic.rect',
      x: 130,
      y: 30,
      width: 100,
      height: 150,
      attrs: {
        rect: { stroke: '#31d0c6', strokeWidth: 2 },
      },
    })

    rect.addPort({
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    rect.addPort({
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    rect.addPort({
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    const circle = graph.addNode({
      type: 'basic.circle',
      x: 20,
      y: 150,
      width: 50,
      height: 50,
      attrs: {
        circle: { cx: 8, cy: 8, r: 8 },
        text: { text: 'test' },
      },
    })

    const ports = rect.getPorts()
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[0].id },
    })
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[1].id },
    })
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[2].id },
    })

    this.graph = graph
    this.rect = rect
  }

  onAddPort = () => {
    this.rect.addPort({
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })
  }

  onRemovePort = () => {
    const ports = this.rect.getPorts()
    if (ports.length) {
      this.rect.removePortAt(ports.length - 1)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Default Settings</h1>
        <div className="x6-graph-tools">
          <Button.Group>
            <Button onClick={this.onAddPort}>Add Port</Button>
            <Button onClick={this.onRemovePort}>Remove Port</Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
