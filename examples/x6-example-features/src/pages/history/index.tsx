import React from 'react'
import { Graph } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { History } from '@antv/x6-plugin-history'
import '../index.less'

export default class Example extends React.Component<
  {},
  { graph: Graph | undefined }
> {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    this.setState({ graph })

    const selection = new Selection({ enabled: true })
    const keyboard = new Keyboard({ enabled: true })
    const history = new History({ enabled: true, stackSize: 5 })

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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  enablePlugins = () => {
    const { graph } = this.state
    graph?.enablePlugins('keyboard')
  }

  disablePlugins = () => {
    const { graph } = this.state
    graph?.disablePlugins('keyboard')
  }

  undo = () => {
    const { graph } = this.state
    const history = graph?.getPlugin('history') as History
    history?.undo()
  }

  redo = () => {
    const { graph } = this.state
    const history = graph?.getPlugin('history') as History
    history?.redo()
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <button onClick={this.enablePlugins}>enable</button>
        <button onClick={this.disablePlugins}>disable</button>
        <button onClick={this.undo}>undo</button>
        <button onClick={this.redo}>redo</button>
      </div>
    )
  }
}
