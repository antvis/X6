import * as React from 'react'
import { Graph, Cell } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './shapes'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      height: 200,
      grid: {
        visible: true,
      },
    })
    this.onChanged(defaults)
  }

  onChanged = (settgins: State) => {
    const node = this.graph.createNode({ shape: 'performance_node' })
    const edge = this.graph.createEdge({ shape: 'performance_edge' })
    const cells: Cell[] = []

    Array.from({ length: settgins.count / 2 }).forEach((_, n) => {
      const a = node
        .clone()
        .position(n * 110 + 20, 20)
        .attr('label/text', n + 1)
      const b = node
        .clone()
        .position(n * 100 + 20, 150)
        .attr('label/text', n + 1 + settgins.count / 2)
      const ab = edge.clone().setSource(a).setTarget(b)
      cells.push(a, b, ab)
    })

    const startTime = new Date().getTime()
    const showResult = () => {
      const duration = (new Date().getTime() - startTime) / 1000
      const elapsed = document.getElementById('elapsed')!

      elapsed.innerText = `render ${settgins.count} nodes and ${
        settgins.count / 2
      } edges in ${duration}s`
    }

    this.graph.resize((settgins.count / 2) * 110)
    this.graph.setAsync(settgins.async)
    this.graph.resetCells(cells)
    if (settgins.async) {
      this.graph.on('render:done', showResult)
    } else {
      showResult()
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content">
          <div ref={this.refContainer} />
        </div>
      </div>
    )
  }
}
