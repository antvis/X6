import React from 'react'
import { Cell, Graph } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { History } from '@antv/x6-plugin-history'
import { DataTransform } from '@antv/x6-plugin-dataTransform'
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
    const dataTransform = new DataTransform<{
      cells: Array<Cell.Properties & { trans: boolean }>
    }>({
      enabled: true,
      toJsonTransform(JSONData) {
        return { cells: JSONData?.cells?.map((i) => ({ ...i, trans: true })) }
      },
    })

    graph.use(selection)
    graph.use(keyboard)
    graph.use(history)
    graph.use(dataTransform)

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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  toJSON = () => {
    const { graph } = this.state
    const json = graph?.toJSON()
    json?.cells?.forEach((cell) => {
      console.log(`
      cell: ${cell.id},
      trans: ${cell.trans}
      `)
    })
  }

  toJSONWithDiff = () => {
    const { graph } = this.state
    console.log(graph?.toJSON({ diff: true }))
  }

  toJSONWithPlugin = () => {
    const { graph } = this.state
    const transform =
      graph?.getPlugin<
        DataTransform<{ cells: Array<Cell.Properties & { trans: boolean }> }>
      >('dataTransform')
    const json = transform?.toJSON()
    json?.cells?.forEach((cell) => {
      console.log(cell.trans)
    })
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <button onClick={this.toJSON}>to JSON</button>
        <button onClick={this.toJSONWithDiff}>to JSON with diff</button>
        <button onClick={this.toJSONWithPlugin}>
          to JSON with transform plugin
        </button>
      </div>
    )
  }
}
