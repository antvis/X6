import React from 'react'
import { Button } from 'antd'
import { Graph, Keyboard, Selection } from '@antv/x6'
import '../index.less'

export class KeyboardExample extends React.Component {
  private container!: HTMLDivElement
  private graph!: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    const selection = new Selection()
    const keyboard = new Keyboard()
    graph.use(selection)
    graph.use(keyboard)

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

    keyboard.bindKey('backspace', () => {
      graph.removeCells(selection.getSelectedCells())
    })

    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  enablePlugins = () => {
    this.graph.enablePlugins('keyboard')
  }

  disablePlugins = () => {
    this.graph.disablePlugins('keyboard')
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <Button onClick={this.enablePlugins}>enable</Button>
        <Button onClick={this.disablePlugins}>disable</Button>
      </div>
    )
  }
}
