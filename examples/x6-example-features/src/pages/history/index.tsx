import React from 'react'
import { Graph, History } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Button } from 'antd'
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
    })

    const selection = new Selection()
    const keyboard = new Keyboard()
    const history = new History({ stackSize: 5 })

    graph.use(selection)
    graph.use(keyboard)
    graph.use(history)

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
    keyboard.bindKey('command+z', () => {
      this.undo()
    })
    keyboard.bindKey('command+shift+z', () => {
      this.redo()
    })

    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  enablePlugins = () => {
    this.graph.enablePlugins('history')
  }

  disablePlugins = () => {
    this.graph.disablePlugins('history')
  }

  undo = () => {
    const history = this.graph.getPlugin('history') as History
    history.undo()
  }

  redo = () => {
    const history = this.graph.getPlugin('history') as History
    history.redo()
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <Button onClick={this.enablePlugins}>enable</Button>
        <Button onClick={this.disablePlugins}>disable</Button>
        <Button onClick={this.undo}>undo</Button>
        <Button onClick={this.redo}>redo</Button>
      </div>
    )
  }
}
