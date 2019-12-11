import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Transform extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  state = {
    useScrollbarsForPanning: false,
  }

  componentDidMount() {
    const graph = (this.graph = new Graph(this.container))

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

    this.setState({
      useScrollbarsForPanning: graph.useScrollbarsForPanning,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onTop = () => {
    this.graph.panBy(0, -5)
  }

  onLeft = () => {
    this.graph.panBy(-5, 0)
  }

  onBottom = () => {
    this.graph.panBy(0, 5)
  }

  onRight = () => {
    this.graph.panBy(5, 0)
  }

  onCenter = () => {
    this.graph.center()
  }

  onChangeTranslateMode = (e: any) => {
    this.setState({ useScrollbarsForPanning: e.target.checked })
  }

  onZoomIn = () => {
    this.graph.zoomIn()
  }

  onZoomOut = () => {
    this.graph.zoomOut()
  }

  onReset = () => {
    this.graph.zoomActual()
  }

  onFit = () => {
    this.graph.fit()
  }

  render() {
    const useScrollbarsForPanning = this.state.useScrollbarsForPanning
    const style = useScrollbarsForPanning ? { overflow: 'auto' } : {}

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div style={{ userSelect: 'none' }}>
          <label>
            <input
              type="checkbox"
              checked={useScrollbarsForPanning}
              onChange={this.onChangeTranslateMode}
            />
            Use Scrollbars For Panning
          </label>
          <div style={{ position: 'relative', height: 96 }}>
            <button
              style={{ position: 'absolute', left: 40, top: 8 }}
              onClick={this.onTop}
            >
              ▲
            </button>
            <button
              style={{ position: 'absolute', left: 72, top: 32 }}
              onClick={this.onRight}
            >
              ▶
            </button>
            <button
              style={{ position: 'absolute', left: 40, top: 56 }}
              onClick={this.onBottom}
            >
              ▼
            </button>
            <button
              style={{ position: 'absolute', left: 8, top: 32 }}
              onClick={this.onLeft}
            >
              ◀
            </button>
            <button
              style={{ position: 'absolute', left: 41, top: 32 }}
              onClick={this.onCenter}
            >
              ▣
            </button>
            <button
              style={{ position: 'absolute', left: 120, top: 32 }}
              onClick={this.onZoomOut}
            >
              -
            </button>
            <button
              style={{ position: 'absolute', left: 144, top: 32 }}
              onClick={this.onZoomIn}
            >
              +
            </button>
            <button
              style={{ position: 'absolute', left: 171, top: 32 }}
              onClick={this.onReset}
            >
              reset
            </button>
            <button
              style={{ position: 'absolute', left: 221, top: 32 }}
              onClick={this.onFit}
            >
              fit
            </button>
          </div>
        </div>
        <div ref={this.refContainer} style={style} className="graph" />
      </div>
    )
  }
}
