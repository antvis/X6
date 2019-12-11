import React from 'react'
import { Checkbox } from 'antd'
import { Graph } from '@antv/x6'
import './index.less'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  state = { pageVisible: true, infinite: true }

  componentDidMount() {
    const graph = (this.graph = new Graph(this.container, {
      infinite: this.state.infinite,
      pageVisible: this.state.pageVisible,
      pageFormat: {
        width: 800,
        height: 960,
      },
    }))

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        data: 'Hello',
        x: 60,
        y: 60,
        width: 80,
        height: 30,
      })
      const node2 = graph.addNode({
        data: 'World',
        x: 240,
        y: 240,
        width: 80,
        height: 30,
      })
      graph.addEdge({ data: 'Edge Label', source: node1, target: node2 })
    })
  }

  onPageViewChanged = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    this.graph.setPageVisible(checked)
    this.setState({ pageVisible: checked })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{ paddingBottom: 24 }}>
          <Checkbox
            onChange={this.onPageViewChanged}
            checked={this.state.pageVisible}
          >
            Page View
          </Checkbox>
        </div>
        <div
          ref={this.refContainer}
          className="graph"
          style={{ backgroundColor: '#f8f9fa' }}
        />
      </div>
    )
  }
}
