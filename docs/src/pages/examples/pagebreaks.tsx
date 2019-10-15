import React from 'react'
import { Button, Checkbox } from 'antd'
import { Graph } from '../../../../src'

export default class PageBreaks extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  state = {
    pageBreaksVisible: true
  }

  componentDidMount() {
    const pageFormat = { x: 0, y: 0, width: 100, height: 160 }
    const graph = new Graph(this.container, {
      pageFormat,
      pageVisible: true,
      pageBreak: {
        enabled: this.state.pageBreaksVisible,
        dsahed: true,
        stroke: '#ff0000',
      },
      movingPreview: {
        scaleGrid: true,
      },
      preferPageSize: true,
      centerZoom: false,
    })

    graph.batchUpdate(() => {
      const n1 = graph.addNode({ data: 'Hello', x: 60, y: 60, width: 80, height: 30 })
      const n2 = graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 30 })
      graph.addEdge({ source: n1, target: n2 })
    })

    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  togglePageBreak = (e: any) => {
    const checked = e.target.checked
    this.setState({ pageBreaksVisible: checked })
    this.graph.togglePageBreak()
    this.graph.sizeDidChange()
  }

  reset = () => {
    this.graph.view.scaleAndTranslate(1, 0, 0)
  }

  zoomIn = () => {
    this.graph.zoomIn()
  }

  zoomOut = () => {
    this.graph.zoomOut()
  }

  render() {
    return (
      <div>
        <div style={{ padding: '16px 0', userSelect: 'none' }}>
          <Checkbox checked={this.state.pageBreaksVisible} onChange={this.togglePageBreak}>
            PageBreaks
          </Checkbox>
          <Button style={{ marginLeft: 8 }} onClick={this.zoomIn}>ZoomIn</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.zoomOut}>ZoomOut</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.reset}>Reset</Button>
        </div>
        <div
          ref={this.refContainer}
          tabIndex={-1}
          className="graph-container big"
        />
      </div>
    )
  }
}
