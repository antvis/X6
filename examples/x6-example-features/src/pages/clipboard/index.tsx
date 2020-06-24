import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      selecting: {
        enabled: true,
      },
      clipboard: {
        enabled: true,
        useLocalStorage: true,
      },
    })

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    graph.bindKey('meta+c', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })

    graph.bindKey('meta+v', () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })

    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCopy = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      console.log(cells)
      this.graph.copy(cells)
    }
  }

  onPaste = () => {
    if (!this.graph.isClipboardEmpty()) {
      this.graph.paste()
    } else {
      console.log('empty')
    }
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Button onClick={this.onCopy} style={{ marginRight: 8 }}>
            Copy
          </Button>
          <Button onClick={this.onPaste}>Paste</Button>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
