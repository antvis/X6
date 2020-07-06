import React from 'react'
import { Select } from 'antd'
import { Graph, Edge } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    graph.addNode({
      id: 'a',
      label: 'a',
      shape: 'rect',
      width: 40,
      height: 40,
      x: 100,
      y: 100,
    })

    graph.addNode({
      id: 'b',
      label: 'b',
      shape: 'rect',
      width: 40,
      height: 40,
      x: 300,
      y: 100,
    })

    graph.addNode({
      id: 'c',
      label: 'c',
      shape: 'rect',
      width: 40,
      height: 40,
      x: 500,
      y: 100,
    })

    this.edge1 = graph.addEdge({
      source: 'a',
      target: 'b',
    })

    this.edge2 = graph.addEdge({
      source: 'b',
      target: 'c',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onMarkerChanged = (marker: string) => {
    console.log(marker)
    this.edge1.attr('line/targetMarker', marker)
    this.edge2.attr('line/targetMarker', marker)
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Select style={{ width: 120 }} onChange={this.onMarkerChanged}>
            <Select.Option value="block">block</Select.Option>
            <Select.Option value="classic">classic</Select.Option>
            <Select.Option value="diamond">diamond</Select.Option>
            <Select.Option value="circle">circle</Select.Option>
            <Select.Option value="circlePlus">circle plus</Select.Option>
            <Select.Option value="ellipse">ellipse</Select.Option>
            <Select.Option value="cross">cross</Select.Option>
            <Select.Option value="async">async</Select.Option>
          </Select>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
